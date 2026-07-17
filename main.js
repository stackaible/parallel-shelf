// THE PARALLEL SHELF — a walkable 3D bookshop
// Walk the aisles, pull a book off a shelf, read it free (Project Gutenberg) or buy it.

import * as THREE from 'three';

// ---------------------------------------------------------------- constants
const ROOM = { w: 26, d: 18, h: 4.2 };            // x: -13..13, z: -9..9
const EYE = 1.62;
const REACH = 3.2;                                 // how far you can grab from
const AMBER = new THREE.Color(0xe8a13c);

// ---------------------------------------------------------------- catalog
const AMZ = (t, a) => `https://www.amazon.com/s?k=${encodeURIComponent(t + ' ' + a)}`;
const G = id => `https://www.gutenberg.org/ebooks/${id}`;

const CATALOG = {
  'Classics': [
    { t: 'Pride and Prejudice', a: 'Jane Austen', g: 1342, b: 'A truth universally acknowledged: nobody spars like Lizzy and Darcy.' },
    { t: 'Jane Eyre', a: 'Charlotte Brontë', g: 1260, b: 'A governess with a spine of steel and a house with a secret upstairs.' },
    { t: 'Wuthering Heights', a: 'Emily Brontë', g: 768, b: 'Love as weather system — moorland storms, generational wreckage.' },
    { t: 'Great Expectations', a: 'Charles Dickens', g: 1400, b: 'Pip, a convict, a jilted bride, and a fortune with strings attached.' },
    { t: 'A Tale of Two Cities', a: 'Charles Dickens', g: 98, b: 'The best of times, the worst of times, and one far, far better thing.' },
    { t: 'Little Women', a: 'Louisa May Alcott', g: 514, b: 'Four sisters, one attic, all of ambition and grief and jam.' },
    { t: 'Emma', a: 'Jane Austen', g: 158, b: 'A matchmaker so confident she nearly ruins everyone, charmingly.' },
    { t: 'Sense and Sensibility', a: 'Jane Austen', g: 161, b: 'Two sisters, two operating systems for the heart.' },
    { t: 'Middlemarch', a: 'George Eliot', g: 145, b: 'A whole town under a microscope; the best novel about unglamorous goodness.' },
    { t: 'Anna Karenina', a: 'Leo Tolstoy', g: 1399, b: 'Happy families are all alike; this book is about the other kind.' },
    { t: 'Crime and Punishment', a: 'Fyodor Dostoevsky', g: 2554, b: 'One axe, one theory, four hundred pages of conscience.' },
    { t: 'The Great Gatsby', a: 'F. Scott Fitzgerald', g: 64317, b: 'A green light, a gorgeous party, and the American dream on the rocks.' },
    { t: 'A Christmas Carol', a: 'Charles Dickens', g: 46, b: 'Three ghosts run history’s most effective intervention.' },
    { t: 'Anne of Green Gables', a: 'L. M. Montgomery', g: 45, b: 'Scope for the imagination, red hair, and kindred spirits.' },
  ],
  'Adventure': [
    { t: 'Treasure Island', a: 'Robert Louis Stevenson', g: 120, b: 'X marks the spot; Long John Silver marks everything else.' },
    { t: 'Moby-Dick', a: 'Herman Melville', g: 2701, b: 'Call him Ishmael. Call the whale unavailable for comment.' },
    { t: 'The Count of Monte Cristo', a: 'Alexandre Dumas', g: 1184, b: 'The patron saint of elaborate, extremely patient revenge.' },
    { t: 'Around the World in Eighty Days', a: 'Jules Verne', g: 103, b: 'One wager, one valet, and every timetable on Earth.' },
    { t: 'The Call of the Wild', a: 'Jack London', g: 215, b: 'A good dog answers an older, colder ancestry.' },
    { t: 'White Fang', a: 'Jack London', g: 910, b: 'The Call of the Wild, run in reverse: wilderness learns to love.' },
    { t: 'Robinson Crusoe', a: 'Daniel Defoe', g: 521, b: 'Twenty-eight years of island DIY and one Friday.' },
    { t: 'The Three Musketeers', a: 'Alexandre Dumas', g: 1257, b: 'All for one, one for all, everyone for a duel at noon.' },
    { t: 'Kidnapped', a: 'Robert Louis Stevenson', g: 421, b: 'A stolen inheritance and a flight across the Highlands.' },
  ],
  'Sci-Fi & Fantasy': [
    { t: 'Frankenstein', a: 'Mary Shelley', g: 84, b: 'The original "just because you can doesn’t mean you should."' },
    { t: 'The Time Machine', a: 'H. G. Wells', g: 35, b: 'First stop: the year 802,701. It does not go great.' },
    { t: 'The War of the Worlds', a: 'H. G. Wells', g: 36, b: 'Across the gulf of space, intellects vast and cool regard our planet.' },
    { t: 'Twenty Thousand Leagues Under the Seas', a: 'Jules Verne', g: 164, b: 'Captain Nemo’s grudge tour of the ocean floor.' },
    { t: 'A Journey to the Centre of the Earth', a: 'Jules Verne', g: 18857, b: 'Down an Icelandic volcano, past the dinosaurs, mind the mushrooms.' },
    { t: 'The Invisible Man', a: 'H. G. Wells', g: 5230, b: 'A scientist disappears — and becomes his worst self, visibly.' },
    { t: 'The Strange Case of Dr Jekyll and Mr Hyde', a: 'Robert Louis Stevenson', g: 43, b: 'One door, two tenants, no vacancy for the conscience.' },
    { t: 'A Princess of Mars', a: 'Edgar Rice Burroughs', g: 62, b: 'Pulp Mars: swords, airships, and a Virginian who can really jump.' },
    { t: 'The Lost World', a: 'Arthur Conan Doyle', g: 139, b: 'Professor Challenger finds the plateau the dinosaurs never left.' },
  ],
  'Mystery & Gothic': [
    { t: 'The Adventures of Sherlock Holmes', a: 'Arthur Conan Doyle', g: 1661, b: 'Twelve cases; the game is afoot in every one.' },
    { t: 'The Hound of the Baskervilles', a: 'Arthur Conan Doyle', g: 2852, b: 'A spectral hound on the moor, and reason on its trail.' },
    { t: 'Dracula', a: 'Bram Stoker', g: 345, b: 'Letters, diaries, and an ancient appetite headed for London.' },
    { t: 'The Picture of Dorian Gray', a: 'Oscar Wilde', g: 174, b: 'The portrait ages; the sin compounds; the wit never dulls.' },
    { t: 'The Turn of the Screw', a: 'Henry James', g: 209, b: 'A governess, two children, and ghosts that may be watching back.' },
    { t: 'The Moonstone', a: 'Wilkie Collins', g: 155, b: 'The first great detective novel: a diamond, a dinner, a disappearance.' },
    { t: 'The Thirty-Nine Steps', a: 'John Buchan', g: 558, b: 'The original wrong-man-on-the-run thriller.' },
    { t: 'Carmilla', a: 'J. Sheridan Le Fanu', g: 10007, b: 'The vampire novella that beat Dracula to the throat by 25 years.' },
  ],
  'Big Ideas': [
    { t: 'Meditations', a: 'Marcus Aurelius', g: 2680, b: 'A Roman emperor’s private notes on how to be a person.' },
    { t: 'The Art of War', a: 'Sun Tzu', g: 132, b: 'Win first, fight later — 2,500 years of strategy in a slim volume.' },
    { t: 'Walden', a: 'Henry David Thoreau', g: 205, b: 'Two years by a pond, deliberately.' },
    { t: 'Leaves of Grass', a: 'Walt Whitman', g: 1322, b: 'A poet who contains multitudes and isn’t sorry about it.' },
    { t: 'The Republic', a: 'Plato', g: 1497, b: 'Justice, the ideal city, and the most famous cave in philosophy.' },
    { t: 'The Prophet', a: 'Kahlil Gibran', g: 58585, b: 'On love, work, joy and sorrow — verses people live by.' },
    { t: 'The Metamorphosis', a: 'Franz Kafka', g: 5200, b: 'Gregor Samsa wakes from uneasy dreams. It gets weirder.' },
    { t: 'Essays of Ralph Waldo Emerson', a: 'Ralph Waldo Emerson', g: 16643, b: 'Self-reliance, nature, and sentences that read like weather.' },
  ],
  'Kids': [
    { t: 'Alice’s Adventures in Wonderland', a: 'Lewis Carroll', g: 11, b: 'Down the rabbit hole: logic optional, tea mandatory.' },
    { t: 'Peter Pan', a: 'J. M. Barrie', g: 16, b: 'Second star to the right and straight on till morning.' },
    { t: 'The Wonderful Wizard of Oz', a: 'L. Frank Baum', g: 55, b: 'Brains, heart, courage — and decent footwear.' },
    { t: 'Grimms’ Fairy Tales', a: 'The Brothers Grimm', g: 2591, b: 'The original versions. Braver than the cartoons.' },
    { t: 'The Wind in the Willows', a: 'Kenneth Grahame', g: 289, b: 'Messing about in boats with Ratty, Mole, and the incorrigible Toad.' },
    { t: 'The Secret Garden', a: 'Frances Hodgson Burnett', g: 113, b: 'A locked door, a robin, and everything coming back to life.' },
    { t: 'The Jungle Book', a: 'Rudyard Kipling', g: 236, b: 'Mowgli between two worlds, with a bear’s bare necessities.' },
    { t: 'Just So Stories', a: 'Rudyard Kipling', g: 2781, b: 'How the camel got his hump, O Best Beloved.' },
  ],
};
for (const [genre, list] of Object.entries(CATALOG))
  list.forEach(item => { item.genre = genre; item.buy = AMZ(item.t, item.a); item.read = item.g ? G(item.g) : null; });

