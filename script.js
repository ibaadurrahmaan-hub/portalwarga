/* ==============================================
   PORTAL WARGA - SCRIPT (FIREBASE + GPS COVERAGE)
   Project: portalwarga-963e4
   ============================================== */

// ⭐ Nomor WA CS
const CS_WA = '6285267891619';


// ============================================
// DATA (Fallback jika Firebase belum tersambung)
// ============================================
let dataPasar = [
  { id: 1, emoji: '🥬', name: 'Sayur Bayam 1 Ikat', vendor: 'Toko Bu Tini', price: 5000 },
  { id: 2, emoji: '🍅', name: 'Tomat Merah 500gr', vendor: 'Kios Pak Amin', price: 8000 },
  { id: 3, emoji: '🥚', name: 'Telur Ayam 1 Kg', vendor: 'Peternakan Barokah', price: 28000 },
  { id: 4, emoji: '🍗', name: 'Ayam Potong 1 Ekor', vendor: 'Ayam Segar Bu Sri', price: 45000 },
  { id: 5, emoji: '🐟', name: 'Ikan Lele Segar 1 Kg', vendor: 'Pak Kadir Fresh', price: 22000 },
  { id: 6, emoji: '🍚', name: 'Beras Premium 5 Kg', vendor: 'Sembako Berkah', price: 65000 },
  { id: 7, emoji: '🧅', name: 'Bawang Merah 250gr', vendor: 'Kios Pak Amin', price: 12000 },
  { id: 8, emoji: '🌶️', name: 'Cabai Rawit 100gr', vendor: 'Toko Bu Tini', price: 15000 },
];

let dataProperty = [
  { 
    id: 1, emoji: '🏠', type: 'Kontrakan', status: 'Tersedia',
    title: 'Rumah 2 Kamar Dekat Pasar', loc: 'Ds. Sukamaju', price: 'Rp 1,2 Jt/bulan',
    features: ['2 Kamar', '1 KM', 'Carport']
  },
  { 
    id: 2, emoji: '🏡', type: 'Dijual', status: 'Nego',
    title: 'Rumah Minimalis SHM', loc: 'Ds. Cinta Damai', price: 'Rp 350 Jt',
    features: ['3 Kamar', '2 KM', 'LT 90m²']
  },
  { 
    id: 3, emoji: '🛏️', type: 'Kos Putri', status: 'Sisa 2',
    title: 'Kos Nyaman Dekat Kampus', loc: 'Ds. Mulyasari', price: 'Rp 600 Rb/bulan',
    features: ['AC', 'WiFi', 'K.Dalam']
  },
  { 
    id: 4, emoji: '🌾', type: 'Tanah Dijual', status: 'Cash',
    title: 'Tanah Datar Cocok Usaha', loc: 'Jl. Raya Kec.', price: 'Rp 500 Jt',
    features: ['200 m²', 'SHM', 'Strategis']
  },
];

let dataPendidikan = [
  { 
    id: 1, emoji: '📚', type: 'Bimbel',
    name: 'Bimbel Cerdas Bersama',
    desc: 'Bimbingan belajar SD-SMA. Metode privat & kelompok, tutor berpengalaman.'
  },
  { 
    id: 2, emoji: '🕌', type: 'TPQ / Madrasah',
    name: 'TPQ Al-Hidayah',
    desc: 'Belajar mengaji, tahfidz Al-Qur\'an, dan pendidikan akhlak untuk anak-anak.'
  },
  { 
    id: 3, emoji: '💻', type: 'Kursus Skill',
    name: 'Kursus Komputer Cepat',
    desc: 'Kursus Office, desain grafis, dan digital marketing. Sertifikat resmi.'
  },
  { 
    id: 4, emoji: '🎨', type: 'Sanggar Seni',
    name: 'Sanggar Kreasi Anak',
    desc: 'Kelas melukis, menari, dan musik untuk anak usia dini hingga remaja.'
  },
];


