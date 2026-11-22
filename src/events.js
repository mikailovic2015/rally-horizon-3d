import * as THREE from 'three';
import { CIRCUIT_WAYPOINTS, RALLY_WAYPOINTS, SPEED_TRAPS, TESTDRIVE_SPAWN } from './world.js';

export const EVENTS_CONFIG = [
  {
    id: 'free',
    name: 'Свободная езда (Free Roam)',
    tag: 'Исследование',
    desc: 'Катайся по всей карте без ограничений.',
    spawn: { x: 0, z: 175, rotY: Math.PI / 2 },
    laps: 0,
    checkpoints: []
  },
  {
    id: 'circuit',
    name: 'Horizon Grand Prix (Кольцо)',
    tag: 'Асфальт • 2 круга',
    desc: 'Кольцевая гонка на 2 круга по асфальту.',
    spawn: { x: -10, z: 180, rotY: Math.PI / 2 },
    laps: 2,
    rewardBase: 2000,
    checkpoints: CIRCUIT_WAYPOINTS
  },
  {
    id: 'rally',
    name: 'Rally Mountain Sprint (Спринт)',
    tag: 'Грунтовка • Точка-Точка',
    desc: 'Грунтовый ралли-спринт по горной тропе.',
    spawn: { x: 125, z: -210, rotY: -Math.PI / 2 },
    laps: 1,
    rewardBase: 1500,
    checkpoints: RALLY_WAYPOINTS
  },
  {
    id: 'drift',
    name: 'Gymkhana Drift (60 сек)',
    tag: 'Дрифт-челлендж',
    desc: 'За 60 секунд набери очки заноса!',
    spawn: { x: 0, z: 0, rotY: 0 },
    laps: 1,
    timeLimit: 60,
    rewardBase: 800,
    checkpoints: []
  },
  {
    id: 'testdrive',
    name: 'Полигон (Тест-Драйв)',
    tag: 'Тест-Драйв',
    desc: 'Испытай любую машину на закрытом полигоне.',
    spawn: TESTDRIVE_SPAWN,
    laps: 0,
    checkpoints: []
  }
];

const CR_KEY = 'horizon_credits';
const OWNED_CARS_KEY = 'horizon_owned_cars';
const OWNED_SKINS_KEY = 'horizon_owned_skins';
const DEFAULT_CREDITS = 1500;

export function getCredits() {
  try {
    const val = localStorage.getItem(CR_KEY);
    if (val === null || val === undefined) {
      localStorage.setItem(CR_KEY, DEFAULT_CREDITS.toString());
      return DEFAULT_CREDITS;
    }
    return parseInt(val, 10) || 0;
  } catch (e) {
    return DEFAULT_CREDITS;
  }
}

export function addCredits(amount) {
  const cur = getCredits();
  const next = cur + amount;
  try { localStorage.setItem(CR_KEY, next.toString()); } catch (e) {}
  return next;
}

export function spendCredits(amount) {
  const cur = getCredits();
  if (cur < amount) return false;
  try { localStorage.setItem(CR_KEY, (cur - amount).toString()); } catch (e) {}
  return true;
}

export function getOwnedCars() {
  try {
    const val = localStorage.getItem(OWNED_CARS_KEY);
    if (!val) {
      const def = ['rally_wrc'];
      localStorage.setItem(OWNED_CARS_KEY, JSON.stringify(def));
      return def;
    }
    return JSON.parse(val);
  } catch (e) {
    return ['rally_wrc'];
  }
}

export function isCarOwned(carId) {
  return getOwnedCars().includes(carId);
}

export function buyCar(carId) {
  const owned = getOwnedCars();
  if (owned.includes(carId)) return true;
  owned.push(carId);
  try { localStorage.setItem(OWNED_CARS_KEY, JSON.stringify(owned)); } catch (e) {}
  return true;
}

export function getOwnedSkins() {
  try {
    const val = localStorage.getItem(OWNED_SKINS_KEY);
    if (!val) {
      const def = {};
      localStorage.setItem(OWNED_SKINS_KEY, JSON.stringify(def));
      return def;
    }
    return JSON.parse(val);
  } catch (e) {
    return {};
  }
}

export function isSkinOwned(carId, skinId) {
  if (skinId === 'stock') return true;
  const skins = getOwnedSkins();
  return skins[carId] && skins[carId].includes(skinId);
}

export function buySkin(carId, skinId) {
  const skins = getOwnedSkins();
  if (!skins[carId]) skins[carId] = [];
  if (!skins[carId].includes(skinId)) skins[carId].push(skinId);
  try { localStorage.setItem(OWNED_SKINS_KEY, JSON.stringify(skins)); } catch (e) {}
  return true;
}