const STAFF_PICKS = [CATALOG['Classics'][11], CATALOG['Big Ideas'][0], CATALOG['Mystery & Gothic'][0], CATALOG['Kids'][0]];
const LOCAL_AUTHORS = [
  { t: 'Escape from Escapism', a: 'David Bowers', genre: 'Local Author', local: true,
    b: 'An arcade survival story for your attention span: distractions hunt you, you hunt intentions, and the only way out of the Doomscroll Depths is up. Companion book to the game. Reading tonight at 7!',
    read: null, buy: AMZ('Escape from Escapism', 'David Bowers'), cover: 0x1c3a4a },
  { t: 'Parallel Self', a: 'David Bowers', genre: 'Local Author', local: true,
    b: 'A game — and a question: who did you become in the timeline next door? Companion book to the Parallel Self experience.',
    read: null, buy: AMZ('Parallel Self', 'David Bowers'), cover: 0x3a1c4a },
];

// ---------------------------------------------------------------- renderer / scene
const initW = innerWidth || 1280, initH = innerHeight || 800;  // hidden tabs report 0x0
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(initW, initH);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x150d06);
const camera = new THREE.PerspectiveCamera(66, initW / initH, 0.05, 80);
camera.position.set(0, EYE, 7.4);

// ---------------------------------------------------------------- canvas textures
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const floorTex = canvasTex(512, 512, (x, w, h) => {
  x.fillStyle = '#7d5231'; x.fillRect(0, 0, w, h);
  const rows = 8;
  for (let r = 0; r < rows; r++) {
    const y = r * h / rows, ph = h / rows;
    const off = (r % 2) * 90;
    for (let px = -1; px < 4; px++) {
      const xx = px * 170 + off;
      const shade = 0.82 + Math.random() * 0.3;
      x.fillStyle = `rgb(${125 * shade | 0},${82 * shade | 0},${47 * shade | 0})`;
      x.fillRect(xx, y, 168, ph - 2);
      x.strokeStyle = 'rgba(40,20,8,.5)'; x.strokeRect(xx, y, 168, ph - 2);
      for (let g = 0; g < 5; g++) {
        x.strokeStyle = 'rgba(60,35,15,.25)';
        x.beginPath();
        const gy = y + 4 + Math.random() * (ph - 8);
        x.moveTo(xx + 5, gy); x.bezierCurveTo(xx + 60, gy + 3, xx + 110, gy - 3, xx + 163, gy + 2);
        x.stroke();
      }
    }
  }
});
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(6, 4.5);

function rugTex(colors) {
  return canvasTex(512, 512, (x, w, h) => {
    for (let i = 8; i >= 0; i--) {
      x.fillStyle = colors[i % colors.length];
      x.beginPath(); x.arc(w / 2, h / 2, (i + 1) * w / 18, 0, 7); x.fill();
    }
  });
}

function signTex(text, sub) {
  return canvasTex(640, 200, (x, w, h) => {
    x.fillStyle = '#3a2718'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#e8a13c'; x.lineWidth = 5; x.strokeRect(12, 12, w - 24, h - 24);
    x.fillStyle = '#f5ead6'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `italic ${sub ? 58 : 68}px Georgia`;
    x.fillText(text, w / 2, sub ? h / 2 - 22 : h / 2);
    if (sub) { x.font = '30px Georgia'; x.fillStyle = '#e8a13c'; x.fillText(sub, w / 2, h / 2 + 42); }
  });
}

const skyTex = canvasTex(256, 256, (x, w, h) => {
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#2b1f4e'); g.addColorStop(0.55, '#8a4a52'); g.addColorStop(0.78, '#d97b3c'); g.addColorStop(1, '#f0b060');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = 'rgba(255,240,220,.9)';
  for (let i = 0; i < 40; i++) { const sy = Math.random() * h * 0.5; x.globalAlpha = 0.3 + Math.random() * 0.7; x.fillRect(Math.random() * w, sy, 2, 2); }
  x.globalAlpha = 1;
});

const coverCache = new Map();
function coverTexture(item) {
  if (coverCache.has(item.t)) return coverCache.get(item.t);
  const base = new THREE.Color(item.cover ?? spineColor(item.t).getHex());
  const tex = canvasTex(512, 768, (x, w, h) => {
    x.fillStyle = `#${base.getHexString()}`; x.fillRect(0, 0, w, h);
    const g = x.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(0.15, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(245,234,214,.85)'; x.lineWidth = 6; x.strokeRect(28, 28, w - 56, h - 56);
    x.fillStyle = '#f5ead6'; x.textAlign = 'center';
    x.font = 'italic 44px Georgia';
    const words = item.t.split(' '); const lines = ['']; let li = 0;
    for (const wd of words) {
      if ((lines[li] + ' ' + wd).trim().length > 16) { lines[++li] = wd; }
      else lines[li] = (lines[li] + ' ' + wd).trim();
    }
    lines.slice(0, 4).forEach((ln, i) => x.fillText(ln, w / 2, 190 + i * 62));
    x.fillStyle = 'rgba(245,234,214,.9)';
    x.fillRect(w / 2 - 60, 470, 120, 3);
    x.font = '34px Georgia';
    x.fillText(item.a, w / 2, 560);
    if (item.local) {
      x.save(); x.translate(w / 2, 660); x.fillStyle = '#e8a13c';
      x.fillRect(-150, -26, 300, 52); x.fillStyle = '#241a12'; x.font = 'bold 26px Georgia';
      x.fillText('LOCAL AUTHOR', 0, 9); x.restore();
    }
  });
  coverCache.set(item.t, tex);
  return tex;
}

// ---------------------------------------------------------------- materials
const M = {
  floor: new THREE.MeshLambertMaterial({ map: floorTex }),
  wall: new THREE.MeshLambertMaterial({ color: 0xdfc9a3 }),
  ceil: new THREE.MeshLambertMaterial({ color: 0xcdb38c }),
  woodDark: new THREE.MeshLambertMaterial({ color: 0x452e1c }),
  woodMid: new THREE.MeshLambertMaterial({ color: 0x6b4a2e }),
  woodLight: new THREE.MeshLambertMaterial({ color: 0x8a6844 }),
  beam: new THREE.MeshLambertMaterial({ color: 0x3a2717 }),
  velvetTeal: new THREE.MeshLambertMaterial({ color: 0x2e6e63 }),
  velvetRust: new THREE.MeshLambertMaterial({ color: 0x9c4a2a }),
  cushion: new THREE.MeshLambertMaterial({ color: 0xd9b98a }),
  brass: new THREE.MeshLambertMaterial({ color: 0xc9a24a }),
  paper: new THREE.MeshLambertMaterial({ color: 0xe8dcc0 }),
  leaf: new THREE.MeshLambertMaterial({ color: 0x3f6b35 }),
  pot: new THREE.MeshLambertMaterial({ color: 0xa85f38 }),
  catFur: new THREE.MeshLambertMaterial({ color: 0x4a443f }),
  black: new THREE.MeshLambertMaterial({ color: 0x201812 }),
};

function box(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); parent.add(m); return m;
}