// ============================================
// WIFI: DATA PAKET YOUFIBER REGYNET
// ============================================
let dataWifi = [
  { 
    id: 1, name: 'Ekonomis', speed: '10', price: '130.000',
    features: ['Unlimited Tanpa FUP', 'Bayar Bulanan Flat', 'Gratis Sewa Modem', 'CS 24 Jam'],
    popular: false
  },
  { 
    id: 2, name: 'Basic', speed: '15', price: '165.000',
    features: ['Unlimited Tanpa FUP', 'Gratis Biaya Perbaikan', 'Gratis Sewa Modem', 'CS 24 Jam'],
    popular: true
  },
  { 
    id: 3, name: 'Advanced', speed: '30', price: '220.000',
    features: ['Unlimited Tanpa FUP', 'Gratis Biaya Perbaikan', 'Gratis Sewa Modem', 'CS 24 Jam'],
    popular: false
  },
  { 
    id: 4, name: 'Extra', speed: '50', price: '330.000',
    features: ['Unlimited Tanpa FUP', 'Gratis Biaya Perbaikan', 'Gratis Sewa Modem', 'CS 24 Jam'],
    popular: false
  },
  { 
    id: 5, name: 'Premiere', speed: '100', price: '550.000',
    features: ['Unlimited Tanpa FUP', 'Gratis Biaya Perbaikan', 'Gratis Sewa Modem', 'CS Prioritas'],
    popular: false
  },
  { 
    id: 6, name: 'Promo Cijeruk', speed: '100', price: '120.000',
    features: ['Khusus Kec. Cijeruk', 'Unlimited Tanpa FUP', 'Gratis Sewa Modem', 'Harga Super Hemat'],
    popular: true
  }
];


// ============================================
// WIFI: DATA WILAYAH COVERAGE + KOORDINAT
// ============================================
const WIFI_WILAYAH = [
  {
    id: 'A',
    nama: 'Wilayah A',
    lat: -6.07185544,
    lng: 107.02091269,
    radiusKm: 1,
    paket: [
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 }
    ]
  },
  {
    id: 'B',
    nama: 'Wilayah B',
    lat: -6.0941028,
    lng: 107.0514062,
    radiusKm: 2,
    paket: [
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 }
    ]
  },
  {
    id: 'C',
    nama: 'Wilayah C',
    lat: -6.0929032,
    lng: 107.18109175,
    radiusKm: 2,
    paket: [
      { name: 'Ekonomis 10 Mbps', speed: 10, price: 130000 },
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 }
    ]
  },
  {
    id: 'D',
    nama: 'Wilayah D',
    lat: -6.24266427,
    lng: 107.09106332,
    radiusKm: 2,
    paket: [
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 }
    ]
  },
  {
    id: 'E',
    nama: 'Wilayah E',
    lat: -6.090539,
    lng: 107.209343,
    radiusKm: 3,
    paket: [
      { name: 'Ekonomis 10 Mbps', speed: 10, price: 120000 },
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 }
    ]
  },
  {
    id: 'F',
    nama: 'Wilayah F',
    lat: -6.230931,
    lng: 107.089664,
    radiusKm: 3,
    paket: [
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 }
    ]
  },
  {
    id: 'G',
    nama: 'Kec. Cijeruk, Bogor',
    lat: -6.715114999,
    lng: 106.793385,
    radiusKm: 4,
    paket: [
      { name: 'PROMO Cijeruk 100 Mbps', speed: 100, price: 120000 }
    ]
  }
];