export class EventManager {
  constructor(scene, onNotification, onAudioTrigger, onCountdown, onFinishModal) {
    this.scene = scene;
    this.onNotification = onNotification || (() => {});
    this.onAudioTrigger = onAudioTrigger || (() => {});
    this.onCountdown = onCountdown || (() => {});
    this.onFinishModal = onFinishModal || (() => {});

    this.currentEvent = EVENTS_CONFIG[0];
    this.state = 'idle';
    this.time = 0;
    this.countdownTimer = 0;
    this.countdownStep = 3;
    this.lap = 1;
    this.cpIndex = 0;
    this.lastSplitTime = 0;

    this.driftScore = 0;
    this.driftCombo = 1.0;
    this.currentDriftPoints = 0;
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

    const ringGeo = new THREE.TorusGeometry(6.5, 0.45, 12, 32);
    ringGeo.rotateY(Math.PI / 2);
    this.markerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    this.markerMesh = new THREE.Mesh(ringGeo, this.markerMat);
    this.markerMesh.position.y = 5;

    const colGeo = new THREE.CylinderGeometry(0.25, 0.25, 30, 8);
    const colMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 });
    const colMesh = new THREE.Mesh(colGeo, colMat);
    colMesh.position.y = 15;
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
    this.jumpStartPos = null;
    this.updateMarkerPosition();
  }

  start() {
    if (this.currentEvent.id === 'circuit' || this.currentEvent.id === 'rally') {
      this.state = 'countdown';
      this.countdownTimer = 3.0;
      this.countdownStep = 3;
      this.time = 0;
      this.lap = 1;
      this.cpIndex = 0;
      this.driftScore = 0;
      this.updateMarkerPosition();
      this.onCountdown(3);
      this.onAudioTrigger('beep_low');
    } else {
      this.state = 'running';
      this.time = 0;
      this.lap = 1;
      this.cpIndex = 0;
      this.driftScore = 0;
      this.updateMarkerPosition();
      this.onNotification('\u0421\u0442\u0430\u0440\u0442: ' + this.currentEvent.name + '!', 'info');
    }
  }

  updateMarkerPosition() {
    const cps = this.currentEvent.checkpoints;
    if (cps && cps.length > 0 && (this.state === 'running' || this.state === 'countdown') && this.cpIndex < cps.length) {
      const target = cps[this.cpIndex];
      this.markerGroup.position.set(target.x, 0, target.z);
      this.markerGroup.visible = true;
    } else {
      this.markerGroup.visible = false;
    }
  }

  update(carPos, speedKmh, isDrifting, isAirborne, dt) {
    if (this.markerGroup.visible) {
      this.markerMesh.rotation.y += dt * 2.2;
    }

    if (this.state === 'countdown') {
      this.countdownTimer -= dt;
      const currentInt = Math.ceil(this.countdownTimer);
      if (currentInt !== this.countdownStep && currentInt > 0) {
        this.countdownStep = currentInt;
        this.onCountdown(this.countdownStep);
        this.onAudioTrigger('beep_low');
      } else if (this.countdownTimer <= 0) {
        this.state = 'running';
        this.onCountdown('GO!');
        this.onAudioTrigger('beep_high');
        setTimeout(() => this.onCountdown(null), 1200);
      }
      return;
    }

    // 1. Jump detection
    if (isAirborne) {
      if (!this.jumpStartPos) {
        this.jumpStartPos = carPos.clone();
      }
    } else if (this.jumpStartPos) {
      const dist = Math.round(this.jumpStartPos.distanceTo(carPos));
      this.jumpStartPos = null;
      if (dist > 8) {
        let stars = '\u2B50';
        let bonus = dist * 15;
        if (dist >= 35) { stars = '\u2B50\u2B50\u2B50'; bonus = dist * 25; }
        else if (dist >= 20) { stars = '\u2B50\u2B50'; bonus = dist * 20; }
        this.driftScore += bonus;
        addCredits(Math.round(bonus * 0.3));
        this.onNotification('\u041F\u0420\u042B\u0416\u041E\u041A: ' + dist + '\u043C! ' + stars + ' +' + bonus + ' PTS', 'stunt');
        this.onAudioTrigger('checkpoint');
      }
    }

    // 2. Drift scoring
    if (isDrifting && speedKmh > 35) {
      this.currentDriftPoints += (speedKmh * 1.6 * dt);
      this.driftCombo = Math.min(4.0, this.driftCombo + dt * 0.45);
    } else if (this.currentDriftPoints > 0) {
      const awarded = Math.round(this.currentDriftPoints * this.driftCombo);
      this.driftScore += awarded;
      addCredits(Math.round(awarded * 0.1));
      if (awarded > 300) {
        this.onNotification('\u0414\u0420\u0418\u0424\u0422 x' + this.driftCombo.toFixed(1) + ': +' + awarded + ' PTS', 'drift');
      }
      this.currentDriftPoints = 0;
      this.driftCombo = 1.0;
    }

    // 3. Speed traps
    for (let st of SPEED_TRAPS) {
      const dist = Math.hypot(carPos.x - st.x, carPos.z - st.z);
      if (dist < 12) {
        if (!st.cooldown) {
          st.cooldown = true;
          let stars = '\u2B50';
          let reward = 200;
          if (speedKmh >= st.targetKmh + 30) { stars = '\u2B50\u2B50\u2B50'; reward = 800; }
          else if (speedKmh >= st.targetKmh) { stars = '\u2B50\u2B50'; reward = 450; }
          addCredits(reward);
          this.onNotification('\u0420\u0410\u0414\u0410\u0420: ' + Math.round(speedKmh) + ' \u041A\u041C/\u0427! ' + stars + ' +' + reward + ' CR', 'stunt');
          this.onAudioTrigger('checkpoint');
          setTimeout(() => { st.cooldown = false; }, 8000);
        }
      }
    }

    if (this.state !== 'running') return;
    this.time += dt;

    if (this.currentEvent.id === 'drift') {
      if (this.currentEvent.timeLimit - this.time <= 0) {
        this.finish();
      }
      return;
    }

    if (this.currentEvent.id === 'free' || this.currentEvent.id === 'testdrive') return;

    const cps = this.currentEvent.checkpoints;
    if (cps && cps.length > 0) {
      const target = cps[this.cpIndex];
      const distToCp = Math.hypot(carPos.x - target.x, carPos.z - target.z);

      if (distToCp < 15) {
        this.cpIndex++;
        const cpReward = 150;
        addCredits(cpReward);
        this.onAudioTrigger('checkpoint');

        if (this.cpIndex >= cps.length) {
          if (this.currentEvent.laps > this.lap) {
            this.lap++;
            this.cpIndex = 0;
            this.onNotification('\u041A\u0420\u0423\u0413 ' + this.lap + '/' + this.currentEvent.laps + '! +' + cpReward + ' CR', 'info');
          } else {
            this.finish();
            return;
          }
        } else {
          this.onNotification('\u041A\u041F ' + this.cpIndex + '/' + cps.length + ' +' + cpReward + ' CR', 'info');
        }
        this.updateMarkerPosition();
      }
    }
  }

  finish() {
    this.state = 'finished';
    this.markerGroup.visible = false;
    this.onAudioTrigger('finish');

    let resultTitle = '';
    let resultScore = '';
    let isRecord = false;
    let stars = '\u2B50\u2B50\u2B50';
    let reward = 0;
    const evId = this.currentEvent.id;

    if (evId === 'drift') {
      const total = Math.round(this.driftScore);
      const prev = this.getBestRecord('drift') || 0;
      if (total > prev) {
        this.saveRecord('drift', total);
        isRecord = true;
      }
      reward = (this.currentEvent.rewardBase || 800) + Math.round(total * 0.08);
      resultTitle = '\u0414\u0420\u0418\u0424\u0422-\u0427\u0415\u041B\u041B\u0415\u041D\u0416 \u0417\u0410\u0412\u0415\u0420\u0428\u0401\u041D';
      resultScore = total + ' PTS (\u0420\u0435\u043A\u043E\u0440\u0434: ' + Math.max(total, prev) + ')';
      stars = total > 20000 ? '\u2B50\u2B50\u2B50' : (total > 8000 ? '\u2B50\u2B50' : '\u2B50');
    } else {
      const finalTime = this.time.toFixed(2);
      const prev = this.getBestRecord(evId);
      if (!prev || parseFloat(finalTime) < parseFloat(prev)) {
        this.saveRecord(evId, finalTime);
        isRecord = true;
      }
      reward = this.currentEvent.rewardBase || 1000;
      if (isRecord) reward = Math.round(reward * 1.5);
      resultTitle = '\u0413\u041E\u041D\u041A\u0410 \u0417\u0410\u0412\u0415\u0420\u0428\u0415\u041D\u0410';
      const bestTime = prev ? Math.min(parseFloat(finalTime), parseFloat(prev)) + '\u0441' : finalTime + '\u0441';
      resultScore = '\u0412\u0440\u0435\u043C\u044F: ' + finalTime + '\u0441 (\u0420\u0435\u043A\u043E\u0440\u0434: ' + bestTime + ')';
    }

    addCredits(reward);

    this.onFinishModal({
      title: resultTitle,
      scoreText: resultScore,
      isRecord,
      stars,
      eventName: this.currentEvent.name,
      reward
    });
  }
}