// ---------------------------------------------------------------- room
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), M.floor);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), M.ceil);
  ceil.rotation.x = Math.PI / 2; ceil.position.y = ROOM.h; scene.add(ceil);
  for (let i = -2; i <= 2; i++) box(0.3, 0.26, ROOM.d, M.beam, i * 5.2, ROOM.h - 0.13, 0);

  const mkWall = (w, h, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M.wall);
    m.position.set(x, y, z); m.rotation.y = ry; scene.add(m);
  };
  mkWall(ROOM.w, ROOM.h, 0, ROOM.h / 2, -ROOM.d / 2, 0);           // north
  mkWall(ROOM.w, ROOM.h, 0, ROOM.h / 2, ROOM.d / 2, Math.PI);      // south
  mkWall(ROOM.d, ROOM.h, -ROOM.w / 2, ROOM.h / 2, 0, Math.PI / 2); // west
  mkWall(ROOM.d, ROOM.h, ROOM.w / 2, ROOM.h / 2, 0, -Math.PI / 2); // east
  // baseboards
  box(ROOM.w, 0.14, 0.05, M.woodDark, 0, 0.07, -ROOM.d / 2 + 0.025);
  box(ROOM.w, 0.14, 0.05, M.woodDark, 0, 0.07, ROOM.d / 2 - 0.025);
  box(0.05, 0.14, ROOM.d, M.woodDark, -ROOM.w / 2 + 0.025, 0.07, 0);
  box(0.05, 0.14, ROOM.d, M.woodDark, ROOM.w / 2 - 0.025, 0.07, 0);

  // west window + dusk sky
  const win = { z: 1.25, w: 2.2, h: 1.7, sill: 1.0 };
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(win.w, win.h),
    new THREE.MeshBasicMaterial({ map: skyTex }));
  sky.position.set(-ROOM.w / 2 - 0.01, win.sill + win.h / 2, win.z);
  sky.rotation.y = Math.PI / 2; scene.add(sky);
  const fw = (w, h, x, y, z) => box(0.1, h, w, M.woodDark, x, y, z);
  fw(win.w + 0.16, 0.1, -ROOM.w / 2 + 0.02, win.sill - 0.02, win.z);
  fw(win.w + 0.16, 0.1, -ROOM.w / 2 + 0.02, win.sill + win.h + 0.02, win.z);
  fw(0.1, win.h + 0.14, -ROOM.w / 2 + 0.02, win.sill + win.h / 2, win.z - win.w / 2 - 0.03);
  fw(0.1, win.h + 0.14, -ROOM.w / 2 + 0.02, win.sill + win.h / 2, win.z + win.w / 2 + 0.03);
  fw(0.04, win.h, -ROOM.w / 2 + 0.02, win.sill + win.h / 2, win.z); // mullion

  // south door
  box(0.14, 2.3, 0.14, M.woodDark, -1.0, 1.15, ROOM.d / 2 - 0.07);
  box(0.14, 2.3, 0.14, M.woodDark, 1.0, 1.15, ROOM.d / 2 - 0.07);
  box(2.14, 0.14, 0.14, M.woodDark, 0, 2.37, ROOM.d / 2 - 0.07);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.86, 2.24),
    new THREE.MeshLambertMaterial({ color: 0x27354a, emissive: 0x101b2a }));
  glass.position.set(0, 1.14, ROOM.d / 2 - 0.02); glass.rotation.y = Math.PI; scene.add(glass);
  // welcome mat
  const mat = box(1.7, 0.02, 0.9, new THREE.MeshLambertMaterial({
    map: canvasTex(256, 128, (x, w, h) => {
      x.fillStyle = '#6b3f26'; x.fillRect(0, 0, w, h);
      x.strokeStyle = '#d9b98a'; x.lineWidth = 6; x.strokeRect(8, 8, w - 16, h - 16);
      x.fillStyle = '#d9b98a'; x.font = 'bold 34px Georgia'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('WELCOME IN', w / 2, h / 2);
    })
  }), 0, 0.012, ROOM.d / 2 - 1.0);
  mat.rotation.y = Math.PI;
}

// ---------------------------------------------------------------- colliders
const colliders = [];
const collide = (cx, cz, hw, hd) => colliders.push({ x1: cx - hw, z1: cz - hd, x2: cx + hw, z2: cz + hd });

// ---------------------------------------------------------------- bookcases + instanced books
const SPINES = ['#8a2f2b', '#2e6e63', '#b5893a', '#3e5c8a', '#6b4a72', '#496b39', '#a85f38', '#374a5c',
  '#7d3b52', '#c2a45c', '#54452e', '#2a5c55', '#94502e', '#5c3a6b', '#42576b', '#996b2e'];
function spineColor(seedStr) {
  let s = 0; for (const ch of seedStr) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return new THREE.Color(SPINES[s % SPINES.length]);
}

const bookGeo = new THREE.BoxGeometry(1, 1, 1);
const bookMat = new THREE.MeshLambertMaterial();
const bookcases = [];

function makeBookcase({ width = 2.2, height = 2.35, depth = 0.34, rows = 4, genre, x, z, ry = 0, seed = 0 }) {
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.rotation.y = ry;

  box(0.04, height, depth, M.woodMid, -(width / 2 - 0.02), height / 2, 0, g);
  box(0.04, height, depth, M.woodMid, width / 2 - 0.02, height / 2, 0, g);
  box(width, 0.06, depth, M.woodMid, 0, height + 0.03, 0, g);
  box(width, height, 0.025, M.woodDark, 0, height / 2, -depth / 2 + 0.013, g);
  box(width, 0.12, depth, M.woodDark, 0, 0.06, 0, g);

  const rowYs = [];
  const rowStep = (height - 0.58) / Math.max(1, rows - 1);
  for (let r = 0; r < rows; r++) {
    const y = 0.24 + r * rowStep;
    rowYs.push(y);
    box(width - 0.08, 0.04, depth - 0.05, M.woodMid, 0, y - 0.02, 0.01, g);
  }

  // book slots
  const list = CATALOG[genre];
  const dummy = new THREE.Object3D();
  const slots = [];
  let rnd = seed * 137 + 7;
  const rand = () => { rnd = (rnd * 16807) % 2147483647; return (rnd & 0xffff) / 0x10000; };
  for (const y of rowYs) {
    const half = width / 2 - 0.09;
    let cx = -half;
    while (cx < half - 0.06) {
      if (rand() < 0.055) { cx += 0.05 + rand() * 0.13; continue; }   // breathing gaps
      const t = 0.026 + rand() * 0.032;
      const bh = 0.19 + rand() * 0.11;
      const bd = 0.15 + rand() * 0.035;
      if (cx + t > half) break;
      dummy.position.set(cx + t / 2, y + bh / 2, 0.03 + (rand() - 0.5) * 0.02);
      dummy.rotation.set(0, (rand() - 0.5) * 0.05, 0);
      dummy.scale.set(t, bh, bd);
      dummy.updateMatrix();
      const item = list[(slots.length * 5 + seed * 3) % list.length];   // stride 5 is coprime with every list length
      slots.push({ item, matrix: dummy.matrix.clone(), pulled: false });
      cx += t + 0.004;
    }
  }

  const inst = new THREE.InstancedMesh(bookGeo, bookMat, slots.length);
  const col = new THREE.Color();
  slots.forEach((s, i) => {
    inst.setMatrixAt(i, s.matrix);
    col.copy(spineColor(s.item.t)).multiplyScalar(0.85 + (i % 7) * 0.05);
    inst.setColorAt(i, col);
    s.baseColor = col.clone();
  });
  inst.castShadow = true;
  g.add(inst);
  scene.add(g);
  g.updateMatrixWorld(true);

  const hw = Math.abs(Math.sin(ry)) > 0.5 ? depth / 2 : width / 2;
  const hd = Math.abs(Math.sin(ry)) > 0.5 ? width / 2 : depth / 2;
  collide(x, z, hw + 0.03, hd + 0.03);

  const bc = { group: g, inst, slots, genre, x, z };
  inst.userData.bookcase = bc;
  bookcases.push(bc);
  return bc;
}

// north wall — Classics
for (let i = 0; i < 8; i++)
  makeBookcase({ genre: 'Classics', x: -7.875 + i * 2.25, z: -8.82, ry: 0, seed: i });
// west wall — Adventure
[-6.75, -4.5, -2.25, 4.75].forEach((z, i) =>
  makeBookcase({ genre: 'Adventure', x: -12.82, z, ry: Math.PI / 2, seed: 10 + i }));
// east wall — Sci-Fi & Fantasy
[-6.75, -4.5, -2.25, 0].forEach((z, i) =>
  makeBookcase({ genre: 'Sci-Fi & Fantasy', x: 12.82, z, ry: -Math.PI / 2, seed: 20 + i }));