// ============================================
// RENDER GRID PASAR
// ============================================
function renderPasar() {
  const grid = document.getElementById('pasarGrid');
  if (!grid) return;
  grid.innerHTML = dataPasar.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-vendor">${p.vendor}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
        <button class="btn-add" onclick="addToCart(${p.id})">
          <i class="fas fa-plus"></i> Tambah
        </button>
      </div>
    </div>
  `).join('');
}


// ============================================
// RENDER GRID PROPERTY
// ============================================
function renderProperty() {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;
  grid.innerHTML = dataProperty.map(p => `
    <div class="property-card">
      <div class="property-img">
        ${p.emoji}
        <span class="property-status">${p.status}</span>
      </div>
      <div class="property-info">
        <div class="property-type">${p.type}</div>
        <div class="property-title">${p.title}</div>
        <div class="property-loc"><i class="fas fa-map-marker-alt"></i> ${p.loc}</div>
        <div class="property-price">${p.price}</div>
        <div class="property-features">
          ${p.features.map(f => `<span><i class="fas fa-check-circle"></i>${f}</span>`).join('')}
        </div>
        <a href="https://wa.me/${CS_WA}?text=${encodeURIComponent(`Halo CS, saya tertarik dengan ${p.type}: "${p.title}" (${p.loc}) - ${p.price}. Mohon info lebih lanjut.`)}" 
           target="_blank" class="btn-property">
          <i class="fab fa-whatsapp"></i> Tanya CS
        </a>
      </div>
    </div>
  `).join('');
}


// ============================================
// RENDER GRID PENDIDIKAN
// ============================================
function renderEdu() {
  const grid = document.getElementById('eduGrid');
  if (!grid) return;
  grid.innerHTML = dataPendidikan.map(e => `
    <div class="edu-card">
      <div class="edu-icon">${e.emoji}</div>
      <div class="edu-info">
        <div class="edu-type">${e.type}</div>
        <div class="edu-name">${e.name}</div>
        <div class="edu-desc">${e.desc}</div>
        <a href="https://wa.me/${CS_WA}?text=${encodeURIComponent(`Halo CS, saya ingin daftar / info lebih lanjut mengenai ${e.type}: "${e.name}".`)}" 
           target="_blank" class="btn-edu">
          <i class="fab fa-whatsapp"></i> Daftar / Info
        </a>
      </div>
    </div>
  `).join('');
}


// ============================================
// RENDER GRID WIFI
// ============================================
function renderWifi() {
  const grid = document.getElementById('wifiGrid');
  if (!grid) return;
  grid.innerHTML = dataWifi.map(w => `
    <div class="wifi-card ${w.popular ? 'popular' : ''}">
      <div class="wifi-name">Paket ${w.name}</div>
      <div class="wifi-speed">${w.speed}</div>
      <div class="wifi-unit">Mbps</div>
      <div class="wifi-price">Rp ${w.price} <small>/bulan</small></div>
      <ul class="wifi-list">
        ${w.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}


// ============================================
// NAVIGASI KATEGORI
// ============================================
function showCategory(cat) {
  document.querySelectorAll('.cat-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`cat-${cat}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.desktop-nav .d-nav-item').forEach(m => m.classList.remove('active'));
  const dTarget = document.querySelector(`.desktop-nav .d-nav-item[onclick*="'${cat}'"]`);
  if (dTarget) dTarget.classList.add('active');

  document.querySelectorAll('.mobile-bottom-nav .m-nav-item').forEach(m => m.classList.remove('active'));
  const mTarget = document.querySelector(`.mobile-bottom-nav .m-nav-item[data-target="${cat}"]`);
  if (mTarget) mTarget.classList.add('active');

  document.querySelectorAll('.menu-card').forEach(m => m.classList.remove('active'));
  const menuCard = document.querySelector('.menu-' + cat);
  if (menuCard) menuCard.classList.add('active');

  const offset = window.innerWidth > 768 ? 100 : 120;
  const targetEl = document.getElementById('contentArea');
  if (targetEl) {
    const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
}


// ============================================
// CART SYSTEM
// ============================================
let cart = [];

function addToCart(id) {
  const product = dataPasar.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`✓ ${product.name} ditambahkan!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);

  const badgeEl = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  if (badgeEl) badgeEl.textContent = totalItems;
  if (totalEl) totalEl.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');

  const cartBody = document.getElementById('cartBody');
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-basket"></i>
        <p>Keranjang belanja masih kosong</p>
      </div>
    `;
    return;
  }

  cartBody.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-img">${c.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-vendor">${c.vendor}</div>
        <div class="cart-item-price">Rp ${(c.price * c.qty).toLocaleString('id-ID')}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id})" title="Hapus">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}


