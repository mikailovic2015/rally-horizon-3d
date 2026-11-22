import * as THREE from 'three';

// Track definition curves
export const CIRCUIT_WAYPOINTS = [
  new THREE.Vector3(0, 0, 180),
  new THREE.Vector3(140, 0, 150),
  new THREE.Vector3(260, 0, 50),
  new THREE.Vector3(240, 0, -140),
  new THREE.Vector3(120, 0, -220),
  new THREE.Vector3(-80, 0, -210),
  new THREE.Vector3(-220, 0, -110),
  new THREE.Vector3(-240, 0, 40),
  new THREE.Vector3(-150, 0, 160)
];

export const RALLY_WAYPOINTS = [
  new THREE.Vector3(120, 0, -220),
  new THREE.Vector3(80, 0, -320),
  new THREE.Vector3(-40, 0, -360),
  new THREE.Vector3(-180, 0, -320),
  new THREE.Vector3(-260, 0, -200),
  new THREE.Vector3(-220, 0, -110)
];

export const RAMPS = [
  { x: 250, z: -40, rotY: -Math.PI / 2, length: 16, width: 8, height: 4.2 },
  { x: 30, z: 175, rotY: Math.PI / 2 + 0.2, length: 14, width: 7, height: 3.8 },
  { x: -100, z: -345, rotY: -Math.PI / 2, length: 16, width: 8, height: 4.5 },
  { x: -235, z: -30, rotY: 0, length: 14, width: 7, height: 3.8 }
];

export const SPEED_TRAPS = [
  { x: 190, z: 110, targetKmh: 200, name: 'Скоростной радар: Прямая горизонта' },
  { x: -180, z: -160, targetKmh: 170, name: 'Скоростной радар: Западный спуск' }
];

export const TESTDRIVE_SPAWN = { x: 0, y: 0, z: 580, rotY: Math.PI };

// --- PROCEDURAL HIGH-FIDELITY CANVAS TEXTURES ---

function createLushGrassTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#2e5b24');
  grad.addColorStop(0.5, '#3b6f2f');
  grad.addColorStop(1, '#284e20');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const g = Math.floor(70 + Math.random() * 70);
    ctx.fillStyle = `rgb(${Math.floor(g * 0.45)}, ${g}, ${Math.floor(g * 0.3)})`;
    ctx.fillRect(x, y, 2 + Math.random() * 2, 4 + Math.random() * 4);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 40);
  return tex;
}

function createFoliageTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1e481b';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const shade = Math.floor(50 + Math.random() * 85);
    ctx.fillStyle = `rgb(${Math.floor(shade * 0.35)}, ${shade}, ${Math.floor(shade * 0.25)})`;
    ctx.beginPath();
    ctx.arc(x, y, 3 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function createWoodBarkTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#3a2417';
  ctx.fillRect(0, 0, 128, 256);

  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 256;
    const col = Math.floor(30 + Math.random() * 40);
    ctx.fillStyle = `rgb(${col + 15}, ${col}, ${col - 10})`;
    ctx.fillRect(x, y, 2, 8 + Math.random() * 12);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  return tex;
}

function createAsphaltTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 3000; i++) {
    const lum = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${lum}, ${lum}, ${lum})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const curbH = 34;
  for (let y = 0; y < 512; y += 64) {
    ctx.fillStyle = '#d92525';
    ctx.fillRect(0, y, curbH, 32);
    ctx.fillRect(512 - curbH, y, curbH, 32);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, y + 32, curbH, 32);
    ctx.fillRect(512 - curbH, y + 32, curbH, 32);
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(curbH + 4, 0, 8, 512);
  ctx.fillRect(512 - curbH - 12, 0, 8, 512);

  ctx.fillStyle = '#ffbb00';
  for (let y = 0; y < 512; y += 64) {
    ctx.fillRect(252, y + 10, 8, 44);
  }

  ctx.fillStyle = 'rgba(10, 12, 16, 0.35)';
  ctx.fillRect(160, 0, 25, 512);
  ctx.fillRect(325, 0, 25, 512);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 36);
  return tex;
}

function createGravelTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#7a5232';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1500; i++) {
    const val = 70 + Math.random() * 50;
    ctx.fillStyle = `rgb(${val + 30}, ${val + 10}, ${val - 10})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  }

  ctx.fillStyle = 'rgba(40, 25, 12, 0.35)';
  ctx.fillRect(40, 0, 48, 256);
  ctx.fillRect(168, 0, 48, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 24);
  return tex;
}

function createRunwayAsphaltTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#1e2126';
  ctx.fillRect(0, 0, 512, 512);

  // Micro grain
  for (let i = 0; i < 3000; i++) {
    const lum = Math.floor(22 + Math.random() * 20);
    ctx.fillStyle = `rgb(${lum}, ${lum}, ${lum})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // Runway border stripes (yellow & black hazard)
  const borderW = 24;
  for (let y = 0; y < 512; y += 48) {
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(0, y, borderW, 24);
    ctx.fillRect(512 - borderW, y, borderW, 24);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, y + 24, borderW, 24);
    ctx.fillRect(512 - borderW, y + 24, borderW, 24);
  }

  // Solid white flight line borders
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(borderW + 4, 0, 8, 512);
  ctx.fillRect(512 - borderW - 12, 0, 8, 512);

  // Center dashed white runway markers
  ctx.fillStyle = '#ffffff';
  for (let y = 0; y < 512; y += 96) {
    ctx.fillRect(250, y + 16, 12, 64);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 40);
  return tex;
}

export class GameWorld {
  constructor(scene) {
    this.scene = scene;
    this.mapMode = 'festival'; // 'festival' or 'testdrive'

    this.circuitCurve = new THREE.CatmullRomCurve3(CIRCUIT_WAYPOINTS, true, 'centripetal');
    this.rallyCurve = new THREE.CatmullRomCurve3(RALLY_WAYPOINTS, false, 'centripetal');

    this.circuitSamples = this.circuitCurve.getSpacedPoints(120);
    this.rallySamples = this.rallyCurve.getSpacedPoints(80);

    this.grassTex = createLushGrassTexture();
    this.foliageTex = createFoliageTexture();
    this.barkTex = createWoodBarkTexture();
    this.asphaltTex = createAsphaltTexture();
    this.gravelTex = createGravelTexture();
    this.runwayTex = createRunwayAsphaltTexture();

    // Groups for switching maps
    this.festivalGroup = new THREE.Group();
    this.testdriveGroup = new THREE.Group();
    this.scene.add(this.festivalGroup);
    this.scene.add(this.testdriveGroup);
    this.testdriveGroup.visible = false;

    // Obstacle tracking arrays
    this.treePositions = [];
    this.bushPositions = [];
    this.leafParticles = [];

    this.buildTerrain();
    this.buildRoads();
    this.buildRamps();
    this.buildProps();
    this.buildSpeedTraps();
    this.buildLeafParticlePool();
    this.buildTestDriveTrack();
  }

  setMap(mode) {
    this.mapMode = mode;
    this.festivalGroup.visible = (mode === 'festival');
    this.testdriveGroup.visible = (mode === 'testdrive');
  }

  buildTerrain() {
    const geo = new THREE.PlaneGeometry(1600, 1600, 48, 48);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.hypot(x, z);
      if (dist > 360) {
        const h = Math.sin(x * 0.015) * Math.cos(z * 0.015) * 18 + (dist - 360) * 0.15;
        pos.setY(i, Math.max(0, h));
      }
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: this.grassTex,
      roughness: 0.85,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(geo, mat);
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  buildRibbon(curve, pointsCount, width, texture, yOffset = 0.05) {
    const pts = curve.getSpacedPoints(pointsCount);
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const nextP = pts[(i + 1) % pts.length];
      const prevP = pts[(i - 1 + pts.length) % pts.length];

      const dir = new THREE.Vector3().subVectors(nextP, prevP).normalize();
      const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

      const halfW = width * 0.5;
      const left = new THREE.Vector3().copy(p).addScaledVector(normal, -halfW);
      const right = new THREE.Vector3().copy(p).addScaledVector(normal, halfW);

      left.y += yOffset;
      right.y += yOffset;

      vertices.push(left.x, left.y, left.z);
      vertices.push(right.x, right.y, right.z);

      const v = (i / pts.length) * 36;
      uvs.push(0, v);
      uvs.push(1, v);

      if (i < pts.length - 1 || curve.closed) {
        const i0 = i * 2;
        const i1 = i * 2 + 1;
        const i2 = ((i + 1) % pts.length) * 2;
        const i3 = ((i + 1) % pts.length) * 2 + 1;
        indices.push(i0, i1, i2);
        indices.push(i1, i3, i2);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.75,
      metalness: 0.15
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return mesh;
  }

  buildRoads() {
    const circuitMesh = this.buildRibbon(this.circuitCurve, 120, 16, this.asphaltTex, 0.06);
    this.festivalGroup.add(circuitMesh);

    const rallyMesh = this.buildRibbon(this.rallyCurve, 80, 12, this.gravelTex, 0.08);
    this.festivalGroup.add(rallyMesh);

    this.buildHorizonFestivalArch();
  }

  buildHorizonFestivalArch() {
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, 180);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, metalness: 0.8, roughness: 0.3 });
    const bannerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const orangeNeonMat = new THREE.MeshBasicMaterial({ color: 0xff3b00 });

