import * as THREE from 'three';
import { CARS_DATA, buildCar3D } from './cars.js';
import { GameWorld } from './world.js';
import { EventManager, EVENTS_CONFIG, getCredits } from './events.js';

// --- PROCEDURAL WEB AUDIO API SYNTHESIZER ---
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.55;
      this.masterGain.connect(this.ctx.destination);

      // 1. Engine Sound (Dual Oscillators + Harmonic Filter)
      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc1.type = 'sawtooth';

      this.engineOsc2 = this.ctx.createOscillator();
      this.engineOsc2.type = 'triangle';

      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.value = 350;

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.value = 0.0;

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);

      this.engineOsc1.start();
      this.engineOsc2.start();

      // 2. Tire Squeal / Drift Noise Generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.value = 950;
      this.noiseFilter.Q.value = 2.0;

      this.driftGain = this.ctx.createGain();
      this.driftGain.gain.value = 0.0;

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.driftGain);
      this.driftGain.connect(this.masterGain);
      this.noiseNode.start();

      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext unavailable:', e);
    }
  }

  updateEngine(rpm, speedKmh, throttle) {
    if (!this.initialized || this.muted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const baseFreq = 50 + rpm * 190 + (throttle ? 25 : 0);
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.04);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 0.5, this.ctx.currentTime, 0.04);

    const cutoff = 280 + rpm * 1400 + (throttle ? 600 : 0);
    this.engineFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.04);

    const vol = 0.12 + (speedKmh > 5 ? 0.16 : 0.06) + (throttle ? 0.16 : 0);
    this.engineGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.04);
  }

  updateDrift(isDrifting, speedKmh) {
    if (!this.initialized || this.muted) return;
    if (isDrifting && speedKmh > 25) {
      const vol = Math.min(0.28, (speedKmh / 160) * 0.28);
      this.driftGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.04);
    } else {
      this.driftGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.08);
    }
  }

  playBeep(isHigh = false) {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = isHigh ? 880 : 440;
    g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + (isHigh ? 0.4 : 0.2));
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + (isHigh ? 0.4 : 0.2));
  }

  playCheckpoint() {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.35, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playFinish() {
    if (!this.initialized || this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const t = this.ctx.currentTime + idx * 0.1;
      osc.type = 'square';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.55;
    }
    return this.muted;
  }
}

