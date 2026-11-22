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
    braking: 88,
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
    braking: 82,
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
    braking: 78,
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
    braking: 90,
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
    braking: 97,
    specs: { speed: '295 км/ч', accel: '2.4 с', grip: 'A+' },
    skins: [
      { id: 'stock', name: 'Cyan Horizon', color: '#00d2ff', accent: '#111318', price: 0 },
      { id: 'lava', name: 'Lava Orange', color: '#ff3300', accent: '#151515', price: 2000 },
      { id: 'stealth', name: 'Stealth Carbon', color: '#111215', accent: '#00ffff', price: 3500 },
      { id: 'gold', name: 'Pure Gold VIP', color: '#ffcc00', accent: '#111111', price: 5000 }
    ]
  },
  {
    id: 'street_gtr',
    body: 'apex_gt',
    name: 'Street GTR-X',
    type: 'Street Sport',
    price: 9000,
    description: 'Городской спорткар с плавными линиями, карбоновым капотом и launch-контролем.',
    color: '#c0c8d4',
    accentColor: '#ff2244',
    topSpeed: 248,
    acceleration: 90,
    handling: 90,
    driftFactor: 78,
    offroadGrip: 55,
    braking: 92,
    mass: 1380,
    specs: { speed: '248 км/ч', accel: '3.0 с', grip: 'A (Асфальт)' },
    skins: [
      { id: 'stock', name: 'Silver Storm', color: '#c0c8d4', accent: '#ff2244', price: 0 },
      { id: 'midnight', name: 'Midnight Blue', color: '#0a1a5a', accent: '#00eaff', price: 1300 },
      { id: 'carbon', name: 'Carbon Stealth', color: '#141416', accent: '#ff2244', price: 2600 }
    ]
  },
  {
    id: 'euro_rs',
    body: 'rally_wrc',
    name: 'Euro RS Turbo',
    type: 'Rally Raid',
    price: 18000,
    description: 'Европейский турбо-хэтч с полным приводом: цепкий, юркий, любит грунтовку.',
    color: '#0066ff',
    accentColor: '#ffffff',
    topSpeed: 228,
    acceleration: 93,
    handling: 91,
    driftFactor: 80,
    offroadGrip: 95,
    braking: 89,
    mass: 1250,
    specs: { speed: '228 км/ч', accel: '2.9 с', grip: 'S (Микс)' },
    skins: [
      { id: 'stock', name: 'Works Blue', color: '#0066ff', accent: '#ffffff', price: 0 },
      { id: 'gravel', name: 'Gravel Gold', color: '#d4a017', accent: '#111111', price: 1400 },
      { id: 'carbon', name: 'Night Carbon', color: '#15161a', accent: '#0066ff', price: 2400 }
    ]
  },
  {
    id: 'retro_911',
    body: 'drift_s15',
    name: 'Retro Turbo 911',
    type: 'Classic Sport',
    price: 26000,
    description: 'Легендарное ретро-купе с оппозитным турбо: плавное, задорное, дрифтит охотно.',
    color: '#ffcc33',
    accentColor: '#151515',
    topSpeed: 268,
    acceleration: 95,
    handling: 87,
    driftFactor: 92,
    offroadGrip: 52,
    braking: 90,
    mass: 1290,
    specs: { speed: '268 км/ч', accel: '2.8 с', grip: 'Классика' },
    skins: [
      { id: 'stock', name: 'Sun Yellow', color: '#ffcc33', accent: '#151515', price: 0 },
      { id: 'martini', name: 'Martini Race', color: '#ffffff', accent: '#ff0033', price: 1800 },
      { id: 'carbon', name: 'Black Edition', color: '#101114', accent: '#ffcc33', price: 2800 }
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
  glass: new THREE.MeshPhysicalMaterial({
    color: 0x9fd4ff,
    roughness: 0.04,
    metalness: 0.1,
    transparent: true, side: THREE.DoubleSide,
    opacity: 0.28,
    transmission: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    depthWrite: false,
    side: THREE.DoubleSide
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
    roughness: 0.9,
    metalness: 0.02
  }),
  tireOffroad: new THREE.MeshStandardMaterial({
    map: tireTex,
    roughness: 0.95,
    metalness: 0.01,
    color: 0x1a1a1a
  }),
  rimSilver: new THREE.MeshPhysicalMaterial({
    color: 0xc0c8d4,
    roughness: 0.18,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  }),
  rimGold: new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    roughness: 0.15,
    metalness: 0.98,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04
  }),
  rimBlack: new THREE.MeshPhysicalMaterial({
    color: 0x141518,
    roughness: 0.12,
    metalness: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06
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
  headlightLens: new THREE.MeshPhysicalMaterial({
    color: 0xffffee,
    roughness: 0.0,
    metalness: 0.0,
    transmission: 0.95,
    thickness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0
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
    transparent: true, side: THREE.DoubleSide,
    opacity: 0.55
  })
};

/**
 * Creates 3D sport wheel
 */
/**
 * Creates 3D sport wheel — стильный диск под машину
 */
function createCurvedWheel(radius = 0.36, width = 0.28, wheelStyle = 'sport', isOffroad = false) {
  const wheelGroup = new THREE.Group();

  // Шина
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 28);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = isOffroad ? MATS.tireOffroad : MATS.tire;
  const tire = new THREE.Mesh(tireGeo, tireMat);
  wheelGroup.add(tire);

  // Диск
  const rimR = isOffroad ? radius * 0.58 : radius * 0.72;
  const rimGeo = new THREE.CylinderGeometry(rimR, rimR * 0.9, width + 0.012, 24);
  rimGeo.rotateZ(Math.PI / 2);
  let rimMat = MATS.rimSilver;
  if (wheelStyle === 'gold') rimMat = MATS.rimGold;
  else if (wheelStyle === 'black') rimMat = MATS.rimBlack;
  const rim = new THREE.Mesh(rimGeo, rimMat);
  wheelGroup.add(rim);

  // Спицы по стилю
  let spokeCount, spokeShape;
  if (wheelStyle === 'gold') { spokeCount = 5; spokeShape = 'Y'; }
  else if (wheelStyle === 'black') { spokeCount = 10; spokeShape = 'split5'; }
  else if (isOffroad) { spokeCount = 6; spokeShape = 'solid'; }
  else { spokeCount = 8; spokeShape = 'split5'; }

  const spokeLen = rimR * 0.7;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    let spoke;
    if (spokeShape === 'Y') {
      const sg = new THREE.CylinderGeometry(0.035, 0.055, spokeLen * 0.6, 6);
      sg.rotateX(Math.PI / 2);
      spoke = new THREE.Mesh(sg, rimMat);
      spoke.rotation.z = angle;
    } else if (spokeShape === 'split5') {
      const sg = new THREE.BoxGeometry(width + 0.015, spokeLen * 0.55, 0.045);
      spoke = new THREE.Mesh(sg, rimMat);
      spoke.rotation.x = angle;
    } else { // solid
      const sg = new THREE.BoxGeometry(width + 0.02, spokeLen * 0.65, 0.05);
      spoke = new THREE.Mesh(sg, rimMat);
      spoke.rotation.x = angle;
    }
    spoke.position.set(0, (spokeLen * 0.5) * Math.cos(angle), (spokeLen * 0.5) * Math.sin(angle));
    wheelGroup.add(spoke);
  }

  // Хаб
  const hubGeo = new THREE.CylinderGeometry(rimR * 0.24, rimR * 0.24, width + 0.03, 16);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, MATS.carbon);
  wheelGroup.add(hub);

  // Диск тормоза
  const discGeo = new THREE.CylinderGeometry(rimR * 0.82, rimR * 0.82, 0.03, 20);
  discGeo.rotateZ(Math.PI / 2);
  const disc = new THREE.Mesh(discGeo, MATS.brakeDisc);
  wheelGroup.add(disc)

  // Калипер
  const caliperGeo = new THREE.BoxGeometry(0.07, rimR * 0.45, 0.11);
  const caliper = new THREE.Mesh(caliperGeo, MATS.caliperRed);
  caliper.position.set(0, rimR * 0.52, 0);
  wheelGroup.add(caliper);

  // Болты на ободе
  for (let i = 0; i < 5; i++) {
    const ba = (i / 5) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.025, 8), MATS.chrome);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(Math.cos(ba) * (rimR - 0.03), Math.sin(ba) * (rimR - 0.03), width * 0.5 + 0.005);
    wheelGroup.add(bolt);
  }

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

  const bodyKind = carConfig.body || carConfig.id;

  // Лаковая краска кузова (MeshPhysicalMaterial + clearcoat)
  const bodyPaint = new THREE.MeshPhysicalMaterial({
    color: carConfig.color,
    metalness: 0.45,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.1
  });

  const accentPaint = new THREE.MeshPhysicalMaterial({
    color: carConfig.accentColor,
    metalness: 0.5,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08
  });

  // Глянцевое затемнённое остекление — темнее и глянцевее кузова
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0d1a26,
    metalness: 0.35,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transparent: true, side: THREE.DoubleSide,
    opacity: 0.72,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x14161b,
    metalness: 0.7,
    roughness: 0.42
  });

  const tailMat = MATS.taillightOff.clone();
  const tailMeshes = [];
  const exhaustPoints = [];

  // --- ГАБАРИТЫ ПО ТИПУ КУЗОВА ---
  let wheelRadius = 0.36;
  let wheelWidth = 0.28;
  let trackWidth = 1.68;
  let wheelBase = 2.65;
  let groundClearance = 0.30;

  if (bodyKind === 'dakar_4x4') {
    wheelRadius = 0.52;
    wheelWidth = 0.36;
    trackWidth = 1.95;
    wheelBase = 2.85;
    groundClearance = 0.58;
  } else if (bodyKind === 'apex_gt') {
    wheelRadius = 0.34;
    wheelWidth = 0.30;
    trackWidth = 1.74;
    wheelBase = 2.70;
    groundClearance = 0.24;
  }

  // --- ПРОФИЛЬ КУЗОВА СБОКУ (X = вперёд, Y = вверх) ---
  // Каждый профиль: капот → лобовое → крыша → корма → спойлер
  const PROFILES = {
    // Раллийный хэтчбек: короткий капот, высокая кабина, скошенная корма
    rally_wrc: {
      width: 1.72,
      side: [
        [-2.10, 0.16], [-2.14, 0.50], [-2.00, 0.72], [-1.60, 0.80],
        [-1.05, 0.82], [-0.62, 1.28], [-0.30, 1.40], [0.42, 1.42],
        [0.74, 1.36], [1.02, 1.06], [1.22, 0.88], [1.78, 0.84],
        [2.04, 0.74], [2.16, 0.52], [2.18, 0.20], [1.60, 0.14],
        [-1.55, 0.14]
      ],
      bevel: 0.10
    },
    // Гиперкар: низкий клин, кабина сдвинута назад, длинный нос
    apex_gt: {
      width: 1.80,
      side: [
        [-2.20, 0.12], [-2.24, 0.38], [-2.02, 0.52], [-1.42, 0.62],
        [-0.86, 0.66], [-0.52, 1.06], [-0.10, 1.14], [0.34, 1.10],
        [0.66, 0.92], [0.92, 0.66], [1.42, 0.58], [1.94, 0.52],
        [2.22, 0.40], [2.30, 0.18], [1.70, 0.10], [-1.70, 0.10]
      ],
      bevel: 0.11
    },
    // JDM купе: длинный капот, низкая крыша, дактейл
    drift_s15: {
      width: 1.78,
      side: [
        [-2.16, 0.13], [-2.20, 0.42], [-2.02, 0.56], [-1.48, 0.64],
        [-1.02, 0.68], [-0.70, 1.02], [-0.28, 1.10], [0.18, 1.06],
        [0.48, 0.86], [0.72, 0.62], [1.30, 0.56], [1.86, 0.50],
        [2.10, 0.38], [2.16, 0.16], [1.60, 0.10], [-1.62, 0.10]
      ],
      bevel: 0.10
    },
    // Muscle: длинный плоский капот, высокая корма, фастбек
    muscle_v8: {
      width: 1.86,
      side: [
        [-2.24, 0.14], [-2.28, 0.46], [-2.06, 0.62], [-1.50, 0.70],
        [-1.04, 0.74], [-0.74, 1.18], [-0.34, 1.26], [0.24, 1.22],
        [0.56, 1.00], [0.80, 0.72], [1.34, 0.66], [1.90, 0.60],
        [2.18, 0.44], [2.24, 0.18], [1.66, 0.11], [-1.70, 0.11]
      ],
      bevel: 0.12
    },
    // Trophy truck: высокая посадка, короткая кабина, длинные свесы
    dakar_4x4: {
      width: 2.00,
      side: [
        [-2.28, 0.30], [-2.32, 0.86], [-2.10, 1.02], [-1.52, 1.08],
        [-1.06, 1.12], [-0.78, 1.62], [-0.36, 1.72], [0.22, 1.66],
        [0.50, 1.36], [0.68, 1.06], [1.30, 0.96], [1.94, 0.90],
        [2.24, 0.72], [2.30, 0.40], [1.70, 0.30], [-1.72, 0.30]
      ],
      bevel: 0.13
    }
  };

  const prof = PROFILES[bodyKind] || PROFILES.rally_wrc;

  // === ОСНОВНОЙ КУЗОВ: ExtrudeGeometry + фаски ===
  const shape = new THREE.Shape();
  prof.side.forEach((pt, i) => {
    if (i === 0) shape.moveTo(pt[0], pt[1]);
    else shape.lineTo(pt[0], pt[1]);
  });
  shape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: prof.width,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: prof.bevel,
    bevelThickness: prof.bevel * 0.9,
    curveSegments: 1,
    steps: 1
  });
  bodyGeo.center();
  bodyGeo.rotateY(Math.PI / 2);
  bodyGeo.computeVertexNormals();

  const mainBodyMesh = new THREE.Mesh(bodyGeo, bodyPaint);
  mainBodyMesh.position.set(0, groundClearance + 0.50, 0);
  mainBodyMesh.userData.baseY = groundClearance + 0.50;
  mainBodyMesh.castShadow = true;
  chassisTilt.add(mainBodyMesh);

  const bodyTopY = groundClearance + prof.side.reduce((m, p) => Math.max(m, p[1]), 0);
  const halfW = prof.width * 0.5;

  // === ОСТЕКЛЕНИЕ: лобовое + боковые + заднее (плоские панели = дёшево) ===
  const glassGroup = new THREE.Group();
  const wsH = 0.46;
  const ws = new THREE.Mesh(new THREE.BoxGeometry(prof.width * 0.80, wsH, 0.06), glassMat);
  ws.position.set(0, groundClearance + 0.98, 0.62);
  ws.rotation.x = -0.62;
  glassGroup.add(ws);

  const rear = new THREE.Mesh(new THREE.BoxGeometry(prof.width * 0.76, wsH * 0.85, 0.06), glassMat);
  rear.position.set(0, groundClearance + 1.00, -0.86);
  rear.rotation.x = 0.52;
  glassGroup.add(rear);

  [-1, 1].forEach(side => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 1.36), glassMat);
    win.position.set(side * (halfW - 0.02), groundClearance + 1.04, -0.12);
    glassGroup.add(win);
  });
  chassisTilt.add(glassGroup);

  // === КРЫША (лаковая, чуть темнее) ===
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(prof.width * 0.84, 0.06, 1.30),
    accentPaint
  );
  roof.position.set(0, groundClearance + 1.22, -0.16);
  chassisTilt.add(roof);

  // === ПЕРЕДНИЙ БАМПЕР / РЕШЁТКА / СПЛИТТЕР ===
  const noseZ = prof.side.reduce((m, p) => Math.max(m, p[0]), 0) * 0.5;
  const bumper = new THREE.Mesh(
    new THREE.BoxGeometry(prof.width * 0.94, 0.22, 0.18), trimMat
  );
  bumper.position.set(0, groundClearance + 0.30, noseZ - 0.02);
  chassisTilt.add(bumper);

  const grille = new THREE.Mesh(
    new THREE.BoxGeometry(prof.width * 0.52, 0.16, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.9, roughness: 0.5 })
  );
  grille.position.set(0, groundClearance + 0.50, noseZ - 0.02);
  chassisTilt.add(grille);

  // Спойлер / антикрыло
  const wingY = bodyTopY - 0.10;
  const wing = new THREE.Mesh(
    new THREE.BoxGeometry(prof.width * 1.02, 0.05, 0.34), accentPaint
  );
  wing.position.set(0, wingY, -noseZ * 0.94);
  chassisTilt.add(wing);

  [-1, 1].forEach(side => {
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, 0.12), trimMat);
    stand.position.set(side * prof.width * 0.34, wingY - 0.12, -noseZ * 0.94);
    chassisTilt.add(stand);
  });

  // === ФАРЫ: блок + линза ===
  const headlightBlockMat = new THREE.MeshStandardMaterial({
    color: 0x0d1017, metalness: 0.85, roughness: 0.35
  });
  [-1, 1].forEach(side => {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.16, 0.08), headlightBlockMat
    );
    block.position.set(side * prof.width * 0.30, groundClearance + 0.60, noseZ - 0.01);
    block.rotation.y = side * 0.10;
    chassisTilt.add(block);

    const lens = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.11, 0.04), MATS.headlightLens || MATS.headlight
    );
    lens.position.set(side * prof.width * 0.30, groundClearance + 0.60, noseZ + 0.015);
    lens.rotation.y = side * 0.10;
    chassisTilt.add(lens);
  });

  // === ЗАДНИЕ ФОНАРИ (красные) ===
  [-1, 1].forEach(side => {
    const tl = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.14, 0.07), tailMat
    );
    tl.position.set(side * prof.width * 0.30, groundClearance + 0.58, -noseZ + 0.01);
    chassisTilt.add(tl);
    tailMeshes.push(tl);
  });

  // Задний бампер + диффузор
  const rearBumper = new THREE.Mesh(
    new THREE.BoxGeometry(prof.width * 0.92, 0.20, 0.16), trimMat
  );
  rearBumper.position.set(0, groundClearance + 0.28, -noseZ + 0.02);
  chassisTilt.add(rearBumper);

  exhaustPoints.push(new THREE.Vector3(-prof.width * 0.26, groundClearance + 0.24, -noseZ - 0.02));
  exhaustPoints.push(new THREE.Vector3(prof.width * 0.26, groundClearance + 0.24, -noseZ - 0.02));

  // === КОЛЕСНЫЕ АРКИ ===
  if (createWheelArch) {
    const fArch = createWheelArch(wheelRadius, trackWidth + 0.04, 0.06, bodyPaint);
    fArch.position.set(0, groundClearance + wheelRadius - 0.06, wheelBase * 0.5);
    const rArch = createWheelArch(wheelRadius, trackWidth + 0.06, 0.07, bodyPaint);
    rArch.position.set(0, groundClearance + wheelRadius - 0.06, -wheelBase * 0.5);
    chassisTilt.add(fArch, rArch);
  }

  // Боковые молдинги / пороги
  [-1, 1].forEach(side => {
    const skirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, wheelBase * 0.92), trimMat
    );
    skirt.position.set(side * (prof.width * 0.47), groundClearance + 0.22, 0);
    chassisTilt.add(skirt);
  });

  // Зеркала
  [-1, 1].forEach(side => {
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.08, 0.09), accentPaint
    );
    mirror.position.set(side * (halfW + 0.04), groundClearance + 0.98, 0.42);
    chassisTilt.add(mirror);
  });

  // === САЛОН (виден сквозь затемнённое стекло) ===
  const cockpit = createInteriorCockpit(1.9, trackWidth * 0.66, groundClearance);
  chassisTilt.add(cockpit);

  // === КОНТАКТНАЯ ТЕНЬ ПОД ДНИЩЕМ ===
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 64;
  const sctx = shadowCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(32, 32, 2, 32, 32, 31);
  grad.addColorStop(0, 'rgba(0,0,0,0.62)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.34)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 64);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);

  const shadowGeo = new THREE.PlaneGeometry(trackWidth + 0.9, wheelBase + 1.5);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMesh = new THREE.Mesh(
    shadowGeo,
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, side: THREE.DoubleSide, opacity: 0.85, depthWrite: false })
  );
  shadowMesh.position.y = 0.02;
  root.add(shadowMesh);

  // === 4 КОЛЕСА: ступица + поворот + вращение ===
  const wheels = [];
  const steerPivots = [];
  const spinMeshes = [];

  const halfTrack = trackWidth * 0.5;
  const halfBase = wheelBase * 0.5;

  const wheelStyle = (bodyKind === 'muscle_v8') ? 'gold'
    : (carConfig.id === 'retro_911' || carConfig.id === 'street_gtr') ? 'black'
    : 'sport';
  const isOffroad = (bodyKind === 'dakar_4x4' || bodyKind === 'rally_wrc');

  [
    { x: -halfTrack, z: halfBase, steer: true },
    { x: halfTrack, z: halfBase, steer: true },
    { x: -halfTrack, z: -halfBase, steer: false },
    { x: halfTrack, z: -halfBase, steer: false }
  ].forEach(wp => {
    const pivot = new THREE.Group();
    pivot.position.set(wp.x, wheelRadius, wp.z);
    root.add(pivot);

    const spinGroup = new THREE.Group();
    pivot.add(spinGroup);

    const wMesh = createCurvedWheel(wheelRadius, wheelWidth, wheelStyle, isOffroad);
    spinGroup.add(wMesh);

    wheels.push({ pivot, spinGroup, isFront: wp.steer, radius: wheelRadius });
    if (wp.steer) steerPivots.push(pivot);
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
      for (let i = 0; i < tailMeshes.length; i++) tailMeshes[i].material = activeMat;
    },
    applySkin(skin) {
      if (!mainBodyMesh) return;
      bodyPaint.color.set(skin.color);
      accentPaint.color.set(skin.accent);
      const isCarbon = (skin.id === 'stealth' || skin.id === 'carbon');
      bodyPaint.map = isCarbon ? carbonTex : null;
      bodyPaint.roughness = isCarbon ? 0.40 : 0.22;
      bodyPaint.clearcoat = isCarbon ? 0.65 : 1.0;
      bodyPaint.needsUpdate = true;
      accentPaint.needsUpdate = true;
    },
    dentLevel: 0,
    applyDent() {
      this.dentLevel = Math.min(3, (this.dentLevel || 0) + 1);
      const k = this.dentLevel;
      if (mainBodyMesh) {
        mainBodyMesh.scale.set(1 - k * 0.025, 1 - k * 0.035, 1 - k * 0.045);
        mainBodyMesh.position.z = -0.07 * k;
        mainBodyMesh.position.y = mainBodyMesh.userData.baseY - 0.03 * k;
        bodyPaint.roughness = 0.22 + k * 0.14;
        bodyPaint.clearcoat = Math.max(0, 1.0 - k * 0.32);
        bodyPaint.needsUpdate = true;
      }
      chassisTilt.rotation.z += (Math.random() - 0.5) * 0.035;
    },
    repair() {
      this.dentLevel = 0;
      if (mainBodyMesh) {
        mainBodyMesh.scale.set(1, 1, 1);
        mainBodyMesh.position.z = 0;
        mainBodyMesh.position.y = mainBodyMesh.userData.baseY;
        bodyPaint.roughness = 0.22;
        bodyPaint.clearcoat = 1.0;
        bodyPaint.needsUpdate = true;
      }
      chassisTilt.rotation.z = 0;
    }
  };
}