// ============================================
// CART DRAWER
// ============================================
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.classList.add('cart-open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.classList.remove('cart-open');
  document.body.style.overflow = 'auto';
}


// ============================================
// CHECKOUT VIA WA
// ============================================
function checkoutWA() {
  if (cart.length === 0) {
    showToast('⚠️ Keranjang masih kosong!');
    return;
  }

  const total = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);

  if (typeof recordOrder === 'function') {
    recordOrder(cart, total);
  }

  let msg = `*🛒 PESANAN BARU - PortalWarga*\n\n`;
  msg += `Halo CS, saya ingin memesan:\n\n`;

  cart.forEach((c, i) => {
    msg += `${i + 1}. ${c.name}\n`;
    msg += `   Toko: ${c.vendor}\n`;
    msg += `   ${c.qty} x Rp ${c.price.toLocaleString('id-ID')} = *Rp ${(c.price * c.qty).toLocaleString('id-ID')}*\n\n`;
  });

  msg += `━━━━━━━━━━━━━\n`;
  msg += `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n`;
  msg += `_(Belum termasuk ongkir)_\n\n`;
  msg += `📍 Alamat: _(mohon dikirim setelah ini)_\n`;
  msg += `Terima kasih! 🙏`;

  const url = `https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}


// ============================================
// WIFI: FUNGSI HAVERSINE (Jarak km)
// ============================================
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// ============================================
// WIFI: CARI COVERAGE
// ============================================
function findCoverage(userLat, userLng) {
  const hits = [];
  WIFI_WILAYAH.forEach(w => {
    const d = distanceKm(userLat, userLng, w.lat, w.lng);
    if (d <= w.radiusKm) {
      hits.push({ ...w, jarak: d });
    }
  });
  hits.sort((a, b) => a.jarak - b.jarak);
  return hits;
}


// ============================================
// WIFI: STATE + STATUS
// ============================================
let lastUserLat = null;
let lastUserLng = null;
let lastCoverageHits = [];

function setLocStatus(msg, type) {
  const el = document.getElementById('locStatus');
  if (!el) return;
  el.style.display = 'block';
  el.className = type;
  el.innerHTML = msg;
}


// ============================================
// WIFI: SHARE LOCATION
// ============================================
function shareLocationWifi() {
  const btn = document.getElementById('btnShareLoc');
  if (!navigator.geolocation) {
    setLocStatus('❌ Browser tidak mendukung GPS. Silakan isi form manual di bawah.', 'err');
    showManualWifiForm();
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengambil lokasi...';
  setLocStatus('📍 Meminta izin lokasi... Mohon <b>izinkan akses GPS</b> di browser Anda.', 'load');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lastUserLat = pos.coords.latitude;
      lastUserLng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy);

      document.getElementById('wifiLat').value = lastUserLat;
      document.getElementById('wifiLng').value = lastUserLng;

      setLocStatus(
        `✅ Lokasi berhasil didapat (akurasi ±${acc}m)<br>
         <small style="font-weight:500;opacity:0.85">Lat: ${lastUserLat.toFixed(6)}, Lng: ${lastUserLng.toFixed(6)}</small>`,
        'ok'
      );

      lastCoverageHits = findCoverage(lastUserLat, lastUserLng);
      renderCoverageResult(lastCoverageHits);

      document.getElementById('wifiForm').style.display = 'block';
      fillPaketOptions(lastCoverageHits);

      if (lastCoverageHits.length > 0) {
        const best = lastCoverageHits[0];
        document.getElementById('wifiWilayahDetected').value = best.nama;
        document.getElementById('wifiJarak').value = best.jarak.toFixed(2) + ' km';
      } else {
        document.getElementById('wifiWilayahDetected').value = 'Di luar coverage terdaftar';
        document.getElementById('wifiJarak').value = '-';
      }

      reverseGeocode(lastUserLat, lastUserLng);

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sync-alt"></i> Perbarui Lokasi';
    },
    (err) => {
      let msg = '❌ Gagal ambil lokasi. ';
      if (err.code === 1) msg += 'Izin ditolak. Aktifkan GPS / izinkan lokasi di browser & coba lagi.';
      else if (err.code === 2) msg += 'Lokasi tidak tersedia. Coba di area terbuka.';
      else if (err.code === 3) msg += 'Timeout. Silakan coba lagi.';
      else msg += err.message;

      setLocStatus(msg, 'err');
      showManualWifiForm();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-location-arrow"></i> Coba Bagikan Lokasi Lagi';
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}


// ============================================
// WIFI: RENDER HASIL COVERAGE
// ============================================
function renderCoverageResult(hits) {
  const box = document.getElementById('coverageResult');
  if (!box) return;
  box.style.display = 'block';

  if (!hits.length) {
    box.innerHTML = `
      <div class="coverage-empty">
        <i class="fas fa-exclamation-triangle"></i>
        <b>Lokasi Anda di luar radius coverage terdaftar.</b><br>
        Tetap isi form di bawah — CS akan cek manual ketersediaan jaringan di area Anda.
      </div>`;
    return;
  }

  box.innerHTML = `
    <div style="font-size:0.88rem;color:var(--muted);margin-bottom:10px;font-weight:600">
      <i class="fas fa-check-circle" style="color:#059669"></i> 
      Ditemukan <b style="color:var(--pasar)">${hits.length}</b> wilayah coverage:
    </div>
    ${hits.map(h => `
      <div class="coverage-card">
        <h4>
          <i class="fas fa-broadcast-tower" style="color:var(--primary)"></i>
          ${h.nama}
          <span style="font-size:0.72rem;font-weight:600;color:var(--muted);margin-left:auto">
            ±${h.jarak.toFixed(2)} km
          </span>
        </h4>
        <div class="coverage-meta">
          <i class="fas fa-circle-notch"></i> Coverage radius: <b>${h.radiusKm} km</b> · 
          ISP: <b>Youfiber by REGYNET</b>
        </div>
        <div class="coverage-paket">
          ${h.paket.map(p => `
            <span>${p.speed} Mbps — Rp ${p.price.toLocaleString('id-ID')}/bln</span>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
}


// ============================================
// WIFI: ISI DROPDOWN PAKET
// ============================================
function fillPaketOptions(hits) {
  const sel = document.getElementById('wifiPaket');
  if (!sel) return;

  const map = new Map();
  if (hits.length) {
    hits.forEach(h => {
      h.paket.forEach(p => {
        const key = p.name + '|' + p.price;
        if (!map.has(key)) map.set(key, p);
      });
    });
  } else {
    [
      { name: 'Ekonomis 10 Mbps', speed: 10, price: 130000 },
      { name: 'Basic 15 Mbps', speed: 15, price: 165000 },
      { name: 'Advanced 30 Mbps', speed: 30, price: 220000 },
      { name: 'Extra 50 Mbps', speed: 50, price: 330000 },
      { name: 'Premiere 100 Mbps', speed: 100, price: 550000 },
      { name: 'PROMO Cijeruk 100 Mbps', speed: 100, price: 120000 }
    ].forEach(p => map.set(p.name, p));
  }

  sel.innerHTML = '<option value="">-- Pilih Paket --</option>' +
    [...map.values()].map(p =>
      `<option value="${p.name} - Rp ${p.price.toLocaleString('id-ID')}">
        ${p.name} — Rp ${p.price.toLocaleString('id-ID')}/bulan
      </option>`
    ).join('');
}


// ============================================
// WIFI: MANUAL FORM
// ============================================
function showManualWifiForm() {
  const form = document.getElementById('wifiForm');
  if (form) form.style.display = 'block';
  fillPaketOptions([]);
  const wilayahEl = document.getElementById('wifiWilayahDetected');
  if (wilayahEl) wilayahEl.value = 'Manual (tanpa GPS)';
}


// ============================================
// WIFI: REVERSE GEOCODE (OpenStreetMap)
// ============================================
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'id' }
    });
    const data = await res.json();
    if (data && data.display_name) {
      const alamatEl = document.getElementById('wifiAlamat');
      if (alamatEl && !alamatEl.value) {
        alamatEl.value = data.display_name;
      }
    }
  } catch (e) {
    console.warn('Reverse geocode gagal:', e);
  }
}