// --- MAIN GAME APPLICATION ---
export class RallyGame {
  constructor() {
    this.audio = new AudioEngine();
    this.currentCarIndex = 0;
    this.cameraMode = 0;
    this.gameState = 'title';

    // Physical state
    this.carPos = new THREE.Vector3(0, 0, 180);
    this.carHeading = Math.PI / 2;
    this.carPitch = 0;
    this.carRoll = 0;
    this.carSpeed = 0;
    this.carVy = 0;
    this.steerAngle = 0;
    this.driftAngle = 0;
    this.isDrifting = false;
    this.isAirborne = false;
    this.nitro = 100;
    this.nitroActive = false;
    this.controlMode = 'wheel'; // 'wheel' или 'arrows'
    this.lastCrashTime = 0;
    this.crashCooldown = 1.2;
    this.settings = { sensitivity: 0.8, sound: true, quality: 'high' };
    try {
      const saved = JSON.parse(localStorage.getItem('horizon_settings') || '{}');
      Object.assign(this.settings, saved);
    } catch (e) {}
    this.gear = 1;
    this.rpm = 0.2;

    // Inputs
    this.input = {
      throttle: 0,
      brake: 0,
      steer: 0,
      handbrake: false,
      nitro: false
    };

    this.initThree();
    this.initWorld();
    this.initEvents();
    this.initParticles();
    this.initControls();
    this.loadCar(this.currentCarIndex);

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.container = document.getElementById('game-container');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6aa8e0);
    this.scene.fog = new THREE.FogExp2(0x90c4f4, 0.0016);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);
    this.camera.position.set(0, 5, 170);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.container.appendChild(this.renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x446633, 0.75);
    this.scene.add(hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    this.dirLight.position.set(120, 160, 90);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 400;
    const d = 40;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initWorld() {
    this.world = new GameWorld(this.scene);
  }

  initEvents() {
    this.eventManager = new EventManager(
      this.scene,
      (msg, type) => this.showNotification(msg, type),
      (sound) => {
        if (sound === 'checkpoint') this.audio.playCheckpoint();
        if (sound === 'finish') this.audio.playFinish();
        if (sound === 'beep_low') this.audio.playBeep(false);
        if (sound === 'beep_high') this.audio.playBeep(true);
      },
      (count) => {
        const cd = document.getElementById('countdown-overlay');
        if (!cd) return;
        if (count === null) {
          cd.style.display = 'none';
        } else {
          cd.textContent = count;
          cd.style.display = 'flex';
        }
      },
      (modalData) => {
        const modal = document.getElementById('results-modal');
        if (!modal) return;
        document.getElementById('res-title').textContent = modalData.title;
        document.getElementById('res-event').textContent = modalData.eventName;
        document.getElementById('res-score').textContent = modalData.scoreText;
        document.getElementById('res-stars').textContent = modalData.stars;
        document.getElementById('res-record-badge').style.display = modalData.isRecord ? 'inline-block' : 'none';
        modal.classList.remove('hidden');
      }
    );
  }

  initParticles() {
    const count = 50;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    this.particleData = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100;
      positions[i * 3 + 2] = 0;
      alphas[i] = 0;
      this.particleData.push({ life: 0, maxLife: 0.6, vx: 0, vy: 0, vz: 0 });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const pMat = new THREE.PointsMaterial({
      color: 0xeeeeee,
      size: 1.8,
      transparent: true,
      opacity: 0.45
    });

    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    const flameGeo = new THREE.SphereGeometry(0.18, 6, 6);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    this.flameLeft = new THREE.Mesh(flameGeo, flameMat);
    this.flameRight = new THREE.Mesh(flameGeo, flameMat);
    this.flameLeft.visible = false;
    this.flameRight.visible = false;
    this.scene.add(this.flameLeft, this.flameRight);
  }

  loadCar(index) {
    if (this.car3D) {
      this.scene.remove(this.car3D.root);
    }
    this.currentCarIndex = index;
    const config = CARS_DATA[index];
    this.car3D = buildCar3D(config);
    this.scene.add(this.car3D.root);
    this.updateCarTransform();
  }

  initControls() {
    const onKey = (e, isDown) => {
      this.audio.init();
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.input.throttle = isDown ? 1 : 0;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.input.brake = isDown ? 1 : 0;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.input.steer = isDown ? -1 : (this.input.steer === -1 ? 0 : this.input.steer);
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.input.steer = isDown ? 1 : (this.input.steer === 1 ? 0 : this.input.steer);
          break;
        case 'Space':
          this.input.handbrake = isDown;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.input.nitro = isDown;
          break;
        case 'KeyR':
          if (isDown) this.respawnCar();
          break;
        case 'KeyC':
          if (isDown) this.toggleCamera();
          break;
        case 'KeyG':
        case 'Escape':
          if (isDown) this.toggleGarage();
          break;
        case 'KeyM':
          if (isDown) this.audio.toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', (e) => onKey(e, true));
    window.addEventListener('keyup', (e) => onKey(e, false));
  }

  respawnCar() {
    const ev = this.eventManager.currentEvent;
    if (this.world && this.world.setMap) {
      this.world.setMap(ev.id === 'testdrive' ? 'testdrive' : 'festival');
    }
    const sp = ev.spawn;
    this.carPos.set(sp.x, this.world.getHeight(sp.x, sp.z), sp.z);
    this.carHeading = sp.rotY;
    if (this.car3D && this.car3D.repair) this.car3D.repair();
    this.carSpeed = 0;
    this.carVy = 0;
    this.carPitch = 0;
    this.carRoll = 0;
    this.driftAngle = 0;
    this.isDrifting = false;
    this.isAirborne = false;
    this.updateCarTransform();
    this.showNotification('Машина сброшена на трассу', 'info');
  }

  toggleCamera() {
    this.cameraMode = (this.cameraMode + 1) % 3;
    const names = ['Динамическая', 'Дальняя', 'С бампера'];
    this.showNotification(`Камера: ${names[this.cameraMode]}`, 'info');
  }

  setGameState(state) {
    this.gameState = state;
    const titleOverlay = document.getElementById('title-overlay');
    const garageOverlay = document.getElementById('garage-overlay');
    const hudOverlay = document.getElementById('hud-overlay');
    const touchLayer = document.getElementById('touch-layer');
    const resultsModal = document.getElementById('results-modal');

    if (titleOverlay) titleOverlay.classList.toggle('hidden', state !== 'title');
    if (garageOverlay) garageOverlay.classList.toggle('hidden', state !== 'garage');
    if (hudOverlay) hudOverlay.classList.toggle('hidden', state !== 'racing');
    if (touchLayer) touchLayer.classList.toggle('hidden', state !== 'racing');
    if (resultsModal) resultsModal.classList.add('hidden');

    if (state === 'racing') {
      this.respawnCar();
      this.eventManager.start();
    }
  }

  toggleGarage() {
    if (this.gameState === 'racing') {
      this.setGameState('garage');
    } else if (this.gameState === 'garage') {
      this.setGameState('racing');
    }
  }

  startRace() {
    this.audio.init();
    this.setGameState('racing');
  }

  updatePhysics(dt) {
    if (this.gameState !== 'racing') return;

    // Freeze throttle during 3..2..1 countdown
    const isCountingDown = this.eventManager.state === 'countdown';
    const activeThrottle = isCountingDown ? 0 : this.input.throttle;

    const carCfg = CARS_DATA[this.currentCarIndex];
    const surf = this.world.getSurfaceType(this.carPos.x, this.carPos.z);
    const groundH = this.world.getHeight(this.carPos.x, this.carPos.z);

    // Surface multipliers
    let surfaceGrip = 1.0;
    let surfaceMaxSpeed = 1.0;
    if (surf === 'dirt') {
      surfaceGrip = carCfg.offroadGrip > 80 ? 0.95 : 0.78;
      surfaceMaxSpeed = 0.92;
    } else if (surf === 'grass') {
      surfaceGrip = carCfg.offroadGrip > 80 ? 0.85 : 0.55;
      surfaceMaxSpeed = carCfg.offroadGrip > 80 ? 0.88 : 0.60;
    } else if (surf === 'ramp') {
      surfaceGrip = 1.0;
    }

    // Nitro handling
    const wantsNitro = this.input.nitro && this.nitro > 5 && !isCountingDown;
    if (wantsNitro) {
      this.nitroActive = true;
      this.nitro = Math.max(0, this.nitro - dt * 25);
    } else {
      this.nitroActive = false;
      if (Math.abs(this.carSpeed) > 18 || this.isDrifting) {
        this.nitro = Math.min(100, this.nitro + dt * 8);
      }
    }

    const topSpeedMs = (carCfg.topSpeed / 3.6) * surfaceMaxSpeed * (this.nitroActive ? 1.25 : 1.0);
    const accelPower = (carCfg.acceleration / 100) * 19 * (this.nitroActive ? 1.5 : 1.0);

    if (activeThrottle > 0) {
      if (this.carSpeed < 0) {
        this.carSpeed += 30 * dt;
      } else if (this.carSpeed < topSpeedMs) {
        this.carSpeed += accelPower * dt * activeThrottle;
      }
    } else if (this.input.brake > 0) {
      const brakePower = 26 + ((carCfg.braking || 85) / 100) * 16;
      if (this.carSpeed > 1) {
        this.carSpeed -= brakePower * dt * this.input.brake;
      } else {
        this.carSpeed = Math.max(-12, this.carSpeed - 8 * dt * this.input.brake);
      }
    } else {
      this.carSpeed *= Math.max(0, 1 - dt * 0.8);
    }

    if (this.input.handbrake) {
      this.carSpeed *= Math.max(0, 1 - dt * 1.5);
    }

    // Плавный руль: мёртвая зона + прогрессивная кривая + демпфирование от скорости
    const speedKmh = Math.abs(this.carSpeed * 3.6);
    const rawSteer = this.input.steer || 0;
    const deadSteer = Math.abs(rawSteer) < 0.06 ? 0 : rawSteer;
    const curvedSteer = Math.sign(deadSteer) * Math.pow(Math.abs(deadSteer), 1.5);
    const handlingFactor = 0.55 + ((carCfg.handling || 80) / 100) * 0.35;
    const speedDamp = Math.max(0.30, 1.0 - (speedKmh / 260));
    const reversing = this.carSpeed < -0.5 ? -1 : 1;
    const sens = (this.settings && this.settings.sensitivity) || 0.8;
    const targetSteer = curvedSteer * 0.30 * handlingFactor * speedDamp * sens * reversing;
    this.steerAngle += (targetSteer - this.steerAngle) * Math.min(1, dt * 5);

    // Drift physics
    const driftTendency = (carCfg.driftFactor / 100);
    if ((this.input.handbrake || Math.abs(this.steerAngle) > 0.3) && speedKmh > 30) {
      this.isDrifting = true;
      const targetDrift = this.steerAngle * (0.8 + driftTendency * 0.8);
      this.driftAngle += (targetDrift - this.driftAngle) * dt * 4;
    } else {
      this.isDrifting = false;
      this.driftAngle *= Math.max(0, 1 - dt * 5);
    }

    // Update heading
    const turnRate = (this.carSpeed / 2.5) * Math.tan(this.steerAngle);
    this.carHeading -= turnRate * dt * (this.isDrifting ? 1.3 : 1.0);

    // Velocity vector
    const moveAngle = this.carHeading - this.driftAngle;
    const forwardX = Math.sin(moveAngle);
    const forwardZ = Math.cos(moveAngle);

    this.carPos.x += forwardX * this.carSpeed * dt;
    this.carPos.z += forwardZ * this.carSpeed * dt;

    // Подвеска и трамплины: едем по склону, взлетаем только с губы и на скорости
    const targetY = groundH;
    const rampInfo = (this.world.getRampInfo ? this.world.getRampInfo(this.carPos.x, this.carPos.z) : null);
    const fwdSpeed = this.carSpeed;
    if (this.carPos.y > targetY + 0.08) {
      this.isAirborne = true;
      this.carVy -= 22 * dt;
      this.carPos.y += this.carVy * dt;
      if (this.carPos.y <= targetY) {
        this.carPos.y = targetY;
        this.isAirborne = false;
        this.carVy = 0;
      }
      this.carPitch += (0 - this.carPitch) * dt * 1.5;
    } else {
      if (this.isAirborne) {
        this.isAirborne = false;
        this.carVy = 0;
      }
      this.carPos.y = targetY;
      // Взлёт только на губе трамплина и при скорости больше 43 км/ч
      if (rampInfo && rampInfo.onRamp && rampInfo.atLip && fwdSpeed > 12) {
        this.carVy = Math.min(9, Math.max(3.5, fwdSpeed * 0.20));
        this.carPos.y += 0.15;
        this.isAirborne = true;
      } else if (rampInfo && rampInfo.onRamp) {
        // На склоне просто едем вверх, нос приподнят
        this.carPitch = -rampInfo.inclineAngle * 0.45;
      } else {
        this.carPitch = (activeThrottle - this.input.brake) * 0.04;
      }
    }

    this.carRoll = -this.steerAngle * (this.carSpeed / topSpeedMs) * 0.15;

    const speedRatio = Math.min(1, speedKmh / carCfg.topSpeed);
    this.gear = Math.max(1, Math.min(6, Math.floor(speedRatio * 5) + 1));
    this.rpm = 0.2 + ((speedRatio * 5) % 1) * 0.8;

    this.audio.updateEngine(this.rpm, speedKmh, activeThrottle > 0 || this.nitroActive);
    this.audio.updateDrift(this.isDrifting, speedKmh);

    // Кусты, деревья, границы карты
    if (this.world.checkBushCollision) {
      const bushHit = this.world.checkBushCollision(this.carPos, speedKmh);
      if (bushHit) this.audio.playCheckpoint();
    }
    if (this.world.checkTreeCollision) {
      for (let iter = 0; iter < 3; iter++) {
        const treeHit = this.world.checkTreeCollision(this.carPos, 1.6);
        if (!treeHit || !treeHit.collided) break;
        this.carPos.x = treeHit.treeX + treeHit.nx * (treeHit.overlap + 1.7);
        this.carPos.z = treeHit.treeZ + treeHit.nz * (treeHit.overlap + 1.7);
        const now2 = this.clock.getElapsedTime();
        if (Math.abs(this.carSpeed) > 6 && (now2 - this.lastCrashTime) > this.crashCooldown) {
          this.lastCrashTime = now2;
          this.carSpeed *= 0.35;
          if (this.car3D && this.car3D.applyDent) this.car3D.applyDent();
          this.audio.playBeep(false);
          this.showNotification('Вмятина кузова! Дерево!', 'drift');
        } else {
          this.carSpeed *= 0.9;
        }
      }
    }
    {
      const LIM = 740;
      if (Math.abs(this.carPos.x) > LIM || Math.abs(this.carPos.z) > LIM) {
        this.carPos.x = Math.max(-LIM, Math.min(LIM, this.carPos.x));
        this.carPos.z = Math.max(-LIM, Math.min(LIM, this.carPos.z));
        const now3 = this.clock.getElapsedTime();
        if (Math.abs(this.carSpeed) > 10 && (now3 - this.lastCrashTime) > this.crashCooldown) {
          this.lastCrashTime = now3;
          if (this.car3D && this.car3D.applyDent) this.car3D.applyDent();
          this.audio.playBeep(false);
          this.showNotification('Граница карты! Разворачивайся.', 'drift');
        }
        this.carSpeed *= 0.5;
      }
    }

    this.updateCarTransform();
    this.updateParticles(dt, surf);
    if (this.world.updateProps) this.world.updateProps(dt);
    this.eventManager.update(this.carPos, speedKmh, this.isDrifting, this.isAirborne, dt);
  }

  updateCarTransform() {
    if (!this.car3D) return;

    this.car3D.root.position.copy(this.carPos);
    this.car3D.root.rotation.y = this.carHeading;

    this.car3D.chassisTilt.rotation.x = this.carPitch;
    this.car3D.chassisTilt.rotation.z = this.carRoll;

    for (let p of this.car3D.steerPivots) {
      p.rotation.y = -this.steerAngle;
    }

    const wheelRotDelta = (this.carSpeed / 0.36) * 0.016;
    for (let w of this.car3D.spinMeshes) {
      w.rotation.x += wheelRotDelta;
    }

    this.car3D.setBrakeLights(this.input.brake > 0.1 || this.input.handbrake);
  }

  updateParticles(dt, surf) {
    const pPos = this.particles.geometry.attributes.position;
    const pAlpha = this.particles.geometry.attributes.alpha;
    const speedKmh = Math.abs(this.carSpeed * 3.6);

    const shouldEmit = (this.isDrifting || (surf === 'dirt' && speedKmh > 20) || this.nitroActive) && !this.isAirborne;

    for (let i = 0; i < this.particleData.length; i++) {
      const p = this.particleData[i];
      p.life += dt;
      if (p.life < p.maxLife) {
        pPos.setX(i, pPos.getX(i) + p.vx * dt);
        pPos.setY(i, pPos.getY(i) + p.vy * dt);
        pPos.setZ(i, pPos.getZ(i) + p.vz * dt);
        pAlpha.setX(i, 1 - (p.life / p.maxLife));
      } else if (shouldEmit && Math.random() < 0.3) {
        p.life = 0;
        const sideOffset = (Math.random() - 0.5) * 1.4;
        pPos.setXYZ(i, this.carPos.x + sideOffset, this.carPos.y + 0.15, this.carPos.z - 1.2);
        p.vx = (Math.random() - 0.5) * 2;
        p.vy = 1.2 + Math.random() * 1.5;
        p.vz = (Math.random() - 0.5) * 2;
        pAlpha.setX(i, 0.5);
      } else {
        pPos.setY(i, -100);
        pAlpha.setX(i, 0);
      }
    }
    pPos.needsUpdate = true;
    pAlpha.needsUpdate = true;

    if (this.nitroActive && this.car3D.exhaustPoints.length >= 2) {
      this.flameLeft.visible = true;
      this.flameRight.visible = true;

      const pL = this.car3D.exhaustPoints[0].clone().applyMatrix4(this.car3D.root.matrixWorld);
      const pR = this.car3D.exhaustPoints[1].clone().applyMatrix4(this.car3D.root.matrixWorld);
      this.flameLeft.position.copy(pL);
      this.flameRight.position.copy(pR);

      const s = 0.8 + Math.random() * 0.6;
      this.flameLeft.scale.set(s, s, s * 2.0);
      this.flameRight.scale.set(s, s, s * 2.0);
    } else {
      this.flameLeft.visible = false;
      this.flameRight.visible = false;
    }
  }

  updateCamera(dt) {
    if (this.gameState === 'title') {
      const time = this.clock.getElapsedTime();
      const radius = 6.2;
      this.camera.position.x = this.carPos.x + Math.sin(time * 0.35) * radius;
      this.camera.position.z = this.carPos.z + Math.cos(time * 0.35) * radius;
      this.camera.position.y = this.carPos.y + 1.6 + Math.sin(time * 0.2) * 0.4;
      this.camera.lookAt(this.carPos.x, this.carPos.y + 0.7, this.carPos.z);
      return;
    }

    if (this.gameState === 'garage') {
      const time = this.clock.getElapsedTime();
      const radius = 6.8;
      this.camera.position.x = this.carPos.x + Math.sin(time * 0.5) * radius;
      this.camera.position.z = this.carPos.z + Math.cos(time * 0.5) * radius;
      this.camera.position.y = this.carPos.y + 2.0;
      this.camera.lookAt(this.carPos.x, this.carPos.y + 0.8, this.carPos.z);
      return;
    }

    const speedKmh = Math.abs(this.carSpeed * 3.6);

    const targetFov = 60 + (speedKmh / 270) * 14 + (this.nitroActive ? 12 : 0);
    this.camera.fov += (targetFov - this.camera.fov) * dt * 4;
    this.camera.updateProjectionMatrix();

    if (this.cameraMode === 0) {
      const dist = 7.5 + (speedKmh / 270) * 3.5;
      const height = 2.4 + (speedKmh / 270) * 0.6;
      const targetCamPos = new THREE.Vector3(
        this.carPos.x - Math.sin(this.carHeading) * dist,
        this.carPos.y + height,
        this.carPos.z - Math.cos(this.carHeading) * dist
      );
      this.camera.position.lerp(targetCamPos, Math.min(1, dt * 7));
      const lookTarget = new THREE.Vector3(
        this.carPos.x + Math.sin(this.carHeading) * 4,
        this.carPos.y + 1.1,
        this.carPos.z + Math.cos(this.carHeading) * 4
      );
      this.camera.lookAt(lookTarget);

    } else if (this.cameraMode === 1) {
      const targetCamPos = new THREE.Vector3(
        this.carPos.x - Math.sin(this.carHeading) * 14,
        this.carPos.y + 5.5,
        this.carPos.z - Math.cos(this.carHeading) * 14
      );
      this.camera.position.lerp(targetCamPos, Math.min(1, dt * 6));
      this.camera.lookAt(this.carPos.x, this.carPos.y + 1.2, this.carPos.z);

    } else {
      this.camera.position.set(
        this.carPos.x + Math.sin(this.carHeading) * 1.5,
        this.carPos.y + 1.0,
        this.carPos.z + Math.cos(this.carHeading) * 1.5
      );
      const lookTarget = new THREE.Vector3(
        this.carPos.x + Math.sin(this.carHeading) * 20,
        this.carPos.y + 1.0,
        this.carPos.z + Math.cos(this.carHeading) * 20
      );
      this.camera.lookAt(lookTarget);
    }

    this.dirLight.position.set(this.carPos.x + 40, this.carPos.y + 70, this.carPos.z + 40);
    this.dirLight.target.position.copy(this.carPos);
    this.dirLight.target.updateMatrixWorld();
  }

  showNotification(text, type = 'info') {
    const toast = document.getElementById('hud-toast');
    if (!toast) return;
    toast.textContent = text;
    toast.className = `toast show ${type}`;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.className = 'toast';
    }, 2400);
  }

  updateHUD() {
    if (this.gameState !== 'racing') return;

    const speedKmh = Math.round(Math.abs(this.carSpeed * 3.6));
    const speedEl = document.getElementById('hud-speed');
    const gearEl = document.getElementById('hud-gear');
    const rpmBar = document.getElementById('hud-rpm-bar');
    const nitroBar = document.getElementById('hud-nitro-bar');
    const eventTime = document.getElementById('hud-timer');
    const eventProgress = document.getElementById('hud-progress');
    const driftScoreEl = document.getElementById('hud-drift-score');

    if (speedEl) speedEl.textContent = speedKmh;
    if (gearEl) gearEl.textContent = this.carSpeed < -0.5 ? 'R' : this.gear;
    if (rpmBar) rpmBar.style.width = `${Math.min(100, this.rpm * 100)}%`;
    if (nitroBar) nitroBar.style.width = `${this.nitro}%`;
    const creditsEl = document.getElementById('hud-credits');
    if (creditsEl) {
      try { creditsEl.textContent = getCredits().toLocaleString('ru-RU') + ' CR'; } catch (e) {}
    }
    const garageCredits = document.getElementById('garage-credits');
    if (garageCredits) {
      try { garageCredits.textContent = getCredits().toLocaleString('ru-RU') + ' CR'; } catch (e) {}
    }

    const em = this.eventManager;
    if (driftScoreEl) {
      if (em.driftScore > 0 || em.currentDriftPoints > 0) {
        const livePts = Math.round(em.driftScore + em.currentDriftPoints * em.driftCombo);
        driftScoreEl.textContent = `SCORE: ${livePts} PTS`;
        driftScoreEl.style.display = 'block';
      } else {
        driftScoreEl.style.display = 'none';
      }
    }

    if (eventTime) {
      if (em.currentEvent.id === 'drift') {
        const left = Math.max(0, em.currentEvent.timeLimit - em.time).toFixed(1);
        eventTime.textContent = `⏱️ ${left}с`;
      } else {
        eventTime.textContent = `⏱️ ${em.time.toFixed(1)}с`;
      }
    }

    if (eventProgress) {
      if (em.currentEvent.id === 'circuit') {
        eventProgress.textContent = `КРУГ ${em.lap}/${em.currentEvent.laps} • КП ${em.cpIndex}/${em.currentEvent.checkpoints.length}`;
      } else if (em.currentEvent.id === 'rally') {
        eventProgress.textContent = `КП ${em.cpIndex}/${em.currentEvent.checkpoints.length}`;
      } else {
        eventProgress.textContent = 'FREE ROAM';
      }
    }

    // Sync visual steering wheel rotation if steering via keyboard
    const visualWheel = document.getElementById('steering-wheel-visual');
    if (visualWheel) {
      const angleDeg = (this.steerAngle / 0.42) * 75;
      visualWheel.style.transform = `rotate(${angleDeg}deg)`;
    }

    this.drawMinimap();
  }

  drawMinimap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const worldScale = 0.18;
    const cx = w * 0.5;
    const cy = h * 0.5;

    ctx.save();
    ctx.fillStyle = 'rgba(10, 20, 30, 0.8)';
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.translate(cx, cy);
    ctx.rotate(-this.carHeading);

    // Circuit track
    ctx.strokeStyle = '#666a78';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.05) {
      const p = this.world.circuitCurve.getPoint(t);
      const mx = (p.x - this.carPos.x) * worldScale;
      const my = (p.z - this.carPos.z) * worldScale;
      if (t === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    }
    ctx.closePath();
    ctx.stroke();

    // Rally path
    ctx.strokeStyle = '#a66e38';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.05) {
      const p = this.world.rallyCurve.getPoint(t);
      const mx = (p.x - this.carPos.x) * worldScale;
      const my = (p.z - this.carPos.z) * worldScale;
      if (t === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    }
    ctx.stroke();

    // Active checkpoint blip
    if (this.eventManager.markerGroup.visible) {
      const cpPos = this.eventManager.markerGroup.position;
      const cpx = (cpPos.x - this.carPos.x) * worldScale;
      const cpy = (cpPos.z - this.carPos.z) * worldScale;
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(cpx, cpy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Player arrow
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    this.updatePhysics(dt);
    this.updateCamera(dt);
    this.updateHUD();

    this.renderer.render(this.scene, this.camera);
  }
}

export function initGame() {
  if (!window.game) {
    window.game = new RallyGame();
  }
  return window.game;
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