    const pL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 1.2), metalMat);
    pL.position.set(-9.5, 3.75, 0);
    const pR = pL.clone();
    pR.position.x = 9.5;

    const topTruss = new THREE.Mesh(new THREE.BoxGeometry(20.5, 1.6, 1.2), metalMat);
    topTruss.position.set(0, 7.8, 0);

    const banner = new THREE.Mesh(new THREE.BoxGeometry(18.5, 1.2, 1.3), bannerMat);
    banner.position.set(0, 7.8, 0);

    [-8, -4, 0, 4, 8].forEach(x => {
      const spot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), orangeNeonMat);
      spot.position.set(x, 8.8, 0);
      archGroup.add(spot);
    });

    archGroup.add(pL, pR, topTruss, banner);
    this.festivalGroup.add(archGroup);
  }

  buildRamps() {
    this.rampObjects = [];
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.45, metalness: 0.35 });

    RAMPS.forEach((r) => {
      const g = new THREE.Group();
      g.position.set(r.x, 0, r.z);
      g.rotation.y = r.rotY;

      const geom = new THREE.BufferGeometry();
      const hw = r.width * 0.5;
      const l = r.length;
      const h = r.height;

      const v = new Float32Array([
        -hw, 0, -l * 0.5,
         hw, 0, -l * 0.5,
        -hw, h,  l * 0.5,
         hw, h,  l * 0.5,
        -hw, 0,  l * 0.5,
         hw, 0,  l * 0.5
      ]);
      const idx = [
        0, 1, 2,  1, 3, 2,
        2, 3, 4,  3, 5, 4,
        0, 2, 4,  1, 5, 3
      ];
      geom.setAttribute('position', new THREE.BufferAttribute(v, 3));
      geom.setIndex(idx);
      geom.computeVertexNormals();

      const mesh = new THREE.Mesh(geom, rampMat);
      mesh.receiveShadow = true;
      g.add(mesh);
      this.festivalGroup.add(g);
      this.rampObjects.push({ ...r, mesh });
    });
  }

  buildProps() {
    const treeCount = 95;
    const trunkGeo = new THREE.CylinderGeometry(0.42, 0.55, 2.8, 8);
    const foliageGeo = new THREE.ConeGeometry(2.5, 6.2, 8);
    foliageGeo.translate(0, 4.2, 0);

    const trunkMat = new THREE.MeshStandardMaterial({ map: this.barkTex, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ map: this.foliageTex, roughness: 0.75 });

    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const foliageInst = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);

    const bushCount = 75;
    const bushGeo = new THREE.SphereGeometry(1.5, 8, 8);
    bushGeo.scale(1.2, 0.75, 1.2);
    this.bushInst = new THREE.InstancedMesh(bushGeo, foliageMat, bushCount);

    const dummy = new THREE.Object3D();
    let seed = 42;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

    // Place trees with recorded positions
    this.treePositions = [];
    let placedTrees = 0;
    while (placedTrees < treeCount) {
      const rx = (rnd() - 0.5) * 800;
      const rz = (rnd() - 0.5) * 800;
      if (this.getFestivalSurface(rx, rz) === 'grass') {
        const s = 0.85 + rnd() * 0.5;
        dummy.position.set(rx, 1.4, rz);
        dummy.scale.set(s, s, s);
        dummy.rotation.y = rnd() * Math.PI * 2;
        dummy.updateMatrix();

        trunkInst.setMatrixAt(placedTrees, dummy.matrix);
        foliageInst.setMatrixAt(placedTrees, dummy.matrix);
        this.treePositions.push({ x: rx, z: rz, radius: 1.25 });
        placedTrees++;
      }
    }

    // Place bushes with collision records
    this.bushPositions = [];
    let placedBushes = 0;
    while (placedBushes < bushCount) {
      const rx = (rnd() - 0.5) * 600;
      const rz = (rnd() - 0.5) * 600;
      if (this.getFestivalSurface(rx, rz) === 'grass') {
        const s = 0.75 + rnd() * 0.55;
        dummy.position.set(rx, 0.8 * s, rz);
        dummy.scale.set(s, s, s);
        dummy.rotation.y = rnd() * Math.PI * 2;
        dummy.updateMatrix();

        this.bushInst.setMatrixAt(placedBushes, dummy.matrix);
        this.bushPositions.push({
          x: rx,
          z: rz,
          s,
          rotY: dummy.rotation.y,
          index: placedBushes,
          destroyed: false,
          respawnTimer: 0
        });
        placedBushes++;
      }
    }

    trunkInst.instanceMatrix.needsUpdate = true;
    foliageInst.instanceMatrix.needsUpdate = true;
    this.bushInst.instanceMatrix.needsUpdate = true;

    this.festivalGroup.add(trunkInst, foliageInst, this.bushInst);
  }

  buildSpeedTraps() {
    this.speedTrapObjects = [];
    SPEED_TRAPS.forEach(st => {
      const g = new THREE.Group();
      g.position.set(st.x, 0, st.z);

      const postMat = new THREE.MeshStandardMaterial({ color: 0x22262e, metalness: 0.8 });
      const camMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 0.6), postMat);
      p1.position.set(-8, 3, 0);
      const p2 = p1.clone();
      p2.position.x = 8;

      const beam = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.8, 0.6), postMat);
      beam.position.set(0, 6, 0);

      const camL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), camMat);
      camL.position.set(-3, 5.5, 0);
      const camR = camL.clone();
      camR.position.x = 3;

      g.add(p1, p2, beam, camL, camR);
      this.festivalGroup.add(g);
      this.speedTrapObjects.push({ ...st, group: g, cooldown: false });
    });
  }

  // --- DYNAMIC LEAF BURST EXPLOSION (WHEN BUSH SMASHED) ---
  buildLeafParticlePool() {
    const count = 48;
    const leafGeo = new THREE.PlaneGeometry(0.4, 0.4);
    const leafMat = new THREE.MeshBasicMaterial({
      color: 0x2e8b24,
      side: THREE.DoubleSide
    });

    this.leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, count);
    this.leafData = [];
    const dummy = new THREE.Object3D();
    dummy.position.set(0, -100, 0);
    dummy.updateMatrix();

    for (let i = 0; i < count; i++) {
      this.leafMesh.setMatrixAt(i, dummy.matrix);
      this.leafData.push({
        active: false,
        x: 0, y: -100, z: 0,
        vx: 0, vy: 0, vz: 0,
        rx: 0, ry: 0,
        rotSpd: 0,
        life: 0,
        maxLife: 1.8
      });
    }
    this.leafMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.leafMesh);
  }

  spawnLeafBurst(x, y, z) {
    const burstCount = 16;
    let spawned = 0;
    for (let i = 0; i < this.leafData.length; i++) {
      const p = this.leafData[i];
      if (!p.active) {
        p.active = true;
        p.x = x + (Math.random() - 0.5) * 1.2;
        p.y = y + 0.6 + Math.random() * 0.8;
        p.z = z + (Math.random() - 0.5) * 1.2;
        p.vx = (Math.random() - 0.5) * 10;
        p.vy = 4 + Math.random() * 6;
        p.vz = (Math.random() - 0.5) * 10;
        p.rx = Math.random() * Math.PI * 2;
        p.ry = Math.random() * Math.PI * 2;
        p.rotSpd = (Math.random() - 0.5) * 12;
        p.life = 0;
        p.maxLife = 1.4 + Math.random() * 0.6;
        spawned++;
        if (spawned >= burstCount) break;
      }
    }
  }

  // --- SEPARATE HIGH-TECH TEST-DRIVE TRACK ---
  buildTestDriveTrack() {
    const g = this.testdriveGroup;

    // 1. Long drag runway (1400m long, 38m wide)
    const runwayGeo = new THREE.PlaneGeometry(38, 1400);
    runwayGeo.rotateX(-Math.PI / 2);
    const runwayMat = new THREE.MeshStandardMaterial({
      map: this.runwayTex,
      roughness: 0.65,
      metalness: 0.2
    });
    const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
    runwayMesh.position.set(0, 0.08, -100);
    runwayMesh.receiveShadow = true;
    g.add(runwayMesh);

    // 2. Circular Drift Skidpad (radius 75m)
    const skidGeo = new THREE.RingGeometry(0.1, 75, 48);
    skidGeo.rotateX(-Math.PI / 2);
    const skidMat = new THREE.MeshStandardMaterial({
      color: 0x1f2328,
      roughness: 0.55,
      metalness: 0.3
    });
    const skidMesh = new THREE.Mesh(skidGeo, skidMat);
    skidMesh.position.set(120, 0.1, 100);
    skidMesh.receiveShadow = true;
    g.add(skidMesh);

    // Neon concentric drift rings on skidpad
    [25, 45, 65].forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.4, radius + 0.4, 48);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 1 ? 0xff0055 : 0x00f0ff,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(120, 0.12, 100);
      g.add(ringMesh);
    });

    // 3. Proving Ground Hangar Building at start
    const hangarMat = new THREE.MeshStandardMaterial({ color: 0x181c24, metalness: 0.85, roughness: 0.3 });
    const hangarGeo = new THREE.BoxGeometry(60, 16, 40);
    const hangar = new THREE.Mesh(hangarGeo, hangarMat);
    hangar.position.set(0, 8, 620);
    g.add(hangar);

    // Neon sign on hangar
    const signMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(45, 3.5, 0.5), signMat);
    sign.position.set(0, 12, 599.5);
    g.add(sign);

    // 4. Slalom Cones Course
    const coneGeo = new THREE.ConeGeometry(0.4, 0.9, 10);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.4 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 14; i++) {
      const cz = 300 - i * 50;
      const cx = (i % 2 === 0 ? -12 : 12);
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(cx, 0.45, cz);

      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.2, 10), stripeMat);
      stripe.position.y = 0.1;
      cone.add(stripe);
      g.add(cone);
    }

    // 5. High-speed Test Strip Radar Traps
    const radarTrap1 = new THREE.Mesh(new THREE.BoxGeometry(40, 7, 1.2), new THREE.MeshStandardMaterial({ color: 0x22262e }));
    radarTrap1.position.set(0, 3.5, 180);
    const radarBeam1 = new THREE.Mesh(new THREE.BoxGeometry(36, 0.8, 1.3), new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
    radarBeam1.position.set(0, 6.2, 180);
    g.add(radarTrap1, radarBeam1);

    const radarTrap2 = radarTrap1.clone();
    radarTrap2.position.set(0, 3.5, -420);
    const radarBeam2 = radarBeam1.clone();
    radarBeam2.position.set(0, 6.2, -420);
    g.add(radarTrap2, radarBeam2);
  }

  // --- COLLISION SYSTEMS ---

  checkTreeCollision(carPos, carRadius = 1.6) {
    if (this.mapMode !== 'festival') return null;
    for (let i = 0; i < this.treePositions.length; i++) {
      const t = this.treePositions[i];
      const dx = carPos.x - t.x;
      const dz = carPos.z - t.z;
      const minDist = t.radius + carRadius;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq) || 0.001;
        return {
          collided: true,
          treeX: t.x,
          treeZ: t.z,
          overlap: minDist - dist,
          nx: dx / dist,
          nz: dz / dist
        };
      }
    }
    return null;
  }

  checkBushCollision(carPos, carSpeedKmh) {
    if (this.mapMode !== 'festival') return null;
    if (Math.abs(carSpeedKmh) < 12) return null;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.bushPositions.length; i++) {
      const b = this.bushPositions[i];
      if (b.destroyed) continue;

      const dx = carPos.x - b.x;
      const dz = carPos.z - b.z;
      if (dx * dx + dz * dz < 4.2) {
        // Bush smashed!
        b.destroyed = true;
        b.respawnTimer = 20.0;

        // Scale instance to 0
        dummy.position.set(b.x, -100, b.z);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        this.bushInst.setMatrixAt(b.index, dummy.matrix);
        this.bushInst.instanceMatrix.needsUpdate = true;

        this.spawnLeafBurst(b.x, 0.4, b.z);
        return { hit: true, x: b.x, z: b.z };
      }
    }
    return null;
  }

  updateProps(dt) {
    // 1. Update bush respawns
    if (this.mapMode === 'festival' && this.bushPositions) {
      const dummy = new THREE.Object3D();
      let needsBushUpdate = false;
      for (let i = 0; i < this.bushPositions.length; i++) {
        const b = this.bushPositions[i];
        if (b.destroyed) {
          b.respawnTimer -= dt;
          if (b.respawnTimer <= 0) {
            b.destroyed = false;
            dummy.position.set(b.x, 0.8 * b.s, b.z);
            dummy.scale.set(b.s, b.s, b.s);
            dummy.rotation.y = b.rotY;
            dummy.updateMatrix();
            this.bushInst.setMatrixAt(b.index, dummy.matrix);
            needsBushUpdate = true;
          }
        }
      }
      if (needsBushUpdate) {
        this.bushInst.instanceMatrix.needsUpdate = true;
      }
    }

    // 2. Update leaf scatter particles
    if (this.leafData) {
      const dummy = new THREE.Object3D();
      let activeLeaves = false;
      for (let i = 0; i < this.leafData.length; i++) {
        const p = this.leafData[i];
        if (p.active) {
          p.life += dt;
          if (p.life >= p.maxLife) {
            p.active = false;
            dummy.position.set(0, -100, 0);
            dummy.updateMatrix();
            this.leafMesh.setMatrixAt(i, dummy.matrix);
          } else {
            activeLeaves = true;
            p.vy -= 16 * dt; // gravity
            p.x += p.vx * dt;
            p.y = Math.max(0.05, p.y + p.vy * dt);
            p.z += p.vz * dt;
            p.rx += p.rotSpd * dt;
            p.ry += p.rotSpd * dt;

            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.set(p.rx, p.ry, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            this.leafMesh.setMatrixAt(i, dummy.matrix);
          }
        }
      }
      if (activeLeaves || this.leafMesh) {
        this.leafMesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  // --- PRECISE RAMP DETECTION & LAUNCH LOGIC ---

  getRampInfo(x, z) {
    if (this.mapMode !== 'festival') return null;

    for (let i = 0; i < RAMPS.length; i++) {
      const r = RAMPS[i];
      const dx = x - r.x;
      const dz = z - r.z;
      const cos = Math.cos(-r.rotY), sin = Math.sin(-r.rotY);
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      const halfW = r.width * 0.5;
      const halfL = r.length * 0.5;

      if (Math.abs(lx) <= halfW && lz >= -halfL && lz <= halfL + 1.5) {
        const factor = Math.max(0, Math.min(1.0, (lz + halfL) / r.length));
        const inclineAngle = Math.atan2(r.height, r.length);
        const atLip = (factor >= 0.88);
        return {
          onRamp: true,
          height: factor * r.height,
          inclineAngle,
          atLip,
          factor,
          lipHeight: r.height,
          ramp: r
        };
      }
    }
    return null;
  }

  getFestivalSurface(x, z) {
    for (let i = 0; i < RAMPS.length; i++) {
      const r = RAMPS[i];
      const dx = x - r.x;
      const dz = z - r.z;
      const cos = Math.cos(-r.rotY), sin = Math.sin(-r.rotY);
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      if (Math.abs(lx) <= r.width * 0.5 && lz >= -r.length * 0.5 && lz <= r.length * 0.5 + 1.0) {
        return 'ramp';
      }
    }

    for (let i = 0; i < this.circuitSamples.length; i++) {
      const p = this.circuitSamples[i];
      const dx = x - p.x;
      const dz = z - p.z;
      if (dx * dx + dz * dz < 100) return 'asphalt';
    }

    for (let i = 0; i < this.rallySamples.length; i++) {
      const p = this.rallySamples[i];
      const dx = x - p.x;
      const dz = z - p.z;
      if (dx * dx + dz * dz < 81) return 'dirt';
    }

    return 'grass';
  }

  getSurfaceType(x, z) {
    if (this.mapMode === 'testdrive') {
      if (Math.abs(x) < 22 && z >= -800 && z <= 620) return 'asphalt';
      const skidDx = x - 120;
      const skidDz = z - 100;
      if (skidDx * skidDx + skidDz * skidDz < 75 * 75) return 'asphalt';
      return 'grass';
    }
    return this.getFestivalSurface(x, z);
  }

  getHeight(x, z) {
    const ramp = this.getRampInfo(x, z);
    if (ramp) return ramp.height;
    return 0;
  }
}
