import * as THREE from 'three';
import { CIRCUIT_WAYPOINTS, RALLY_WAYPOINTS } from './world.js';

export const EVENTS_CONFIG = [
  {
    id: 'free',
    name: 'Свободная езда (Free Roam)',
    tag: 'Исследование',
    desc: 'Катайся по всей карте без ограничений, выполняй прыжки на трамплинах и ставь рекорды дрифта.',
    spawn: { x: 0, z: 175, rotY: Math.PI / 2 },
    laps: 0,
    checkpoints: []
  },
  {
    id: 'circuit',
    name: 'Horizon Grand Prix (Кольцо)',
    tag: 'Асфальт • 2 круга',
    desc: 'Скоростная кольцевая гонка на 2 круга по асфальту. Держи идеальную траекторию и жми нитро на прямых.',
    spawn: { x: -10, z: 180, rotY: Math.PI / 2 },
    laps: 2,
    checkpoints: CIRCUIT_WAYPOINTS
  },
  {
    id: 'rally',
    name: 'Rally Mountain Sprint (Спринт)',
    tag: 'Грунтовка • Точка-Точка',
    desc: 'Грунтовый спринт по горной тропе через трамплины и шпильки до вершины.',
    spawn: { x: 125, z: -210, rotY: -Math.PI / 2 },
    laps: 1,
    checkpoints: RALLY_WAYPOINTS
  },
  {
    id: 'drift',
    name: 'Gymkhana Drift (60 сек)',
    tag: 'Дрифт-челлендж',
    desc: 'За 60 секунд набери максимальное количество очков заноса. Не врезайся, чтобы не потерять множитель!',
    spawn: { x: 0, z: 0, rotY: 0 },
    laps: 1,
    timeLimit: 60,
    checkpoints: []
  }
];

export class EventManager {
  constructor(scene, onNotification, onAudioTrigger) {
    this.scene = scene;
    this.onNotification = onNotification || (() => {});
    this.onAudioTrigger = onAudioTrigger || (() => {});

    this.currentEvent = EVENTS_CONFIG[0];
    this.state = 'idle'; // 'idle', 'running', 'finished'
    this.time = 0;
    this.lap = 1;
    this.cpIndex = 0;
    
    // Scoring & Stunts
    this.driftScore = 0;
    this.driftCombo = 1.0;
    this.currentDriftPoints = 0;
    this.maxJumpDist = 0;
    this.jumpStartPos = null;

    this.buildCheckpointMarkers();
    this.loadRecords();
  }

  loadRecords() {
    try {
      this.records = JSON.parse(localStorage.getItem('rally_horizon_records') || '{}');
    } catch (e) {
      this.records = {};
    }
  }

  saveRecord(key, val) {
    this.records[key] = val;
    try {
      localStorage.setItem('rally_horizon_records', JSON.stringify(this.records));
    } catch (e) {}
  }

  getBestRecord(id) {
    return this.records[id] || null;
  }

  buildCheckpointMarkers() {
    this.markerGroup = new THREE.Group();
    
    // Gate arch
    const ringGeo = new THREE.TorusGeometry(6, 0.4, 8, 24);
    ringGeo.rotateY(Math.PI / 2);
    this.markerMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    this.markerMesh = new THREE.Mesh(ringGeo, this.markerMat);
    this.markerMesh.position.y = 5;

    // Glowing vertical guide column
    const colGeo = new THREE.CylinderGeometry(0.2, 0.2, 20, 8);
    const colMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const colMesh = new THREE.Mesh(colGeo, colMat);
    colMesh.position.y = 10;
    this.markerMesh.add(colMesh);

    this.markerGroup.add(this.markerMesh);
    this.markerGroup.visible = false;
    this.scene.add(this.markerGroup);
  }

  setEvent(eventId) {
    const ev = EVENTS_CONFIG.find(e => e.id === eventId) || EVENTS_CONFIG[0];
    this.currentEvent = ev;
    this.reset();
  }

  reset() {
    this.state = 'idle';
    this.time = 0;
    this.lap = 1;
    this.cpIndex = 0;
    this.driftScore = 0;
    this.driftCombo = 1.0;
    this.currentDriftPoints = 0;
    this.maxJumpDist = 0;
    this.jumpStartPos = null;
    this.updateMarkerPosition();
  }

