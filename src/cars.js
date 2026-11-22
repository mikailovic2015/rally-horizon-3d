import * as THREE from 'three';

export const CARS_DATA = [
  {
    id: 'rally_wrc',
    name: 'Rally Beast 4x4',
    type: 'WRC Rally',
    price: 0, // Стартовая бесплатная машина!
    description: 'Стартовый болид фестиваля. Полноприводный ралли-хэтчбек с покатой крышей, широким обвесом и энергоёмкой подвеской.',
    color: '#ff4500',
    accentColor: '#ffffff',
    topSpeed: 215,
    acceleration: 92,
    handling: 88,
    driftFactor: 85,
    offroadGrip: 98,
    mass: 1180,
    specs: { speed: '215 км/ч', accel: '3.2 с', grip: 'S (Грунт)' },
    skins: [
      { id: 'stock', name: 'WRC Factory', color: '#ff4500', accent: '#ffffff', price: 0 },
      { id: 'monster', name: 'Monster Dirt', color: '#1a1a1a', accent: '#00ff44', price: 1000 },
      { id: 'redbull', name: 'Alpine Blue', color: '#0033aa', accent: '#ffff00', price: 1500 },
      { id: 'carbon', name: 'Full Carbon', color: '#111215', accent: '#ff0033', price: 2500 }
    ]
  },
  {
    id: 'drift_s15',
    name: 'Nightdrift S15',
    type: 'JDM Drift',
    price: 6000,
    description: 'Низкое японское купе с широкими фендерами, дактейл-спойлером и выворотом колес для экстремального угла заноса.',
    color: '#9900ff',
    accentColor: '#00ffcc',
    topSpeed: 235,
    acceleration: 86,
    handling: 84,
    driftFactor: 100,
    offroadGrip: 50,
    mass: 1120,
    specs: { speed: '235 км/ч', accel: '3.4 с', grip: 'Дрифт 100%' },
    skins: [
      { id: 'stock', name: 'Midnight Purple', color: '#9900ff', accent: '#00ffcc', price: 0 },
      { id: 'tokyo', name: 'Tokyo Neon Pink', color: '#ff007f', accent: '#00ffff', price: 1200 },
      { id: 'gold', name: 'Gold Rush', color: '#d4af37', accent: '#111111', price: 2000 },
      { id: 'carbon', name: 'Carbon Missile', color: '#141416', accent: '#00ffcc', price: 2500 }
    ]
  },
  {
    id: 'muscle_v8',
    name: 'Thunder V8 RT',
    type: 'Muscle Car',
    price: 14000,
    description: 'Мускулистый фастбек с длинным рельефным капотом, воздухозаборником, двойными полосами и мотором V8 Hemi.',
    color: '#18181c',
    accentColor: '#ffbb00',
    topSpeed: 260,
    acceleration: 94,
    handling: 74,
    driftFactor: 88,
    offroadGrip: 55,
    mass: 1550,
    specs: { speed: '260 км/ч', accel: '3.0 с', grip: 'V8 Сила' },
    skins: [
      { id: 'stock', name: 'Black & Gold', color: '#18181c', accent: '#ffbb00', price: 0 },
      { id: 'cherry', name: 'Cherry Red', color: '#880015', accent: '#ffffff', price: 1500 },
      { id: 'cop', name: 'Highway Interceptor', color: '#0a0d14', accent: '#00f0ff', price: 2200 },
      { id: 'chrome', name: 'Silver Chrome', color: '#d8dee9', accent: '#ff3333', price: 3000 }
    ]
  },
  {
    id: 'dakar_4x4',
    name: 'Dakar Raptor 4x4',
    type: 'Trophy Truck',
    price: 22000,
    description: 'Внедорожный прототип с гигантским дорожным просветом, стальным каркасом, запасным колесом и огромными шинами.',
    color: '#22ee44',
    accentColor: '#1a1a1a',
    topSpeed: 195,
    acceleration: 84,
    handling: 76,
    driftFactor: 75,
    offroadGrip: 100,
    mass: 1750,
    specs: { speed: '195 км/ч', accel: '3.6 с', grip: 'Вездеход' },
    skins: [
      { id: 'stock', name: 'Baja Lime', color: '#22ee44', accent: '#1a1a1a', price: 0 },
      { id: 'sand', name: 'Sahara Camo', color: '#c2a649', accent: '#3b2f15', price: 1500 },
      { id: 'arctic', name: 'Arctic Blizzard', color: '#e5e9f0', accent: '#0099ff', price: 2000 }
    ]
  },
  {
    id: 'apex_gt',
    name: 'Apex Horizon GT',
    type: 'Hypercar',
    price: 40000,
    description: 'Топовый гиперкар фестиваля со скошенным носом, активным антикрылом, расширенными арками и прижимной силой F1.',
    color: '#00d2ff',
    accentColor: '#111318',
    topSpeed: 295,
    acceleration: 99,
    handling: 96,
    driftFactor: 70,
    offroadGrip: 45,
    mass: 1200,
    specs: { speed: '295 км/ч', accel: '2.4 с', grip: 'A+' },
    skins: [
      { id: 'stock', name: 'Cyan Horizon', color: '#00d2ff', accent: '#111318', price: 0 },
      { id: 'lava', name: 'Lava Orange', color: '#ff3300', accent: '#151515', price: 2000 },
      { id: 'stealth', name: 'Stealth Carbon', color: '#111215', accent: '#00ffff', price: 3500 },
      { id: 'gold', name: 'Pure Gold VIP', color: '#ffcc00', accent: '#111111', price: 5000 }
    ]
  }
];