// islands
[-3.35, -0.75].forEach((z, i) => {
  makeBookcase({ genre: 'Mystery & Gothic', width: 2.5, x: -4 + 0.17, z, ry: Math.PI / 2, seed: 30 + i });
  makeBookcase({ genre: 'Mystery & Gothic', width: 2.5, x: -4 - 0.17, z, ry: -Math.PI / 2, seed: 32 + i });
  makeBookcase({ genre: 'Big Ideas', width: 2.5, x: 4 + 0.17, z, ry: Math.PI / 2, seed: 34 + i });
  makeBookcase({ genre: 'Big Ideas', width: 2.5, x: 4 - 0.17, z, ry: -Math.PI / 2, seed: 36 + i });
});
collide(-4, -2.05, 0.45, 2.7); collide(4, -2.05, 0.45, 2.7);
// kids' nook — low cases
makeBookcase({ genre: 'Kids', height: 1.15, rows: 2, x: -9.5, z: 8.82, ry: Math.PI, seed: 40 });
makeBookcase({ genre: 'Kids', height: 1.15, rows: 2, x: -12.82, z: 6.8, ry: Math.PI / 2, seed: 41 });

// ---------------------------------------------------------------- featured display books
const featured = [];   // individual meshes, raycastable
function displayBook(item, x, y, z, ry, lean = -0.22, scale = 1) {
  const w = 0.34 * scale, h = 0.5 * scale, t = 0.045 * scale;
  const cover = new THREE.MeshLambertMaterial({ map: coverTexture(item) });
  const side = new THREE.MeshLambertMaterial({ color: 0xe8dcc0 });
  const back = new THREE.MeshLambertMaterial({ color: spineColor(item.t).multiplyScalar(0.8) });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), [side, side, side, side, cover, back]);
  mesh.position.set(x, y + h / 2, z);
  mesh.rotation.set(lean, ry, 0);
  mesh.castShadow = true;
  mesh.userData.item = item;
  mesh.userData.home = { pos: mesh.position.clone(), quat: mesh.quaternion.clone() };
  scene.add(mesh);
  featured.push(mesh);
  // tiny easel behind
  box(0.05, h * 0.75, 0.05, M.woodDark, x - Math.sin(ry) * 0.0, y + h * 0.3, z - Math.cos(ry) * (t + 0.04));
  return mesh;
}

function roundTable(x, z, r = 0.62) {
  const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.045, 28), M.woodLight);
  top.position.set(x, 0.78, z); top.castShadow = true; top.receiveShadow = true; scene.add(top);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.76, 12), M.woodDark);
  stem.position.set(x, 0.38, z); scene.add(stem);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.05, 20), M.woodDark);
  base.position.set(x, 0.025, z); scene.add(base);
  collide(x, z, r * 0.85, r * 0.85);
}

// staff picks table
roundTable(-2.3, 5.4);
STAFF_PICKS.forEach((item, i) => {
  const a = i * Math.PI / 2 + 0.4;
  displayBook(item, -2.3 + Math.cos(a) * 0.34, 0.80, 5.4 + Math.sin(a) * 0.34, Math.PI - a - Math.PI / 2, -0.24, 0.85);
});
// local author spotlight table
roundTable(2.3, 5.4);
displayBook(LOCAL_AUTHORS[0], 2.08, 0.80, 5.32, 0.25);
displayBook(LOCAL_AUTHORS[1], 2.62, 0.80, 5.55, -0.3);
{ // table sign plate, facing the entrance
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.2),
    new THREE.MeshLambertMaterial({ map: signTex('Local Author', 'SPOTLIGHT') }));
  plate.position.set(2.3, 0.93, 5.98); plate.rotation.set(-0.3, 0, 0); scene.add(plate);
}

// ---------------------------------------------------------------- furniture
function armchair(x, z, ry, mat) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry;
  box(0.78, 0.34, 0.75, mat, 0, 0.17, 0, g);
  box(0.7, 0.13, 0.62, M.cushion, 0, 0.4, 0.03, g).castShadow = true;
  box(0.78, 0.62, 0.16, mat, 0, 0.63, -0.32, g).castShadow = true;
  box(0.14, 0.28, 0.7, mat, -0.34, 0.55, 0, g);
  box(0.14, 0.28, 0.7, mat, 0.34, 0.55, 0, g);
  scene.add(g); collide(x, z, 0.45, 0.45);
  return g;
}
function floorLamp(x, z) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.55, 10), M.brass);
  pole.position.set(x, 0.78, z); scene.add(pole);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.04, 14), M.brass);
  base.position.set(x, 0.02, z); scene.add(base);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.28, 14, 1, true),
    new THREE.MeshLambertMaterial({ color: 0xd98a3c, emissive: 0x7a4515, side: THREE.DoubleSide }));
  shade.position.set(x, 1.62, z); scene.add(shade);
  const l = new THREE.PointLight(0xffc98a, 14, 7, 2);
  l.position.set(x, 1.5, z); scene.add(l);
  collide(x, z, 0.2, 0.2);
}
function plant(x, z, s = 1) {
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * s, 0.12 * s, 0.26 * s, 12), M.pot);
  pot.position.set(x, 0.13 * s, z); scene.add(pot);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.05 * s, 0.55 * s, 6), M.leaf);
    const a = i / 6 * Math.PI * 2;
    leaf.position.set(x + Math.cos(a) * 0.07 * s, 0.45 * s, z + Math.sin(a) * 0.07 * s);
    leaf.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45);
    scene.add(leaf);
  }
  collide(x, z, 0.18 * s, 0.18 * s);
}
function rug(x, z, r, colors) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 36),
    new THREE.MeshLambertMaterial({ map: rugTex(colors) }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.012, z); m.receiveShadow = true; scene.add(m);
}
function bookStack(x, z, y = 0, n = 4) {
  let h = y;
  for (let i = 0; i < n; i++) {
    const bh = 0.045;
    const b = box(0.3 - i * 0.03, bh, 0.22 - i * 0.02,
      new THREE.MeshLambertMaterial({ color: spineColor('stack' + x + i + z) }), x, h + bh / 2, z);
    b.rotation.y = (i % 2) * 0.4 - 0.2; b.castShadow = true;
    h += bh;
  }
}

// NE reading nook
rug(10.3, -6.2, 1.5, ['#2e6e63', '#f5ead6', '#9c4a2a', '#2e6e63', '#d9b98a']);
const chairWithCat = armchair(9.5, -7.0, 0.5, M.velvetTeal);
armchair(11.2, -5.6, 1.25, M.velvetRust);
floorLamp(11.9, -7.4);
roundTable(10.6, -6.15, 0.34);
bookStack(10.6, -6.15, 0.8, 3);
plant(12.4, -4.3);

// west window bench
{
  box(1.9, 0.42, 0.5, M.woodMid, -12.5, 0.21, 1.25).castShadow = true;
  box(1.8, 0.09, 0.44, M.velvetRust, -12.5, 0.48, 1.25);
  collide(-12.5, 1.25, 1.0, 0.3);
  bookStack(-12.15, 1.85, 0.53, 3);
}

// kids' nook
rug(-10.3, 6.4, 1.4, ['#b5893a', '#8a2f2b', '#3e5c8a', '#496b39', '#f5ead6']);
function beanBag(x, z, color) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshLambertMaterial({ color }));
  m.scale.set(1, 0.55, 1); m.position.set(x, 0.23, z); m.castShadow = true; scene.add(m);
  collide(x, z, 0.35, 0.35);
}
beanBag(-9.6, 6.9, 0x8a2f2b);
beanBag(-10.9, 5.6, 0x3e5c8a);
beanBag(-11.3, 7.2, 0x496b39);

// SE event corner — author reading
{
  // podium
  const px = 10.6, pz = 7.4;
  box(0.7, 1.1, 0.5, M.woodDark, px, 0.55, pz).castShadow = true;
  const top = box(0.8, 0.05, 0.55, M.woodMid, px, 1.13, pz);
  top.rotation.x = 0.22;
  const openBook = box(0.4, 0.02, 0.3, M.paper, px, 1.18, pz - 0.02);
  openBook.rotation.x = 0.22;
  collide(px, pz, 0.45, 0.35);
  // audience chairs, facing the podium
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < 4; i++) {
      const cx = 8.6 + i * 1.05 + (row % 2) * 0.3, cz = 5.9 - row * 0.95;
      const g = new THREE.Group(); g.position.set(cx, 0, cz);
      g.rotation.y = Math.atan2(px - cx, pz - cz);
      box(0.42, 0.05, 0.42, M.woodMid, 0, 0.45, 0, g);
      box(0.42, 0.5, 0.05, M.woodMid, 0, 0.72, -0.2, g);
      [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([lx, lz]) =>
        box(0.04, 0.45, 0.04, M.woodDark, lx, 0.225, lz, g));
      scene.add(g); collide(cx, cz, 0.24, 0.24);
    }
  // banner on east wall
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.95),
    new THREE.MeshLambertMaterial({
      map: canvasTex(1024, 288, (x, w, h) => {
        x.fillStyle = '#6e2424'; x.fillRect(0, 0, w, h);
        x.strokeStyle = '#e8a13c'; x.lineWidth = 8; x.strokeRect(14, 14, w - 28, h - 28);
        x.fillStyle = '#f5ead6'; x.textAlign = 'center';
        x.font = 'bold 52px Georgia'; x.fillText('TONIGHT · 7 PM · AUTHOR READING', w / 2, 105);
        x.font = 'italic 46px Georgia'; x.fillStyle = '#e8a13c';
        x.fillText('David Bowers reads from “Escape from Escapism”', w / 2, 200);
      })
    }));
  banner.position.set(ROOM.w / 2 - 0.03, 2.5, 5.2); banner.rotation.y = -Math.PI / 2; scene.add(banner);
  // warm spot on the podium
  const spot = new THREE.SpotLight(0xffd9a0, 60, 12, 0.5, 0.5, 2);
  spot.position.set(9.8, ROOM.h - 0.2, 6.4);
  spot.target.position.set(px, 1, pz); scene.add(spot, spot.target);
}