  start() {
    this.state = 'running';
    this.time = 0;
    this.lap = 1;
    this.cpIndex = 0;
    this.driftScore = 0;
    this.updateMarkerPosition();
    this.onNotification(`Старт: ${this.currentEvent.name}!`, 'info');
  }

  updateMarkerPosition() {
    const cps = this.currentEvent.checkpoints;
    if (cps && cps.length > 0 && this.state === 'running') {
      const target = cps[this.cpIndex];
      this.markerGroup.position.copy(target);
      this.markerGroup.visible = true;
    } else {
      this.markerGroup.visible = false;
    }
  }

  update(carPos, speedKmh, isDrifting, isAirborne, dt) {
    // Pulse and rotate checkpoint marker
    if (this.markerGroup.visible) {
      this.markerMesh.rotation.y += dt * 2;
    }

    // 1. Airtime and Jump calculation
    if (isAirborne) {
      if (!this.jumpStartPos) {
        this.jumpStartPos = carPos.clone();
      }
    } else if (this.jumpStartPos) {
      const dist = Math.round(this.jumpStartPos.distanceTo(carPos));
      this.jumpStartPos = null;
      if (dist > 8) {
        const bonus = dist * 15;
        this.driftScore += bonus;
        this.onNotification(`ПРЫЖОК: ${dist}м! +${bonus} PTS`, 'stunt');
        this.onAudioTrigger('checkpoint');
      }
    }

    // 2. Drift points calculation
    if (isDrifting && speedKmh > 35) {
      this.currentDriftPoints += (speedKmh * 1.5 * dt);
      this.driftCombo = Math.min(4.0, this.driftCombo + dt * 0.4);
    } else if (this.currentDriftPoints > 0) {
      // Bank drift points
      const awarded = Math.round(this.currentDriftPoints * this.driftCombo);
      this.driftScore += awarded;
      if (awarded > 300) {
        this.onNotification(`ДРИФТ x${this.driftCombo.toFixed(1)}: +${awarded} PTS`, 'drift');
      }
      this.currentDriftPoints = 0;
      this.driftCombo = 1.0;
    }

    if (this.state !== 'running') return;

    this.time += dt;

    // Check drift challenge timer
    if (this.currentEvent.id === 'drift') {
      const timeLeft = Math.max(0, this.currentEvent.timeLimit - this.time);
      if (timeLeft <= 0) {
        this.finish();
      }
      return;
    }

    // Check checkpoints in races
    const cps = this.currentEvent.checkpoints;
    if (cps && cps.length > 0) {
      const target = cps[this.cpIndex];
      const distToCp = Math.hypot(carPos.x - target.x, carPos.z - target.z);

      if (distToCp < 15) {
        this.cpIndex++;
        this.onAudioTrigger('checkpoint');

        if (this.cpIndex >= cps.length) {
          if (this.currentEvent.laps > this.lap) {
            this.lap++;
            this.cpIndex = 0;
            this.onNotification(`КРУГ ${this.lap}/${this.currentEvent.laps}!`, 'info');
          } else {
            this.finish();
            return;
          }
        } else {
          this.onNotification(`Чекпоинт ${this.cpIndex}/${cps.length}`, 'info');
        }
        this.updateMarkerPosition();
      }
    }
  }

  finish() {
    this.state = 'finished';
    this.markerGroup.visible = false;
    this.onAudioTrigger('finish');

    let resultMsg = '';
    const evId = this.currentEvent.id;

    if (evId === 'drift') {
      const total = Math.round(this.driftScore);
      const prev = this.getBestRecord('drift') || 0;
      if (total > prev) {
        this.saveRecord('drift', total);
        resultMsg = `Новый рекорд дрифта: ${total} PTS!`;
      } else {
        resultMsg = `Финиш! Очки: ${total} (Рекорд: ${prev})`;
      }
    } else {
      const finalTime = this.time.toFixed(2);
      const prev = this.getBestRecord(evId);
      if (!prev || parseFloat(finalTime) < parseFloat(prev)) {
        this.saveRecord(evId, finalTime);
        resultMsg = `Новый рекорд круга: ${finalTime}с!`;
      } else {
        resultMsg = `Время: ${finalTime}с (Рекорд: ${prev}с)`;
      }
    }

    this.onNotification(resultMsg, 'finish');
  }
}