// ============================================
// WIFI: SUBMIT FORM COVERAGE
// ============================================
function submitWifiCoverage(e) {
  e.preventDefault();

  const nama = document.getElementById('wifiNama').value.trim();
  const wa = document.getElementById('wifiWa').value.trim();
  const alamat = document.getElementById('wifiAlamat').value.trim();
  const paket = document.getElementById('wifiPaket').value;
  const wilayah = document.getElementById('wifiWilayahDetected').value || '-';
  const jarak = document.getElementById('wifiJarak').value || '-';
  const lat = document.getElementById('wifiLat').value || '-';
  const lng = document.getElementById('wifiLng').value || '-';

  if (!nama || !wa || !alamat || !paket) {
    showToast('⚠️ Lengkapi semua data terlebih dahulu!');
    return;
  }

  if (typeof recordWifiRegistration === 'function') {
    recordWifiRegistration(
      nama,
      wa,
      `[${wilayah} | ${jarak}] ${alamat} | GPS: ${lat},${lng}`,
      paket
    );
  } else if (typeof db !== 'undefined') {
    db.collection('pendaftaran_wifi').add({
      nama, whatsapp: wa, alamat, paket, wilayah, jarak,
      lat: lat !== '-' ? Number(lat) : null,
      lng: lng !== '-' ? Number(lng) : null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(console.warn);
  }

  const mapsLink = (lat !== '-' && lng !== '-')
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : '-';

  let msg = `*📡 CEK LOKASI + DAFTAR YOUFIBER REGYNET*\n\n`;
  msg += `👤 *Nama:* ${nama}\n`;
  msg += `📱 *WhatsApp:* ${wa}\n\n`;
  msg += `🗺️ *Wilayah terdeteksi:* ${wilayah}\n`;
  msg += `📏 *Jarak ke titik pusat:* ${jarak}\n`;
  msg += `📦 *Paket dipilih:* ${paket}\n\n`;
  msg += `📍 *Alamat:*\n${alamat}\n\n`;
  msg += `📌 *Pin GPS:*\n${mapsLink}\n`;
  msg += `_Koordinat: ${lat}, ${lng}_\n\n`;
  msg += `Mohon dicek coverage & dijadwalkan survei. Terima kasih! 🙏`;

  const url = `https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  showToast('✓ Data + pin lokasi dikirim ke CS!');
  e.target.reset();

  setTimeout(() => {
    document.getElementById('wifiForm').style.display = 'none';
    document.getElementById('coverageResult').style.display = 'none';
    document.getElementById('locStatus').style.display = 'none';
    const btn = document.getElementById('btnShareLoc');
    if (btn) btn.innerHTML = '<i class="fas fa-location-arrow"></i> Bagikan Lokasi Saya';
  }, 3000);
}


// ============================================
// LEGACY submitWifi (backward compat)
// ============================================
function submitWifi(e) {
  return submitWifiCoverage(e);
}


// ============================================
// TOAST NOTIF
// ============================================
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}


// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderPasar();
  renderProperty();
  renderEdu();
  renderWifi();
  updateCartUI();

  const defaultMenu = document.querySelector('.menu-pasar');
  if (defaultMenu) defaultMenu.classList.add('active');
});