// ladder against north shelves
{
  const g = new THREE.Group(); g.position.set(5.6, 0, -8.35); g.rotation.x = -0.18;
  box(0.06, 3.1, 0.06, M.woodMid, -0.25, 1.55, 0, g);
  box(0.06, 3.1, 0.06, M.woodMid, 0.25, 1.55, 0, g);
  for (let i = 0; i < 7; i++) box(0.5, 0.045, 0.045, M.woodMid, 0, 0.35 + i * 0.4, 0, g);
  scene.add(g); collide(5.6, -8.3, 0.35, 0.25);
}
plant(-12.3, 3.4, 1.2);
plant(1.6, 8.4, 0.9);

// framed quotes on the south wall, east of the door
function quotePoster(quote, source, x, y = 2.15) {
  const tex = canvasTex(512, 400, (c, w, h) => {
    c.fillStyle = '#3a2718'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#efe3c8'; c.fillRect(26, 26, w - 52, h - 52);
    c.fillStyle = '#241a12'; c.textAlign = 'center';
    c.font = 'italic 36px Georgia';
    const words = quote.split(' '); const lines = ['']; let li = 0;
    for (const wd of words) {
      if ((lines[li] + ' ' + wd).trim().length > 24) lines[++li] = wd;
      else lines[li] = (lines[li] + ' ' + wd).trim();
    }
    const y0 = h / 2 - (lines.length - 1) * 24 - 20;
    lines.forEach((ln, i) => c.fillText(ln, w / 2, y0 + i * 48));
    c.font = '26px Georgia'; c.fillStyle = '#6b4a2e';
    c.fillText('— ' + source, w / 2, h - 70);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.9), new THREE.MeshLambertMaterial({ map: tex }));
  m.position.set(x, y, ROOM.d / 2 - 0.03); m.rotation.y = Math.PI; scene.add(m);
}
quotePoster('“Call me Ishmael.”', 'Moby-Dick', 4.4);
quotePoster('“It was the best of times, it was the worst of times…”', 'A Tale of Two Cities', 6.0);
quotePoster('“We are all in the gutter, but some of us are looking at the stars.”', 'Oscar Wilde', 7.6);

// coffee cart by the event corner — free at readings
{
  const cx = 6.4, cz = 7.9;
  box(1.15, 0.1, 0.6, M.woodMid, cx, 0.92, cz).castShadow = true;
  box(1.05, 0.08, 0.52, M.woodMid, cx, 0.42, cz);
  [[-0.5, -0.24], [0.5, -0.24], [-0.5, 0.24], [0.5, 0.24]].forEach(([lx, lz]) =>
    box(0.05, 0.9, 0.05, M.woodDark, cx + lx, 0.46, cz + lz));
  [[-0.52, -0.26], [0.52, -0.26], [-0.52, 0.26], [0.52, 0.26]].forEach(([lx, lz]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 12), M.black);
    w.rotation.z = Math.PI / 2; w.position.set(cx + lx, 0.07, cz + lz); scene.add(w);
  });
  const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.3, 14), M.brass);
  urn.position.set(cx - 0.3, 1.12, cz); urn.castShadow = true; scene.add(urn);
  for (let i = 0; i < 3; i++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.07, 10), M.paper);
    cup.position.set(cx + 0.12 + i * 0.13, 1.0, cz + 0.12 - (i % 2) * 0.2); scene.add(cup);
  }
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.22),
    new THREE.MeshLambertMaterial({ map: signTex('Coffee', 'FREE AT READINGS') }));
  plate.position.set(cx, 1.22, cz - 0.31); plate.rotation.set(0.12, Math.PI, 0); scene.add(plate);
  collide(cx, cz, 0.65, 0.4);
}

// checkout counter near the door
{
  const cx = -3.4, cz = 7.5;
  box(2.0, 0.98, 0.7, M.woodDark, cx, 0.49, cz).castShadow = true;
  box(2.12, 0.06, 0.8, M.woodLight, cx, 1.0, cz);
  box(0.42, 0.3, 0.34, M.black, cx - 0.55, 1.18, cz);                    // register
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.brass);
  bell.position.set(cx + 0.25, 1.03, cz - 0.15); scene.add(bell);
  bookStack(cx + 0.72, cz, 1.03, 4);
  collide(cx, cz, 1.06, 0.4);
}

// farewell sign above the door, facing back into the store
{
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5),
    new THREE.MeshLambertMaterial({ map: signTex('Read more, scroll less', 'THANKS FOR VISITING') }));
  m.position.set(0, 2.75, ROOM.d / 2 - 0.05); m.rotation.y = Math.PI; scene.add(m);
}

// the shop cat, asleep on the teal armchair
let catMesh;
{
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 12), M.catFur);
  body.scale.set(1.25, 0.62, 0.85); g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), M.catFur);
  head.position.set(0.2, 0.1, 0.06); g.add(head);
  [[-0.045, 0.09], [0.045, 0.09]].forEach(([ex, ey]) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.06, 6), M.catFur);
    ear.position.set(0.2 + ex, 0.1 + ey, 0.06); g.add(ear);
  });
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.028, 8, 14, Math.PI * 1.2), M.catFur);
  tail.position.set(-0.18, -0.02, 0.1); tail.rotation.set(Math.PI / 2, 0, 1.4); g.add(tail);
  g.position.set(9.5 + Math.sin(0.5) * 0.03, 0.62, -7.0);
  g.rotation.y = 0.9;
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.userData.cat = true; } });
  scene.add(g);
  catMesh = g;
}

// ---------------------------------------------------------------- hanging signs
function hangSign(text, x, z, ry = 0, y = 2.85, sub) {
  const tex = signTex(text, sub);
  const mat = new THREE.MeshLambertMaterial({ map: tex });
  [0, Math.PI].forEach(flip => {   // two faces so the text reads correctly from both sides
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.53), mat);
    m.position.set(x, y, z); m.rotation.y = ry + flip; scene.add(m);
  });
  const wireM = new THREE.MeshLambertMaterial({ color: 0x2a1d10 });
  [-0.6, 0.6].forEach(off => {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, ROOM.h - y - 0.28, 4), wireM);
    wire.position.set(x + Math.cos(ry) * off, (ROOM.h + y + 0.28) / 2, z - Math.sin(ry) * off);
    scene.add(wire);
  });
}
hangSign('Classics', 0, -7.6);
hangSign('Adventure', -11.4, -4.5, Math.PI / 2);
hangSign('Sci-Fi & Fantasy', 11.4, -3.4, Math.PI / 2);
hangSign('Mystery & Gothic', -4, -2.05, Math.PI / 2);
hangSign('Big Ideas', 4, -2.05, Math.PI / 2);
hangSign('Kids’ Nook', -10.3, 6.4, Math.PI * 0.75, 2.5);   // faces the store center, not the corner
hangSign('Reading Nook', 10.3, -6.2, -Math.PI / 4, 2.6);
hangSign('New & Noteworthy', 0, 5.4, 0, 2.75);

// ---------------------------------------------------------------- lights
scene.add(new THREE.HemisphereLight(0xfff2dd, 0x3a2a1a, 0.5));
scene.add(new THREE.AmbientLight(0xffe0bd, 0.28));

const sun = new THREE.DirectionalLight(0xffb070, 1.6);
sun.position.set(-18, 7, 3); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 12, bottom: -12, near: 1, far: 45 });
scene.add(sun);