// --- PROCEDURAL TEXTURES ---
function createCarbonTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#111215';
  ctx.fillRect(0, 0, 64, 64);
  for (let y = 0; y < 64; y += 8) {
    for (let x = 0; x < 64; x += 8) {
      if ((x + y) % 16 === 0) {
        ctx.fillStyle = '#22252a';
        ctx.fillRect(x, y, 8, 8);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

function createTireTreadTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1c1c1f';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#0f0f11';
  ctx.fillRect(30, 0, 10, 128);
  ctx.fillRect(88, 0, 10, 128);
  for (let y = 0; y < 128; y += 16) {
    ctx.fillRect(0, y, 30, 6);
    ctx.fillRect(98, y + 8, 30, 6);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 8);
  return tex;
}

function createBrakeDiscTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8a919e';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#6e7582';
  for (let r = 20; r < 60; r += 4) {
    ctx.beginPath();
    ctx.arc(64, 64, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#222';
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    for (let r of [32, 44, 54]) {
      const x = 64 + Math.cos(a) * r;
      const y = 64 + Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return new THREE.CanvasTexture(c);
}

function createHeadlightTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a101a';
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(40, 32, 18, 0, Math.PI * 2);
  ctx.arc(88, 32, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(10, 6, 108, 6);
  return new THREE.CanvasTexture(c);
}

const carbonTex = createCarbonTexture();
const tireTex = createTireTreadTexture();
const brakeDiscTex = createBrakeDiscTexture();
const headlightTex = createHeadlightTexture();

// Reusable Materials with TRANSPARENT GLASS
const MATS = {
  glass: new THREE.MeshStandardMaterial({
    color: 0x88bbdd,
    roughness: 0.08,
    metalness: 0.85,
    transparent: true,
    opacity: 0.38
  }),
  interiorDark: new THREE.MeshStandardMaterial({
    color: 0x15161a,
    roughness: 0.8,
    metalness: 0.1
  }),
  seatLeather: new THREE.MeshStandardMaterial({
    color: 0x22242a,
    roughness: 0.6,
    metalness: 0.2
  }),
  steeringWheel: new THREE.MeshStandardMaterial({
    color: 0x333740,
    roughness: 0.5,
    metalness: 0.4
  }),
  carbon: new THREE.MeshStandardMaterial({
    map: carbonTex,
    roughness: 0.35,
    metalness: 0.4
  }),
  tire: new THREE.MeshStandardMaterial({
    map: tireTex,
    roughness: 0.85,
    metalness: 0.08
  }),
  rimSilver: new THREE.MeshStandardMaterial({
    color: 0xe8edf2,
    roughness: 0.18,
    metalness: 0.95
  }),
  rimGold: new THREE.MeshStandardMaterial({
    color: 0xffb700,
    roughness: 0.2,
    metalness: 0.92
  }),
  brakeDisc: new THREE.MeshStandardMaterial({
    map: brakeDiscTex,
    roughness: 0.25,
    metalness: 0.85
  }),
  caliperRed: new THREE.MeshStandardMaterial({
    color: 0xe60012,
    roughness: 0.2,
    metalness: 0.6
  }),
  chrome: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.06,
    metalness: 0.98
  }),
  headlight: new THREE.MeshBasicMaterial({
    map: headlightTex
  }),
  taillightOff: new THREE.MeshStandardMaterial({
    color: 0x440000,
    roughness: 0.3,
    metalness: 0.3
  }),
  taillightOn: new THREE.MeshBasicMaterial({
    color: 0xff002b
  }),
  shadow: new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.55
  })
};

