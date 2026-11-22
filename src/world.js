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
  { x: 250, z: -40, rotY: -Math.PI / 2, length: 16, width: 8, height: 4.5 },
  { x: 30, z: 175, rotY: Math.PI / 2 + 0.2, length: 14, width: 7, height: 4.0 },
  { x: -100, z: -345, rotY: -Math.PI / 2, length: 16, width: 8, height: 5.0 },
  { x: -235, z: -30, rotY: 0, length: 14, width: 7, height: 4.0 }
];

export const SPEED_TRAPS = [
  { x: 190, z: 110, targetKmh: 200, name: 'Скоростной радар: Прямая горизонта' },
  { x: -180, z: -160, targetKmh: 170, name: 'Скоростной радар: Западный спуск' }
];

// --- PROCEDURAL HIGH-FIDELITY CANVAS TEXTURES ---

function createLushGrassTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  // Rich organic meadow gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#2e5b24');
  grad.addColorStop(0.5, '#3b6f2f');
  grad.addColorStop(1, '#284e20');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Grass blades & clover micro-speckles
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const g = Math.floor(70 + Math.random() * 70);
    ctx.fillStyle = `rgb(${Math.floor(g * 0.45)}, ${g}, ${Math.floor(g * 0.3)})`;
    ctx.fillRect(x, y, 2 + Math.random() * 2, 4 + Math.random() * 5);
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

  // Dense leafy clusters
  for (let i = 0; i < 2500; i++) {
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

  // Vertical pine bark furrows
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 256;
    const col = Math.floor(30 + Math.random() * 40);
    ctx.fillStyle = `rgb(${col + 15}, ${col}, ${col - 10})`;
    ctx.fillRect(x, y, 2, 8 + Math.random() * 14);
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

  // Road tarmac micro-grain
  for (let i = 0; i < 4000; i++) {
    const lum = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${lum}, ${lum}, ${lum})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // Red and white racing curbs (outer edges)
  const curbH = 34;
  for (let y = 0; y < 512; y += 64) {
    ctx.fillStyle = '#d92525';
    ctx.fillRect(0, y, curbH, 32);
    ctx.fillRect(512 - curbH, y, curbH, 32);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, y + 32, curbH, 32);
    ctx.fillRect(512 - curbH, y + 32, curbH, 32);
  }

  // White side safety lines
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(curbH + 4, 0, 8, 512);
  ctx.fillRect(512 - curbH - 12, 0, 8, 512);

  // Dashed Yellow Center Line
  ctx.fillStyle = '#ffbb00';
  for (let y = 0; y < 512; y += 64) {
    ctx.fillRect(252, y + 10, 8, 44);
  }

  // Rubber skid marks on apex
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

  for (let i = 0; i < 2000; i++) {
    const val = 70 + Math.random() * 50;
    ctx.fillStyle = `rgb(${val + 30}, ${val + 10}, ${val - 10})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  }

  // Heavy tire track ruts
  ctx.fillStyle = 'rgba(40, 25, 12, 0.35)';
  ctx.fillRect(40, 0, 48, 256);
  ctx.fillRect(168, 0, 48, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 24);
  return tex;
}

export class GameWorld {
  constructor(scene) {
    this.scene = scene;
    this.circuitCurve = new THREE.CatmullRomCurve3(CIRCUIT_WAYPOINTS, true, 'centripetal');
    this.rallyCurve = new THREE.CatmullRomCurve3(RALLY_WAYPOINTS, false, 'centripetal');

    this.circuitSamples = this.circuitCurve.getSpacedPoints(120);
    this.rallySamples = this.rallyCurve.getSpacedPoints(80);

    this.grassTex = createLushGrassTexture();
    this.foliageTex = createFoliageTexture();
    this.barkTex = createWoodBarkTexture();
    this.asphaltTex = createAsphaltTexture();
    this.gravelTex = createGravelTexture();

    this.buildTerrain();
    this.buildRoads();
    this.buildRamps();
    this.buildProps();
    this.buildSpeedTraps();
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
      let dir;
      if (curve.closed) {
        const next = pts[(i + 1) % pts.length];
        dir = new THREE.Vector3().subVectors(next, p).setY(0).normalize();
      } else {
        if (i < pts.length - 1) {
          dir = new THREE.Vector3().subVectors(pts[i + 1], p).setY(0).normalize();
        } else {
          dir = new THREE.Vector3().subVectors(p, pts[i - 1]).setY(0).normalize();
        }
      }
      const norm = new THREE.Vector3(-dir.z, 0, dir.x);

      vertices.push(
        p.x - norm.x * (width * 0.5), yOffset, p.z - norm.z * (width * 0.5),
        p.x + norm.x * (width * 0.5), yOffset, p.z + norm.z * (width * 0.5)
      );

      const v = i / (pts.length - 1);
      uvs.push(0, v, 1, v);

      if (i < pts.length - 1) {
        const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  buildRoads() {
    this.buildRibbon(this.circuitCurve, 180, 16, this.asphaltTex, 0.05);
    this.buildRibbon(this.rallyCurve, 100, 14, this.gravelTex, 0.06);

    // Festival Start/Finish Gantry
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
    this.scene.add(archGroup);
  }

  buildRamps() {
    this.rampObjects = [];
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.5, metalness: 0.3 });

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
      this.scene.add(g);
      this.rampObjects.push({ ...r, mesh });
    });
  }

  buildProps() {
    // 1. Multi-tier textured pine trees (100 instances)
    const treeCount = 100;
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.45, 2.5, 8);
    const foliageGeo = new THREE.ConeGeometry(2.4, 6.0, 8);
    foliageGeo.translate(0, 4.0, 0);

    const trunkMat = new THREE.MeshStandardMaterial({ map: this.barkTex, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ map: this.foliageTex, roughness: 0.75 });

    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const foliageInst = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);

    // 2. Detailed textured bushes (80 instances)
    const bushCount = 80;
    const bushGeo = new THREE.SphereGeometry(1.6, 8, 8);
    bushGeo.scale(1.2, 0.8, 1.2);
    const bushInst = new THREE.InstancedMesh(bushGeo, foliageMat, bushCount);

    const dummy = new THREE.Object3D();
    let seed = 42;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

    // Place trees
    let placedTrees = 0;
    while (placedTrees < treeCount) {
      const rx = (rnd() - 0.5) * 800;
      const rz = (rnd() - 0.5) * 800;
      if (this.getSurfaceType(rx, rz) === 'grass') {
        const s = 0.85 + rnd() * 0.5;
        dummy.position.set(rx, 1.2, rz);
        dummy.scale.set(s, s, s);
        dummy.rotation.y = rnd() * Math.PI * 2;
        dummy.updateMatrix();

        trunkInst.setMatrixAt(placedTrees, dummy.matrix);
        foliageInst.setMatrixAt(placedTrees, dummy.matrix);
        placedTrees++;
      }
    }

    // Place bushes
    let placedBushes = 0;
    while (placedBushes < bushCount) {
      const rx = (rnd() - 0.5) * 600;
      const rz = (rnd() - 0.5) * 600;
      if (this.getSurfaceType(rx, rz) === 'grass') {
        const s = 0.7 + rnd() * 0.6;
        dummy.position.set(rx, 0.8 * s, rz);
        dummy.scale.set(s, s, s);
        dummy.rotation.y = rnd() * Math.PI * 2;
        dummy.updateMatrix();

        bushInst.setMatrixAt(placedBushes, dummy.matrix);
        placedBushes++;
      }
    }

    trunkInst.instanceMatrix.needsUpdate = true;
    foliageInst.instanceMatrix.needsUpdate = true;
    bushInst.instanceMatrix.needsUpdate = true;

    this.scene.add(trunkInst, foliageInst, bushInst);
  }

  buildSpeedTraps() {
    this.speedTrapObjects = [];
    SPEED_TRAPS.forEach(st => {
      const g = new THREE.Group();
      g.position.set(st.x, 0, st.z);

      // Radar camera speed trap arch
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
      this.scene.add(g);
      this.speedTrapObjects.push({ ...st, group: g, triggered: false });
    });
  }

  getSurfaceType(x, z) {
    for (let i = 0; i < RAMPS.length; i++) {
      const r = RAMPS[i];
      const dx = x - r.x;
      const dz = z - r.z;
      const cos = Math.cos(-r.rotY), sin = Math.sin(-r.rotY);
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      if (Math.abs(lx) <= r.width * 0.5 && lz >= -r.length * 0.5 && lz <= r.length * 0.5) {
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

  getHeight(x, z) {
    for (let i = 0; i < RAMPS.length; i++) {
      const r = RAMPS[i];
      const dx = x - r.x;
      const dz = z - r.z;
      const cos = Math.cos(-r.rotY), sin = Math.sin(-r.rotY);
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      if (Math.abs(lx) <= r.width * 0.5 && lz >= -r.length * 0.5 && lz <= r.length * 0.5) {
        const factor = (lz + r.length * 0.5) / r.length;
        return factor * r.height;
      }
    }
    return 0;
  }
}