function pendant(x, z) {
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 4), M.black);
  cord.position.set(x, ROOM.h - 0.25, z); scene.add(cord);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.24, 18, 1, true),
    new THREE.MeshLambertMaterial({ color: 0x2e2018, emissive: 0x1a0f06, side: THREE.DoubleSide }));
  shade.position.set(x, ROOM.h - 0.55, z); scene.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe6b0 }));
  bulb.position.set(x, ROOM.h - 0.62, z); scene.add(bulb);
  const l = new THREE.PointLight(0xffd9a5, 30, 15, 2);
  l.position.set(x, ROOM.h - 0.7, z); scene.add(l);
}
pendant(-4.5, 2.8); pendant(4.5, 2.8); pendant(0, -1.5); pendant(-8.5, -3.5); pendant(8.5, -1);
const kidsLight = new THREE.PointLight(0xffcf9a, 10, 6, 2);
kidsLight.position.set(-10.3, 2.4, 6.4); scene.add(kidsLight);

// ---------------------------------------------------------------- audio (all synthesized, no assets)
let AC = null, ambGain = null, muted = false;
function audioInit() {
  if (AC) return;
  try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  document.addEventListener('pointerdown', () => AC && AC.state === 'suspended' && AC.resume());
  // room tone: quiet filtered brown noise
  const len = AC.sampleRate * 2;
  const buf = AC.createBuffer(1, len, AC.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
  const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300;
  ambGain = AC.createGain(); ambGain.gain.value = muted ? 0 : 0.05;
  src.connect(lp); lp.connect(ambGain); ambGain.connect(AC.destination);
  src.start();
}
function noiseBurst(dur, filterFreq, vol, type = 'lowpass', fade = 1) {
  if (!AC || muted) return;
  const n = AC.createBufferSource();
  const buf = AC.createBuffer(1, Math.ceil(AC.sampleRate * dur), AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, fade);
  n.buffer = buf;
  const f = AC.createBiquadFilter(); f.type = type; f.frequency.value = filterFreq; f.Q.value = 0.7;
  const g = AC.createGain(); g.gain.value = vol;
  n.connect(f); f.connect(g); g.connect(AC.destination); n.start();
}
const sfx = {
  pull: () => noiseBurst(0.3, 2200, 0.22, 'bandpass', 1.6),      // page-flick swish
  back: () => noiseBurst(0.22, 1400, 0.1, 'bandpass', 1.2),
  step: () => noiseBurst(0.09, 230, 0.09),
  chime() {                                                       // two-note door bell
    if (!AC || muted) return;
    [[880, 0, 0.1], [1318.5, 0.13, 0.08]].forEach(([fr, at, vol]) => {
      const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + at;
      o.frequency.value = fr;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 1.2);
    });
  },
  purr() {
    if (!AC || muted) return;
    const t = AC.currentTime, dur = 1.3;
    const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 48;
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140;
    const g = AC.createGain();
    const lfo = AC.createOscillator(); lfo.frequency.value = 23;
    const lfoG = AC.createGain(); lfoG.gain.value = 0.035;
    lfo.connect(lfoG); lfoG.connect(g.gain);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.2);
    g.gain.setValueAtTime(0.06, t + dur - 0.35);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(lp); lp.connect(g); g.connect(AC.destination);
    o.start(t); o.stop(t + dur); lfo.start(t); lfo.stop(t + dur);
  },
};

// ---------------------------------------------------------------- controls
const startEl = document.getElementById('start');
const crosshair = document.getElementById('crosshair');
const tooltip = document.getElementById('tooltip');
const hint = document.getElementById('hint');
const toast = document.getElementById('toast');
const card = document.getElementById('card');

let yaw = Math.PI, pitch = 0;      // facing the store from the door? no — start near door facing north
yaw = 0; camera.position.set(0, EYE, 7.2);
let locked = false, dragMode = false, entered = false;
const keys = {};
let toastTimer;

function showToast(msg, ms = 2600) {
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
document.getElementById('enter').addEventListener('click', () => {
  entered = true;
  startEl.classList.add('hidden');
  crosshair.style.display = 'block'; hint.style.display = 'block';
  document.getElementById('soundBtn').style.display = 'block';
  document.getElementById('favBtn').style.display = 'block';
  audioInit(); sfx.chime();
  if (IS_TOUCH) showToast('left thumb walks · right thumb looks · tap a book to pull it', 4200);
  else tryLock();
});
document.getElementById('soundBtn').addEventListener('click', e => {
  muted = !muted;
  if (ambGain && AC) ambGain.gain.setTargetAtTime(muted ? 0 : 0.05, AC.currentTime, 0.25);
  e.target.textContent = muted ? '♪ sound: off' : '♪ sound: on';
});
if (IS_TOUCH) {
  document.querySelector('#start .keys').innerHTML =
    '<span><b>left thumb</b> walk</span><span><b>right thumb</b> look</span><span><b>tap</b> pull a book</span>';
  document.getElementById('hint').innerHTML = 'left thumb walk · right thumb look · tap a book to pull it';
}

function tryLock() {
  const el = renderer.domElement;
  if (!el.requestPointerLock) { dragMode = true; showToast('Drag to look around · click a book to pull it'); return; }
  try {
    const p = el.requestPointerLock();
    if (p && p.catch) p.catch(() => { dragMode = true; showToast('Drag to look around · click a book to pull it'); });
  } catch { dragMode = true; showToast('Drag to look around · click a book to pull it'); }
}

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === renderer.domElement;
  if (!locked && entered && !dragMode && !card.classList.contains('show'))
    showToast('Mouse freed — click the store to walk again', 2200);
});

let downAt = null, dragged = false;
addEventListener('mousemove', e => {
  if (locked) { yaw -= e.movementX * 0.0023; pitch -= e.movementY * 0.0023; }
  else if (dragMode && downAt) {
    yaw -= e.movementX * 0.004; pitch -= e.movementY * 0.004;
    if (Math.abs(e.clientX - downAt.x) + Math.abs(e.clientY - downAt.y) > 6) dragged = true;
  }
  pitch = Math.max(-1.35, Math.min(1.35, pitch));
});
renderer.domElement.addEventListener('mousedown', e => { downAt = { x: e.clientX, y: e.clientY }; dragged = false; });
renderer.domElement.addEventListener('mouseup', e => {
  if (!entered || IS_TOUCH) return;   // touch devices use the tap path below
  if (locked) { interact(); }
  else if (dragMode) { if (!dragged) interact(); }
  else { tryLock(); }   // clicked while unlocked in lock mode → re-grab mouse
  downAt = null;
});

// ---- touch: left half = virtual stick, right half = look, quick tap = pull
const touchMove = { x: 0, y: 0 };
let moveTouch = null, lookTouch = null;
if (IS_TOUCH) {
  const el = renderer.domElement;
  el.style.touchAction = 'none';
  el.addEventListener('touchstart', e => {
    for (const t of e.changedTouches) {
      if (t.clientX < innerWidth / 2 && !moveTouch) moveTouch = { id: t.identifier, x: t.clientX, y: t.clientY };
      else if (!lookTouch) lookTouch = { id: t.identifier, x: t.clientX, y: t.clientY, sx: t.clientX, sy: t.clientY, at: performance.now() };
    }
    e.preventDefault();
  }, { passive: false });
  el.addEventListener('touchmove', e => {
    for (const t of e.changedTouches) {
      if (moveTouch && t.identifier === moveTouch.id) {
        touchMove.x = Math.max(-1, Math.min(1, (t.clientX - moveTouch.x) / 55));
        touchMove.y = Math.max(-1, Math.min(1, (t.clientY - moveTouch.y) / 55));
      } else if (lookTouch && t.identifier === lookTouch.id) {
        yaw -= (t.clientX - lookTouch.x) * 0.006;
        pitch = Math.max(-1.35, Math.min(1.35, pitch - (t.clientY - lookTouch.y) * 0.006));
        lookTouch.x = t.clientX; lookTouch.y = t.clientY;
      }
    }
    e.preventDefault();
  }, { passive: false });
  el.addEventListener('touchend', e => {
    for (const t of e.changedTouches) {
      if (moveTouch && t.identifier === moveTouch.id) { moveTouch = null; touchMove.x = touchMove.y = 0; }
      else if (lookTouch && t.identifier === lookTouch.id) {
        const moved = Math.hypot(t.clientX - lookTouch.sx, t.clientY - lookTouch.sy);
        if (entered && moved < 10 && performance.now() - lookTouch.at < 350)
          interact(new THREE.Vector2((t.clientX / innerWidth) * 2 - 1, -(t.clientY / innerHeight) * 2 + 1));
        lookTouch = null;
      }
    }
  });
}
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Escape') {
    if (favPanel.classList.contains('show')) favPanel.classList.remove('show');
    else if (pulled) returnBook();
  }
  if (e.code === 'KeyF' && pulled) toggleFav(cardItem);
});
addEventListener('keyup', e => keys[e.code] = false);
document.getElementById('cardClose').addEventListener('click', () => returnBook());