/**
 * Creates 3D sport wheel
 */
function createCurvedWheel(radius = 0.36, width = 0.28, isGold = false, isOffroad = false) {
  const wheelGroup = new THREE.Group();

  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, MATS.tire);
  wheelGroup.add(tire);

  const rimR = isOffroad ? radius * 0.6 : radius * 0.74;
  const rimGeo = new THREE.CylinderGeometry(rimR, rimR * 0.88, width + 0.016, 20);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = isGold ? MATS.rimGold : MATS.rimSilver;
  const rim = new THREE.Mesh(rimGeo, rimMat);
  wheelGroup.add(rim);

  const spokeCount = isOffroad ? 6 : 5;
  const spokeLen = rimR * 0.74;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(width + 0.02, spokeLen, 0.06);
    const spoke = new THREE.Mesh(spokeGeo, rimMat);
    spoke.rotation.x = angle;
    spoke.position.set(0, (spokeLen * 0.5) * Math.cos(angle), (spokeLen * 0.5) * Math.sin(angle));
    wheelGroup.add(spoke);
  }

  const hubGeo = new THREE.CylinderGeometry(rimR * 0.26, rimR * 0.26, width + 0.035, 12);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, MATS.carbon);
  wheelGroup.add(hub);

  const discGeo = new THREE.CylinderGeometry(rimR * 0.84, rimR * 0.84, 0.035, 18);
  discGeo.rotateZ(Math.PI / 2);
  const disc = new THREE.Mesh(discGeo, MATS.brakeDisc);
  wheelGroup.add(disc);

  const caliperGeo = new THREE.BoxGeometry(0.08, rimR * 0.48, 0.12);
  const caliper = new THREE.Mesh(caliperGeo, MATS.caliperRed);
  caliper.position.set(0, rimR * 0.55, 0);
  wheelGroup.add(caliper);

  return wheelGroup;
}

/**
 * Creates realistic visible interior cockpit (Seats, dashboard, steering wheel)
 */
function createInteriorCockpit(length = 2.0, width = 1.25, groundClearance = 0.3) {
  const cockpit = new THREE.Group();

  // Floor tub
  const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, length), MATS.interiorDark);
  floor.position.set(0, groundClearance + 0.35, -0.2);
  cockpit.add(floor);

  // Dashboard
  const dash = new THREE.Mesh(new THREE.BoxGeometry(width - 0.05, 0.24, 0.45), MATS.interiorDark);
  dash.position.set(0, groundClearance + 0.62, 0.6);
  cockpit.add(dash);

  // Small steering wheel inside cockpit
  const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 16), MATS.steeringWheel);
  wheelRing.position.set(-width * 0.25, groundClearance + 0.72, 0.42);
  wheelRing.rotation.x = Math.PI / 6;
  cockpit.add(wheelRing);

  // Two sports bucket seats with headrests
  [-width * 0.25, width * 0.25].forEach(x => {
    // Cushion
    const seatBottom = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.45), MATS.seatLeather);
    seatBottom.position.set(x, groundClearance + 0.44, -0.2);
    // Backrest
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.48, 0.12), MATS.seatLeather);
    seatBack.position.set(x, groundClearance + 0.68, -0.42);
    seatBack.rotation.x = -0.15;
    // Headrest
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.1), MATS.seatLeather);
    headrest.position.set(x, groundClearance + 0.96, -0.46);
    cockpit.add(seatBottom, seatBack, headrest);
  });

  return cockpit;
}

function createWheelArch(radius, width, thickness, mat) {
  const g = new THREE.Group();
  const archGeo = new THREE.TorusGeometry(radius + 0.05, thickness, 8, 16, Math.PI);
  archGeo.rotateY(Math.PI / 2);
  const archL = new THREE.Mesh(archGeo, mat);
  archL.position.x = -width * 0.5;
  const archR = archL.clone();
  archR.position.x = width * 0.5;
  g.add(archL, archR);
  return g;
}

/**
 * Builds realistic 3D car with transparent glass and interior
 */
export function buildCar3D(carConfig) {
  const root = new THREE.Group();
  root.name = `car_${carConfig.id}`;

  const chassisTilt = new THREE.Group();
  root.add(chassisTilt);

  // Metallic paint material
  const bodyPaint = new THREE.MeshStandardMaterial({
    color: carConfig.color,
    metalness: 0.74,
    roughness: 0.16
  });

  const accentPaint = new THREE.MeshStandardMaterial({
    color: carConfig.accentColor,
    metalness: 0.65,
    roughness: 0.22
  });

  const tailMat = MATS.taillightOff.clone();
  const tailMeshes = [];
  const exhaustPoints = [];

  let wheelRadius = 0.36;
  let wheelWidth = 0.28;
  let trackWidth = 1.68;
  let wheelBase = 2.65;
  let groundClearance = 0.30;

  if (carConfig.id === 'dakar_4x4') {
    wheelRadius = 0.52;
    wheelWidth = 0.36;
    trackWidth = 1.95;
    wheelBase = 2.85;
    groundClearance = 0.58;
  } else if (carConfig.id === 'apex_gt') {
    wheelRadius = 0.34;
    wheelWidth = 0.30;
    trackWidth = 1.74;
    wheelBase = 2.70;
    groundClearance = 0.24;
  }

  // Shadow plane
  const shadowGeo = new THREE.PlaneGeometry(trackWidth + 0.6, wheelBase + 1.8);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMesh = new THREE.Mesh(shadowGeo, MATS.shadow);
  shadowMesh.position.y = 0.03;
  root.add(shadowMesh);

  // Add realistic visible cockpit interior under transparent glass
  const cockpit = createInteriorCockpit(2.0, trackWidth * 0.72, groundClearance);
  chassisTilt.add(cockpit);

  let mainBodyMesh = null;

  // --- CAR SPECIFIC BODY BUILDERS ---
  if (carConfig.id === 'apex_gt') {
    // 1. HYPERCAR
    const profileShape = new THREE.Shape();
    profileShape.moveTo(-2.25, 0.15);
    profileShape.lineTo(-2.25, 0.52);
    profileShape.lineTo(-1.60, 0.62);
    profileShape.lineTo(-0.70, 0.96);
    profileShape.lineTo(0.20, 0.96);
    profileShape.lineTo(1.10, 0.54);
    profileShape.lineTo(2.20, 0.35);
    profileShape.lineTo(2.35, 0.14);
    profileShape.lineTo(2.20, 0.10);
    profileShape.lineTo(-2.0, 0.10);
    profileShape.closePath();

    const bodyExtrude = new THREE.ExtrudeGeometry(profileShape, {
      depth: 1.62,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.14,
      bevelThickness: 0.12
    });
    bodyExtrude.center();
    bodyExtrude.rotateY(Math.PI / 2);

    mainBodyMesh = new THREE.Mesh(bodyExtrude, bodyPaint);
    mainBodyMesh.position.set(0, groundClearance + 0.5, 0);
    chassisTilt.add(mainBodyMesh);

    // Flared muscular wheel arches
    const fArch = createWheelArch(wheelRadius, trackWidth + 0.06, 0.08, bodyPaint);
    fArch.position.set(0, groundClearance + wheelRadius, wheelBase * 0.5);
    const rArch = createWheelArch(wheelRadius, trackWidth + 0.08, 0.09, bodyPaint);
    rArch.position.set(0, groundClearance + wheelRadius, -wheelBase * 0.5);
    chassisTilt.add(fArch, rArch);

    // Transparent Glass Canopy (windshield, roof, side glass)
    const canopyShape = new THREE.Shape();
    canopyShape.moveTo(-1.4, 0.60);
    canopyShape.lineTo(-0.65, 0.98);
    canopyShape.lineTo(0.18, 0.98);
    canopyShape.lineTo(1.05, 0.56);
    canopyShape.closePath();

    const canopyExtrude = new THREE.ExtrudeGeometry(canopyShape, {
      depth: 1.30,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.08,
      bevelThickness: 0.08
    });
    canopyExtrude.center();
    canopyExtrude.rotateY(Math.PI / 2);

    const canopy = new THREE.Mesh(canopyExtrude, MATS.glass);
    canopy.position.set(0, groundClearance + 0.53, -0.2);
    chassisTilt.add(canopy);

    // Carbon splitter & skirts
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.8), MATS.carbon);
    splitter.position.set(0, groundClearance + 0.08, 2.15);
    chassisTilt.add(splitter);

    const skirtL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 2.4), MATS.carbon);
    skirtL.position.set(-0.85, groundClearance + 0.1, 0);
    const skirtR = skirtL.clone();
    skirtR.position.x = 0.85;
    chassisTilt.add(skirtL, skirtR);

    // GT Wing
    const pL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.22), MATS.carbon);
    pL.position.set(-0.55, groundClearance + 0.65, -2.05);
    const pR = pL.clone();
    pR.position.x = 0.55;
    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.05, 0.48), bodyPaint);
    wingBlade.position.set(0, groundClearance + 0.85, -2.12);
    chassisTilt.add(pL, pR, wingBlade);

    // Headlights
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.16), MATS.headlight);
    hlL.position.set(-0.64, groundClearance + 0.36, 2.22);
    const hlR = hlL.clone();
    hlR.position.x = 0.64;
    chassisTilt.add(hlL, hlR);

    // Taillight bar
    const tlBar = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.08, 0.12), tailMat);
    tlBar.position.set(0, groundClearance + 0.44, -2.28);
    chassisTilt.add(tlBar);
    tailMeshes.push(tlBar);

    exhaustPoints.push(new THREE.Vector3(-0.16, groundClearance + 0.26, -2.35));
    exhaustPoints.push(new THREE.Vector3(0.16, groundClearance + 0.26, -2.35));

  } else if (carConfig.id === 'rally_wrc') {
    // 2. WRC RALLY
    const profileShape = new THREE.Shape();
    profileShape.moveTo(-1.95, 0.16);
    profileShape.lineTo(-1.95, 0.72);
    profileShape.lineTo(-1.50, 1.08);
    profileShape.lineTo(0.10, 1.08);
    profileShape.lineTo(0.95, 0.62);
    profileShape.lineTo(1.85, 0.50);
    profileShape.lineTo(2.05, 0.18);
    profileShape.lineTo(1.90, 0.12);
    profileShape.lineTo(-1.8, 0.12);
    profileShape.closePath();

    const bodyExtrude = new THREE.ExtrudeGeometry(profileShape, {
      depth: 1.64,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.12,
      bevelThickness: 0.10
    });
    bodyExtrude.center();
    bodyExtrude.rotateY(Math.PI / 2);

    mainBodyMesh = new THREE.Mesh(bodyExtrude, bodyPaint);
    mainBodyMesh.position.set(0, groundClearance + 0.55, 0);
    chassisTilt.add(mainBodyMesh);

    const fArch = createWheelArch(wheelRadius, trackWidth + 0.08, 0.10, bodyPaint);
    fArch.position.set(0, groundClearance + wheelRadius, wheelBase * 0.5);
    const rArch = createWheelArch(wheelRadius, trackWidth + 0.08, 0.10, bodyPaint);
    rArch.position.set(0, groundClearance + wheelRadius, -wheelBase * 0.5);
    chassisTilt.add(fArch, rArch);

    // Transparent Cabin Glass
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-1.75, 0.70);
    cabinShape.lineTo(-1.42, 1.06);
    cabinShape.lineTo(0.08, 1.06);
    cabinShape.lineTo(0.90, 0.64);
    cabinShape.closePath();

    const cabinExtrude = new THREE.ExtrudeGeometry(cabinShape, {
      depth: 1.34,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    cabinExtrude.center();
    cabinExtrude.rotateY(Math.PI / 2);

    const cabin = new THREE.Mesh(cabinExtrude, MATS.glass);
    cabin.position.set(0, groundClearance + 0.57, -0.2);
    chassisTilt.add(cabin);

    const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.16, 0.55), accentPaint);
    scoop.position.set(0, groundClearance + 1.15, -0.1);
    chassisTilt.add(scoop);

    for (let i = -0.45; i <= 0.46; i += 0.3) {
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 14), MATS.headlight);
      lamp.geometry.rotateX(Math.PI / 2);
      lamp.position.set(i, groundClearance + 0.68, 1.82);
      chassisTilt.add(lamp);
    }

    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.45), accentPaint);
    wing.position.set(0, groundClearance + 1.16, -1.65);
    chassisTilt.add(wing);

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.38, 0.08), tailMat);
    tlL.position.set(-0.7, groundClearance + 0.62, -1.98);
    const tlR = tlL.clone();
    tlR.position.x = 0.7;
    chassisTilt.add(tlL, tlR);
    tailMeshes.push(tlL, tlR);

    exhaustPoints.push(new THREE.Vector3(0.52, groundClearance + 0.22, -2.05));
    exhaustPoints.push(new THREE.Vector3(-0.52, groundClearance + 0.22, -2.05));

  } else if (carConfig.id === 'drift_s15') {
    // 3. JDM DRIFT
    const profileShape = new THREE.Shape();
    profileShape.moveTo(-2.15, 0.14);
    profileShape.lineTo(-2.15, 0.56);
    profileShape.lineTo(-1.50, 0.62);
    profileShape.lineTo(-0.60, 0.98);
    profileShape.lineTo(0.25, 0.98);
    profileShape.lineTo(1.15, 0.58);
    profileShape.lineTo(2.05, 0.44);
    profileShape.lineTo(2.20, 0.16);
    profileShape.lineTo(2.05, 0.10);
    profileShape.lineTo(-1.95, 0.10);
    profileShape.closePath();

    const bodyExtrude = new THREE.ExtrudeGeometry(profileShape, {
      depth: 1.62,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.12,
      bevelThickness: 0.10
    });
    bodyExtrude.center();
    bodyExtrude.rotateY(Math.PI / 2);

    mainBodyMesh = new THREE.Mesh(bodyExtrude, bodyPaint);
    mainBodyMesh.position.set(0, groundClearance + 0.5, 0);
    chassisTilt.add(mainBodyMesh);

    const fArch = createWheelArch(wheelRadius, trackWidth + 0.12, 0.12, accentPaint);
    fArch.position.set(0, groundClearance + wheelRadius, wheelBase * 0.5);
    const rArch = createWheelArch(wheelRadius, trackWidth + 0.14, 0.13, accentPaint);
    rArch.position.set(0, groundClearance + wheelRadius, -wheelBase * 0.5);
    chassisTilt.add(fArch, rArch);

    // Transparent Cabin Glass
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-1.42, 0.60);
    cabinShape.lineTo(-0.56, 0.96);
    cabinShape.lineTo(0.22, 0.96);
    cabinShape.lineTo(1.10, 0.60);
    cabinShape.closePath();

    const cabinExtrude = new THREE.ExtrudeGeometry(cabinShape, {
      depth: 1.30,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    cabinExtrude.center();
    cabinExtrude.rotateY(Math.PI / 2);
    const cabin = new THREE.Mesh(cabinExtrude, MATS.glass);
    cabin.position.set(0, groundClearance + 0.53, -0.15);
    chassisTilt.add(cabin);

    const ducktail = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.18, 0.4), MATS.carbon);
    ducktail.rotation.x = -0.42;
    ducktail.position.set(0, groundClearance + 0.68, -2.12);
    chassisTilt.add(ducktail);

    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.12), MATS.headlight);
    hlL.position.set(-0.62, groundClearance + 0.38, 2.15);
    const hlR = hlL.clone();
    hlR.position.x = 0.62;
    chassisTilt.add(hlL, hlR);

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.08), tailMat);
    tlL.position.set(-0.55, groundClearance + 0.45, -2.18);
    const tlR = tlL.clone();
    tlR.position.x = 0.55;
    chassisTilt.add(tlL, tlR);
    tailMeshes.push(tlL, tlR);

    exhaustPoints.push(new THREE.Vector3(0.64, groundClearance + 0.20, -2.32));
    exhaustPoints.push(new THREE.Vector3(-0.64, groundClearance + 0.20, -2.32));

  } else if (carConfig.id === 'muscle_v8') {
    // 4. AMERICAN MUSCLE
    const profileShape = new THREE.Shape();
    profileShape.moveTo(-2.25, 0.16);
    profileShape.lineTo(-2.25, 0.60);
    profileShape.lineTo(-1.60, 0.68);
    profileShape.lineTo(-0.60, 1.05);
    profileShape.lineTo(0.20, 1.05);
    profileShape.lineTo(1.05, 0.66);
    profileShape.lineTo(2.15, 0.54);
    profileShape.lineTo(2.30, 0.20);
    profileShape.lineTo(2.10, 0.12);
    profileShape.lineTo(-2.0, 0.12);
    profileShape.closePath();

    const bodyExtrude = new THREE.ExtrudeGeometry(profileShape, {
      depth: 1.72,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.12,
      bevelThickness: 0.10
    });
    bodyExtrude.center();
    bodyExtrude.rotateY(Math.PI / 2);

    mainBodyMesh = new THREE.Mesh(bodyExtrude, bodyPaint);
    mainBodyMesh.position.set(0, groundClearance + 0.54, 0);
    chassisTilt.add(mainBodyMesh);

    const strL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 4.5), accentPaint);
    strL.position.set(-0.25, groundClearance + 0.95, 0);
    const strR = strL.clone();
    strR.position.x = 0.25;
    chassisTilt.add(strL, strR);

    const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 1.5), MATS.carbon);
    scoop.position.set(0, groundClearance + 0.82, 0.9);
    chassisTilt.add(scoop);

    // Transparent Muscle Cabin Glass
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.46, 2.1), MATS.glass);
    cabin.position.set(0, groundClearance + 0.88, -0.3);
    chassisTilt.add(cabin);

    [-0.68, -0.44, 0.44, 0.68].forEach(x => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 14), MATS.headlight);
      hl.geometry.rotateX(Math.PI / 2);
      hl.position.set(x, groundClearance + 0.48, 2.32);
      chassisTilt.add(hl);
    });

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.06), tailMat);
    tlL.position.set(-0.58, groundClearance + 0.48, -2.28);
    const tlR = tlL.clone();
    tlR.position.x = 0.58;
    chassisTilt.add(tlL, tlR);
    tailMeshes.push(tlL, tlR);

    exhaustPoints.push(new THREE.Vector3(-0.5, groundClearance + 0.22, -2.35));
    exhaustPoints.push(new THREE.Vector3(0.5, groundClearance + 0.22, -2.35));

  } else {
    // 5. DAKAR TROPHY TRUCK
    const profileShape = new THREE.Shape();
    profileShape.moveTo(-2.20, 0.20);
    profileShape.lineTo(-2.20, 0.70);
    profileShape.lineTo(-0.60, 0.70);
    profileShape.lineTo(-0.40, 1.25);
    profileShape.lineTo(0.50, 1.25);
    profileShape.lineTo(1.20, 0.72);
    profileShape.lineTo(2.20, 0.60);
    profileShape.lineTo(2.35, 0.26);
    profileShape.lineTo(2.10, 0.16);
    profileShape.lineTo(-2.0, 0.16);
    profileShape.closePath();

    const bodyExtrude = new THREE.ExtrudeGeometry(profileShape, {
      depth: 1.82,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.14,
      bevelThickness: 0.12
    });
    bodyExtrude.center();
    bodyExtrude.rotateY(Math.PI / 2);

    mainBodyMesh = new THREE.Mesh(bodyExtrude, bodyPaint);
    mainBodyMesh.position.set(0, groundClearance + 0.65, 0);
    chassisTilt.add(mainBodyMesh);

    // Transparent Truck Cabin Glass
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.58, 1.8), MATS.glass);
    cabin.position.set(0, groundClearance + 1.15, 0.15);
    chassisTilt.add(cabin);

    const cageGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8);
    cageGeo.rotateZ(Math.PI / 2);
    const cageBar = new THREE.Mesh(cageGeo, MATS.carbon);
    cageBar.position.set(0, groundClearance + 1.5, 0.15);
    chassisTilt.add(cageBar);

    const spare = createCurvedWheel(0.52, 0.34, false, true);
    spare.rotation.x = Math.PI / 3;
    spare.position.set(0, groundClearance + 0.85, -1.35);
    chassisTilt.add(spare);

    const bullbar = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.45, 0.25), MATS.carbon);
    bullbar.position.set(0, groundClearance + 0.42, 2.38);
    chassisTilt.add(bullbar);

    const ledBar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.15), MATS.headlight);
    ledBar.position.set(0, groundClearance + 1.55, 0.35);
    chassisTilt.add(ledBar);

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.08), tailMat);
    tlL.position.set(-0.76, groundClearance + 0.60, -2.25);
    const tlR = tlL.clone();
    tlR.position.x = 0.76;
    chassisTilt.add(tlL, tlR);
    tailMeshes.push(tlL, tlR);

    exhaustPoints.push(new THREE.Vector3(-0.5, groundClearance + 0.26, -2.3));
    exhaustPoints.push(new THREE.Vector3(0.5, groundClearance + 0.26, -2.3));
  }

  // --- 4 WHEELS ---
  const wheels = [];
  const steerPivots = [];
  const spinMeshes = [];

  const halfTrack = trackWidth * 0.5;
  const halfBase = wheelBase * 0.5;

  const wheelPositions = [
    { name: 'fl', x: -halfTrack, z: halfBase, steer: true },
    { name: 'fr', x: halfTrack, z: halfBase, steer: true },
    { name: 'rl', x: -halfTrack, z: -halfBase, steer: false },
    { name: 'rr', x: halfTrack, z: -halfBase, steer: false }
  ];

  const isGold = (carConfig.id === 'muscle_v8' || carConfig.id === 'drift_s15');
  const isOffroad = (carConfig.id === 'dakar_4x4' || carConfig.id === 'rally_wrc');

  wheelPositions.forEach((wp) => {
    const pivot = new THREE.Group();
    pivot.position.set(wp.x, wheelRadius, wp.z);
    root.add(pivot);

    const spinGroup = new THREE.Group();
    pivot.add(spinGroup);

    const wMesh = createCurvedWheel(wheelRadius, wheelWidth, isGold, isOffroad);
    spinGroup.add(wMesh);

    wheels.push({
      pivot,
      spinGroup,
      isFront: wp.steer,
      radius: wheelRadius
    });

    if (wp.steer) {
      steerPivots.push(pivot);
    }
    spinMeshes.push(spinGroup);
  });

  return {
    root,
    chassisTilt,
    mainBodyMesh,
    wheels,
    steerPivots,
    spinMeshes,
    tailMeshes,
    exhaustPoints,
    config: carConfig,
    setBrakeLights(isBraking) {
      const activeMat = isBraking ? MATS.taillightOn : tailMat;
      for (let i = 0; i < tailMeshes.length; i++) {
        tailMeshes[i].material = activeMat;
      }
    },
    // Skin changing system
    applySkin(skin) {
      if (!mainBodyMesh) return;
      bodyPaint.color.set(skin.color);
      accentPaint.color.set(skin.accent);
      if (skin.id === 'stealth' || skin.id === 'carbon') {
        bodyPaint.map = carbonTex;
        bodyPaint.needsUpdate = true;
      } else {
        bodyPaint.map = null;
        bodyPaint.needsUpdate = true;
      }
    },
    // Crash dent deformation
    applyDent() {
      if (mainBodyMesh) {
        mainBodyMesh.scale.z = 0.94;
        mainBodyMesh.position.z = -0.08;
      }
    },
    repair() {
      if (mainBodyMesh) {
        mainBodyMesh.scale.z = 1.0;
        mainBodyMesh.position.z = 0;
      }
    }
  };
}