// ---------------------------------------------------------------- movement
const vel = new THREE.Vector2();
function movePlayer(dt) {
  const run = keys['ShiftLeft'] || keys['ShiftRight'];
  const speed = run ? 5.2 : 3.1;
  let f = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
  let s = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);
  f = Math.max(-1, Math.min(1, f - touchMove.y));
  s = Math.max(-1, Math.min(1, s + touchMove.x));
  if (keys['ArrowLeft']) yaw += dt * 1.9;
  if (keys['ArrowRight']) yaw -= dt * 1.9;
  const dirX = Math.sin(yaw) * -f + Math.cos(yaw) * s;
  const dirZ = Math.cos(yaw) * -f - Math.sin(yaw) * s;
  const len = Math.hypot(dirX, dirZ) || 1;
  vel.x += ((dirX / len) * speed * (f || s ? 1 : 0) - vel.x) * Math.min(1, dt * 9);
  vel.y += ((dirZ / len) * speed * (f || s ? 1 : 0) - vel.y) * Math.min(1, dt * 9);

  const r = 0.3;
  let nx = camera.position.x + vel.x * dt;
  let nz = camera.position.z + vel.y * dt;
  const hits = (px, pz) => colliders.some(c => px > c.x1 - r && px < c.x2 + r && pz > c.z1 - r && pz < c.z2 + r);
  if (!hits(nx, camera.position.z)) camera.position.x = nx; else vel.x = 0;
  if (!hits(camera.position.x, nz)) camera.position.z = nz; else vel.y = 0;
  camera.position.x = Math.max(-12.55, Math.min(12.55, camera.position.x));
  camera.position.z = Math.max(-8.55, Math.min(8.55, camera.position.z));
  // gentle head-bob + a footstep at each bob trough
  const moving = Math.hypot(vel.x, vel.y) > 0.4;
  const prevBob = Math.sin(bobT);
  bobT += dt * (moving ? (run ? 11 : 7.5) : 0);
  if (moving && Math.sign(Math.sin(bobT)) !== Math.sign(prevBob)) sfx.step();
  camera.position.y = EYE + (moving ? Math.sin(bobT) * 0.025 : 0);
  camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
}
let bobT = 0;

// ---------------------------------------------------------------- hover + pull
const raycaster = new THREE.Raycaster();
raycaster.far = REACH;
const CENTER = new THREE.Vector2(0, 0);
let hover = null;          // {type:'inst', bc, id} | {type:'featured', mesh} | {type:'cat'}
let pulled = null;         // active pulled book
let frame = 0;

function nearbyTargets() {
  const out = [];
  for (const bc of bookcases) {
    const dx = camera.position.x - bc.x, dz = camera.position.z - bc.z;
    if (dx * dx + dz * dz < 22) out.push(bc.inst);
  }
  for (const m of featured) if (m.position.distanceToSquared(camera.position) < 16) out.push(m);
  if (catMesh.position.distanceToSquared(camera.position) < 14) out.push(catMesh);
  return out;
}

function clearHover() {
  if (!hover) return;
  if (hover.type === 'inst') {
    hover.bc.inst.setColorAt(hover.id, hover.bc.slots[hover.id].baseColor);
    hover.bc.inst.instanceColor.needsUpdate = true;
  } else if (hover.type === 'featured') hover.mesh.material.forEach?.(m => m.emissive?.setHex(0));
  hover = null;
  crosshair.classList.remove('hot');
  tooltip.style.display = 'none';
}

const hoverCol = new THREE.Color();
function updateHover(coords = CENTER) {
  if (pulled) { clearHover(); return; }
  camera.updateMatrixWorld();
  raycaster.setFromCamera(coords, camera);
  const hits = raycaster.intersectObjects(nearbyTargets(), true);
  const hit = hits[0];
  if (!hit) { clearHover(); return; }

  const cat = !!hit.object.userData.cat;

  if (cat) {
    if (hover?.type !== 'cat') { clearHover(); hover = { type: 'cat' }; }
    crosshair.classList.add('hot');
    tooltip.innerHTML = '<b>Miso</b>, shop cat · <i>click to say hi</i>';
    tooltip.style.display = 'block';
    return;
  }
  if (hit.object.isInstancedMesh) {
    const bc = hit.object.userData.bookcase, id = hit.instanceId;
    if (bc.slots[id].pulled) { clearHover(); return; }
    if (hover?.type === 'inst' && hover.bc === bc && hover.id === id) return;
    clearHover();
    hover = { type: 'inst', bc, id };
    hoverCol.copy(bc.slots[id].baseColor).lerp(AMBER, 0.65);
    bc.inst.setColorAt(id, hoverCol);
    bc.inst.instanceColor.needsUpdate = true;
    const item = bc.slots[id].item;
    tooltip.innerHTML = `<b>${item.t}</b> · ${item.a} — <i>click to pull</i>`;
  } else {
    const mesh = hit.object;
    if (hover?.type === 'featured' && hover.mesh === mesh) return;
    clearHover();
    hover = { type: 'featured', mesh };
    mesh.material.forEach?.(m => m.emissive?.setHex(0x2a1a08));
    const item = mesh.userData.item;
    tooltip.innerHTML = `<b>${item.t}</b> · ${item.a} — <i>click to pull</i>`;
  }
  crosshair.classList.add('hot');
  tooltip.style.display = 'block';
}

function interact(coords = CENTER) {
  if (pulled) { returnBook(); return; }
  updateHover(coords);                 // re-aim synchronously so the click/tap uses the exact position
  if (!hover) return;
  if (hover.type === 'cat') { sfx.purr(); showToast('🐈 Miso purrs approvingly. Local celebrity. Does not recommend books; sits on them.'); return; }
  if (hover.type === 'inst') pullInstanced(hover.bc, hover.id);
  else pullFeatured(hover.mesh);
}

const tweens = [];
function tween(dur, fn, done) { tweens.push({ t: 0, dur, fn, done }); }
function stepTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += dt / tw.dur;
    const k = Math.min(1, tw.t);
    tw.fn(k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);   // easeInOutQuad
    if (k >= 1) { tweens.splice(i, 1); tw.done?.(); }
  }
}

const ZERO_M = new THREE.Matrix4().makeScale(0, 0, 0);
function pullInstanced(bc, id) {
  clearHover();
  const slot = bc.slots[id];
  slot.pulled = true;
  bc.inst.setMatrixAt(id, ZERO_M);
  bc.inst.instanceMatrix.needsUpdate = true;

  // build a hand-holdable copy with a proper cover
  const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), scl = new THREE.Vector3();
  slot.matrix.decompose(pos, quat, scl);
  const world = new THREE.Matrix4().compose(pos, quat, new THREE.Vector3(1, 1, 1)).premultiply(bc.group.matrixWorld);
  const wPos = new THREE.Vector3(), wQuat = new THREE.Quaternion();
  world.decompose(wPos, wQuat, new THREE.Vector3());

  const item = slot.item;
  const cover = new THREE.MeshLambertMaterial({ map: coverTexture(item) });
  const spineMat = new THREE.MeshLambertMaterial({ color: spineColor(item.t) });
  const pageMat = new THREE.MeshLambertMaterial({ color: 0xe8dcc0 });
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(scl.z * 1.15, scl.y, scl.x),           // width, height, thickness
    [pageMat, spineMat, pageMat, pageMat, cover, spineMat]);      // cover on +z
  // orient so it initially matches the shelved spine (+z cover → slot +x)
  mesh.quaternion.copy(wQuat).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)));
  mesh.position.copy(wPos);
  scene.add(mesh);

  pulled = { kind: 'inst', bc, id, mesh, item, homePos: wPos.clone(), homeQuat: mesh.quaternion.clone(), t: 0 };
  sfx.pull();
  openCard(item);
}

function pullFeatured(mesh) {
  clearHover();
  mesh.userData.pulled = true;
  pulled = { kind: 'featured', mesh, item: mesh.userData.item, homePos: mesh.userData.home.pos.clone(), homeQuat: mesh.userData.home.quat.clone(), t: 0 };
  sfx.pull();
  openCard(mesh.userData.item);
}

function returnBook() {
  if (!pulled) return;
  const p = pulled; pulled = null;
  sfx.back();
  closeCard();
  tween(0.45, k => {
    p.mesh.position.lerpVectors(p.mesh.position, p.homePos, k);
    p.mesh.quaternion.slerp(p.homeQuat, k);
  }, () => {
    if (p.kind === 'inst') {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.bc.inst.setMatrixAt(p.id, p.bc.slots[p.id].matrix);
      p.bc.inst.instanceMatrix.needsUpdate = true;
      p.bc.slots[p.id].pulled = false;
    } else {
      p.mesh.position.copy(p.homePos); p.mesh.quaternion.copy(p.homeQuat);
      p.mesh.userData.pulled = false;
    }
  });
}

function holdBook(dt) {
  if (!pulled) return;
  pulled.t = Math.min(1, pulled.t + dt * 3);
  const k = pulled.t < 0.5 ? 2 * pulled.t * pulled.t : 1 - Math.pow(-2 * pulled.t + 2, 2) / 2;
  const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const bob = Math.sin(performance.now() / 900) * 0.008;
  const target = camera.position.clone().addScaledVector(fwd, 0.52).addScaledVector(right, -0.10);
  target.y += bob - 0.03;
  const tq = camera.quaternion.clone()
    .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.06, 0.18 + Math.sin(performance.now() / 1300) * 0.03, 0.02)));
  pulled.mesh.position.lerpVectors(pulled.homePos, target, k);
  pulled.mesh.quaternion.copy(pulled.homeQuat).slerp(tq, k);
  // auto-return if you wander off
  if (camera.position.distanceTo(pulled.homePos) > 4.5) returnBook();
}

// ---------------------------------------------------------------- card UI
function openCard(item) {
  cardItem = item; syncHeart();
  document.getElementById('cardGenre').textContent = item.genre;
  document.getElementById('cardTitle').textContent = item.t;
  document.getElementById('cardAuthor').textContent = 'by ' + item.a;
  document.getElementById('cardBlurb').textContent = item.b;
  const read = document.getElementById('cardRead');
  const buy = document.getElementById('cardBuy');
  if (item.read) { read.href = item.read; read.classList.remove('disabled'); read.textContent = '📖 Read free'; }
  else { read.removeAttribute('href'); read.classList.add('disabled'); read.textContent = '📖 Coming soon'; }
  buy.href = item.buy;
  card.classList.add('show');
  tooltip.style.display = 'none';
}
function closeCard() { card.classList.remove('show'); cardItem = null; }

// ---------------------------------------------------------------- favorites
const FAV_KEY = 'parallel-shelf-favorites';
let favorites = [];
try { favorites = JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { /* private mode etc. */ }
const favBtn = document.getElementById('favBtn');
const favPanel = document.getElementById('favPanel');
const favList = document.getElementById('favList');
const cardFav = document.getElementById('cardFav');
let cardItem = null;

const isFav = t => favorites.some(f => f.t === t);
function saveFavs() {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); } catch { }
  favBtn.textContent = `♥ favorites${favorites.length ? ' · ' + favorites.length : ''}`;
}
function toggleFav(item) {
  if (!item) return;
  if (isFav(item.t)) {
    favorites = favorites.filter(f => f.t !== item.t);
  } else {
    favorites.push({ t: item.t, a: item.a, genre: item.genre, read: item.read, buy: item.buy });
    showToast(`♥ “${item.t}” saved to your favorites`);
  }
  saveFavs(); syncHeart(); renderFavs();
}
function syncHeart() {
  const on = cardItem && isFav(cardItem.t);
  cardFav.textContent = on ? '♥' : '♡';
  cardFav.classList.toggle('on', !!on);
}
function renderFavs() {
  favList.innerHTML = favorites.length ? '' :
    '<div class="favEmpty">Nothing saved yet — pull a book off a shelf and tap the ♡.</div>';
  for (const f of favorites) {
    const row = document.createElement('div');
    row.className = 'favRow';
    row.innerHTML =
      `<div class="t">${f.t}</div><div class="a">${f.a} · ${f.genre}</div>
       <div class="links">${f.read ? `<a href="${f.read}" target="_blank" rel="noopener">read</a>` : ''}
       <a href="${f.buy}" target="_blank" rel="noopener">buy</a>
       <button class="go">→ shelf</button><button class="rm" title="remove">✕</button></div>`;
    row.querySelector('.rm').addEventListener('click', () => toggleFav(f));
    row.querySelector('.go').addEventListener('click', () => goToShelf(f));
    favList.appendChild(row);
  }
}
function goToShelf(f) {
  favPanel.classList.remove('show');
  let tx, tz, tyaw;
  if (f.genre === 'Local Author') {
    tx = 2.3; tz = 7.1; tyaw = 0;                      // spotlight table, facing north
  } else {
    const bc = bookcases.find(b => b.genre === f.genre);
    if (!bc) return;
    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(bc.group.quaternion);
    tx = bc.x + dir.x * 1.8; tz = bc.z + dir.z * 1.8;
    tyaw = Math.atan2(dir.x, dir.z);                   // face the shelf
  }
  camera.position.x = tx; camera.position.z = tz; yaw = tyaw; pitch = 0;
  showToast(`This way to ${f.genre} →`);
}
saveFavs(); renderFavs();
cardFav.addEventListener('click', () => toggleFav(cardItem));
favBtn.addEventListener('click', () => { renderFavs(); favPanel.classList.toggle('show'); });
document.getElementById('favClose').addEventListener('click', () => favPanel.classList.remove('show'));

// ---------------------------------------------------------------- debug hooks (used for automated verification)
window.__psDebug = { scene, camera, THREE, renderer, getFrame: () => frame };
window.__ps = {
  enter() { document.getElementById('enter').click(); dragMode = true; },
  teleport(x, z, newYaw = yaw, newPitch = 0) {
    camera.position.x = x; camera.position.z = z; yaw = newYaw; pitch = newPitch;
    camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
    camera.updateMatrixWorld();
  },
  aimAt(x, y, z) {
    const dx = x - camera.position.x, dy = y - camera.position.y, dz = z - camera.position.z;
    yaw = Math.atan2(-dx, -dz);
    pitch = Math.atan2(dy, Math.hypot(dx, dz));
    camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
    camera.updateMatrixWorld();
  },
  featuredAt: () => featured.map(m => ({ t: m.userData.item.t, p: m.position.toArray().map(v => +v.toFixed(2)) })),
  interact, returnBook,
  state: () => ({ pos: camera.position.toArray(), yaw, hover: hover?.type ?? null, pulled: pulled?.item?.t ?? null, books: bookcases.reduce((n, b) => n + b.slots.length, 0) }),
  probe() {
    raycaster.setFromCamera(CENTER, camera);
    const targets = nearbyTargets();
    const hits = raycaster.intersectObjects(targets, true);
    return {
      entered, targets: targets.length,
      dir: new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).toArray().map(v => +v.toFixed(2)),
      hits: hits.slice(0, 3).map(h => ({ d: +h.distance.toFixed(2), inst: h.instanceId ?? null, type: h.object.type })),
    };
  },
  deepProbe() {
    const bc = bookcases.reduce((best, b) => {
      const d = (camera.position.x - b.x) ** 2 + (camera.position.z - b.z) ** 2;
      return d < best.d ? { d, b } : best;
    }, { d: 1e9, b: null }).b;
    const r = new THREE.Raycaster();               // no far limit
    r.setFromCamera(CENTER, camera);
    bc.inst.computeBoundingSphere?.();
    const bs = bc.inst.boundingSphere;
    const wp = new THREE.Vector3();
    bc.inst.getWorldPosition(wp);
    return {
      unit: { x: bc.x, z: bc.z, genre: bc.genre, count: bc.inst.count },
      instWorldPos: wp.toArray().map(v => +v.toFixed(2)),
      bs: bs ? { c: bs.center.toArray().map(v => +v.toFixed(2)), r: +bs.radius.toFixed(2) } : 'none',
      m0: Array.from(bc.inst.instanceMatrix.array.slice(12, 15)).map(v => +v.toFixed(2)),
      hitsNoFar: r.intersectObject(bc.inst, false).length,
      hitsScene: r.intersectObjects(scene.children, true).slice(0, 2).map(h => ({ d: +h.distance.toFixed(2), type: h.object.type, inst: h.instanceId ?? null })),
    };
  },
};

// ---------------------------------------------------------------- resize + loop
addEventListener('resize', () => {
  if (!innerWidth || !innerHeight) return;   // ignore degenerate hidden-tab sizes
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

scene.updateMatrixWorld(true);   // raycastable before the first render (hidden tabs render late)

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(0.05, clock.getDelta());
  if (entered) movePlayer(dt);
  if (++frame % 2 === 0 && entered) updateHover();
  holdBook(dt);
  stepTweens(dt);
  // cat breathing
  catMesh.scale.y = 1 + Math.sin(performance.now() / 700) * 0.03;
  renderer.render(scene, camera);
});
