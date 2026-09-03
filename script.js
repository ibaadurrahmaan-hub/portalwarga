/* ==========================================================================
   PORTALWARGA - SCRIPT CORE v3.2 (ROBUST LIVE SYNC + FULL FALLBACK)
   ========================================================================== */

const CS_WA = '6285267891619';

// ============================================
// STATE MANAGER (LIVE CONTAINERS)
// ============================================
let liveProducts = [];
let liveSellers = [];
let liveReviews = [];
let livePayments = [];
let liveProperties = [];
let liveEducations = [];
let liveWifiPackages = [];
let liveWifiCoverage = [];
let liveWifiVouchers = [];

let activeSubKategori = 'all';
let searchQuery = '';

// ============================================
// DATA FALLBACKS (LENGKAP — JIKA FIREBASE OFFLINE)
// ============================================
let dataPasarFallback = [
  { id: 1, emoji: '🥬', nama: 'Sayur Bayam Segar', sellerName: 'Toko Bu Tini', harga: 5000, hargaCoret: 7000, diskon: 28, subKategori: 'sayur', deskripsi: 'Bayam segar dipetik pagi.', stok: 25, berat: 250, satuan: 'ikat', terjual: 156, rating: 4.9, totalReview: 45, tags: ['fresh', 'organik'], aktif: true },
  { id: 2, emoji: '🍅', nama: 'Tomat Merah', sellerName: 'Kios Pak Amin', harga: 8000, subKategori: 'sayur', deskripsi: 'Tomat merah matang.', stok: 40, berat: 500, satuan: '500gr', terjual: 89, rating: 4.7, totalReview: 23, tags: ['fresh'], aktif: true },
  { id: 3, emoji: '🥚', nama: 'Telur Ayam 1 Kg', sellerName: 'Peternakan Barokah', harga: 28000, hargaCoret: 30000, diskon: 7, subKategori: 'protein', deskripsi: 'Telur ayam negeri grade A.', stok: 100, berat: 1000, satuan: 'kg', terjual: 456, rating: 4.9, totalReview: 123, tags: ['fresh', 'protein'], aktif: true },
  { id: 4, emoji: '🍗', nama: 'Ayam Potong 1 Ekor', sellerName: 'Ayam Segar Bu Sri', harga: 45000, hargaCoret: 50000, diskon: 10, subKategori: 'protein', deskripsi: 'Ayam potong segar dadakan.', stok: 15, berat: 1000, satuan: 'ekor', terjual: 267, rating: 4.9, totalReview: 145, tags: ['fresh'], aktif: true },
  { id: 5, emoji: '🐟', nama: 'Ikan Lele Segar 1 Kg', sellerName: 'Pak Kadir Fresh', harga: 22000, subKategori: 'ikan', deskripsi: 'Ikan lele segar tambak.', stok: 20, berat: 1000, satuan: 'kg', terjual: 145, rating: 4.7, totalReview: 45, tags: ['ikan'], aktif: true },
  { id: 6, emoji: '🍚', nama: 'Beras Premium 5 Kg', sellerName: 'Sembako Berkah', harga: 65000, hargaCoret: 72000, diskon: 10, subKategori: 'sembako', deskripsi: 'Beras premium pulen.', stok: 30, berat: 5000, satuan: '5kg', terjual: 178, rating: 4.7, totalReview: 89, tags: ['premium'], aktif: true },
  { id: 7, emoji: '🧅', nama: 'Bawang Merah', sellerName: 'Kios Pak Amin', harga: 12000, subKategori: 'bumbu', deskripsi: 'Bawang merah lokal.', stok: 50, berat: 250, satuan: '250gr', terjual: 145, rating: 4.6, totalReview: 34, tags: ['bumbu'], aktif: true },
  { id: 8, emoji: '🌶️', nama: 'Cabai Rawit', sellerName: 'Toko Bu Tini', harga: 15000, hargaCoret: 18000, diskon: 17, subKategori: 'bumbu', deskripsi: 'Cabai rawit pedas.', stok: 15, berat: 100, satuan: '100gr', terjual: 89, rating: 4.8, totalReview: 32, tags: ['pedas'], aktif: true },
  { id: 9, emoji: '🥬', nama: 'Kangkung Segar', sellerName: 'Toko Bu Tini', harga: 4000, subKategori: 'sayur', deskripsi: 'Kangkung darat segar.', stok: 30, berat: 300, satuan: 'ikat', terjual: 234, rating: 4.9, totalReview: 67, tags: ['fresh'], aktif: true },
  { id: 10, emoji: '🫒', nama: 'Minyak Goreng 2L', sellerName: 'Sembako Berkah', harga: 32000, subKategori: 'sembako', deskripsi: 'Minyak goreng kelapa.', stok: 45, berat: 2000, satuan: '2 liter', terjual: 234, rating: 4.6, totalReview: 45, tags: ['sembako'], aktif: true }
];

let dataPropertyFallback = [
  { id: 'prop_01', emoji: '🏠', type: 'Kontrakan', status: 'Tersedia', title: 'Rumah 2 Kamar Dekat Pasar', loc: 'Ds. Sukamaju', price: 'Rp 1,2 Jt/bulan', features: ['2 Kamar', '1 KM', 'Carport'], pemilik: 'Bu Aminah', kontakPemilik: '081234567801', aktif: true },
  { id: 'prop_02', emoji: '🏡', type: 'Dijual', status: 'Nego', title: 'Rumah Minimalis SHM', loc: 'Ds. Cinta Damai', price: 'Rp 350 Jt', features: ['3 Kamar', '2 KM', 'LT 90m²'], pemilik: 'Pak Hendra', kontakPemilik: '081234567802', aktif: true },
  { id: 'prop_03', emoji: '🛏️', type: 'Kos Putri', status: 'Sisa 2', title: 'Kos Nyaman Dekat Kampus', loc: 'Ds. Mulyasari', price: 'Rp 600 Rb/bulan', features: ['AC', 'WiFi', 'K.Dalam'], pemilik: 'Bu Yanti', kontakPemilik: '081234567803', aktif: true },
  { id: 'prop_04', emoji: '🌾', type: 'Tanah Dijual', status: 'Cash', title: 'Tanah Datar Cocok Usaha', loc: 'Jl. Raya Kec.', price: 'Rp 500 Jt', features: ['200 m²', 'SHM', 'Strategis'], pemilik: 'Pak Rudi', kontakPemilik: '081234567804', aktif: true },
  { id: 'prop_05', emoji: '🏘️', type: 'Kontrakan', status: 'Tersedia', title: 'Rumah 3 Kamar Halaman Luas', loc: 'Ds. Sejahtera', price: 'Rp 1,8 Jt/bulan', features: ['3 Kamar', '2 KM', 'Halaman'], pemilik: 'Pak Yusuf', kontakPemilik: '081234567805', aktif: true },
  { id: 'prop_06', emoji: '🏬', type: 'Kos Putra', status: 'Sisa 3', title: 'Kos Pria Ekonomis', loc: 'Ds. Mulyasari', price: 'Rp 450 Rb/bulan', features: ['Kasur', 'WiFi', 'Dapur'], pemilik: 'Pak Danu', kontakPemilik: '081234567806', aktif: true }
];

let dataPendidikanFallback = [
  { id: 'edu_01', emoji: '📚', type: 'Bimbel', name: 'Bimbel Cerdas Bersama', desc: 'Bimbingan belajar SD-SMA. Tutor berpengalaman.', biaya: 'Mulai Rp 250 Rb/bulan', jadwal: 'Senin - Sabtu', kontak: '081234567810', aktif: true },
  { id: 'edu_02', emoji: '🕌', type: 'TPQ / Madrasah', name: 'TPQ Al-Hidayah', desc: 'Belajar mengaji, tahfidz, dan akhlak untuk anak.', biaya: 'Rp 75 Rb/bulan', jadwal: 'Setiap hari ba\'da Ashar', kontak: '081234567811', aktif: true },
  { id: 'edu_03', emoji: '💻', type: 'Kursus Skill', name: 'Kursus Komputer Cepat', desc: 'Office, desain grafis, digital marketing. Bersertifikat.', biaya: 'Rp 500 Rb - 1,5 Jt', jadwal: 'Flexible', kontak: '081234567812', aktif: true },
  { id: 'edu_04', emoji: '🎨', type: 'Sanggar Seni', name: 'Sanggar Kreasi Anak', desc: 'Melukis, menari, musik untuk anak & remaja.', biaya: 'Rp 150 Rb/bulan', jadwal: 'Sabtu - Minggu', kontak: '081234567813', aktif: true },
  { id: 'edu_05', emoji: '⚽', type: 'SSB', name: 'SSB Kec. Utama', desc: 'Sekolah sepak bola usia 6-15 tahun.', biaya: 'Rp 100 Rb/bulan', jadwal: 'Selasa, Kamis, Sabtu', kontak: '081234567814', aktif: true },
  { id: 'edu_06', emoji: '🗣️', type: 'Kursus Bahasa', name: 'English Corner', desc: 'Bahasa Inggris kids, teens, professional.', biaya: 'Rp 350 Rb/bulan', jadwal: 'Senin - Jumat', kontak: '081234567815', aktif: true }
];

let dataWifiFallback = [
  { id: 1, name: 'Ekonomis', speed: '10', price: '130.000', features: ['Unlimited Tanpa FUP', 'Gratis Modem', 'CS 24 Jam'], popular: false, aktif: true },
  { id: 2, name: 'Basic', speed: '15', price: '165.000', features: ['Unlimited Tanpa FUP', 'Gratis Modem', 'Gratis Kabel'], popular: true, aktif: true },
  { id: 3, name: 'Advanced', speed: '30', price: '220.000', features: ['Unlimited Tanpa FUP', 'Modem Dual-Band', 'Prioritas'], popular: false, aktif: true },
  { id: 4, name: 'Extra', speed: '50', price: '330.000', features: ['Unlimited Tanpa FUP', 'Modem Dual-Band', 'Stabil'], popular: false, aktif: true },
  { id: 5, name: 'Premiere', speed: '100', price: '550.000', features: ['100 Mbps', 'Wifi 6', 'CS VIP'], popular: false, aktif: true },
  { id: 6, name: 'Promo Cijeruk', speed: '100', price: '120.000', features: ['Khusus Cijeruk', '100 Mbps', 'Gratis Modem'], popular: true, aktif: true }
];

let dataWifiCoverageFallback = [
  { id: 'A', nama: 'Wilayah Radar A', lat: -6.07185544, lng: 107.02091269, radiusKm: 1, paket: [{ name: 'Basic 15 Mbps', speed: 15, price: 165000 }, { name: 'Advanced 30 Mbps', speed: 30, price: 220000 }] },
  { id: 'G', nama: 'Kec. Cijeruk, Bogor', lat: -6.715115, lng: 106.793385, radiusKm: 4, paket: [{ name: 'PROMO Cijeruk 100 Mbps', speed: 100, price: 120000 }] }
];

let dataWifiVouchersFallback = [
  { id: 'v_1',  hari: 1,  hargaAgen: 2500,  hargaUser: 3000,  persen: 17, aktif: true },
  { id: 'v_4',  hari: 4,  hargaAgen: 8500,  hargaUser: 10000, persen: 15, aktif: true },
  { id: 'v_7',  hari: 7,  hargaAgen: 17000, hargaUser: 20000, persen: 15, aktif: true },
  { id: 'v_15', hari: 15, hargaAgen: 31000, hargaUser: 35000, persen: 11, aktif: true },
  { id: 'v_30', hari: 30, hargaAgen: 45000, hargaUser: 50000, persen: 10, aktif: true }
];

// ============================================
// INITIALIZATION FIRESTORE LIVE SYNC ENGINE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  initLiveDatabase();
  updateCartUI();

  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get('openCart') === '1') {
    setTimeout(() => openCart(), 500);
  }
});

function initLiveDatabase() {
  if (typeof db === 'undefined' || db === null) {
    console.warn("⚠️ Firebase Offline. Menggunakan data lokal fallback.");
    liveProducts = [...dataPasarFallback];
    liveProperties = [...dataPropertyFallback];
    liveEducations = [...dataPendidikanFallback];
    liveWifiPackages = [...dataWifiFallback];
    liveWifiCoverage = [...dataWifiCoverageFallback];
    liveWifiVouchers = [...dataWifiVouchersFallback];
    renderAll();
    return;
  }

  console.log("🔥 Firebase terhubung. Mulai live sync...");

  function liveCollection(name, onData, onEmptyFallback) {
    db.collection(name).where('aktif', '==', true).onSnapshot(snapshot => {
      if (!snapshot.empty) {
        onData(snapshot);
      } else {
        db.collection(name).onSnapshot(snap2 => {
          if (!snap2.empty) onData(snap2);
          else if (onEmptyFallback) onEmptyFallback();
        }, () => { if (onEmptyFallback) onEmptyFallback(); });
      }
    }, err => {
      console.warn(`⚠️ Sync ${name} gagal:`, err.message);
      db.collection(name).onSnapshot(snap2 => {
        if (!snap2.empty) onData(snap2);
        else if (onEmptyFallback) onEmptyFallback();
      }, () => { if (onEmptyFallback) onEmptyFallback(); });
    });
  }

  liveCollection('produk', snapshot => {
    liveProducts = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    const el = document.getElementById('statProducts');
    if (el) el.textContent = liveProducts.length;
    renderPasarStorefront();
  }, () => {
    liveProducts = [...dataPasarFallback];
    renderPasarStorefront();
  });

  db.collection('sellers').onSnapshot(snapshot => {
    liveSellers = snapshot.docs.map(doc => doc.data());
    const el = document.getElementById('statSellers');
    if (el) el.textContent = liveSellers.length || 6;
  }, () => {});

  liveCollection('payment_methods', snapshot => {
    livePayments = snapshot.docs.map(doc => doc.data());
    populatePaymentMethods();
  }, () => populatePaymentMethods());

  db.collection('reviews').onSnapshot(snapshot => {
    liveReviews = snapshot.docs.map(doc => doc.data());
  }, () => {});

  liveCollection('properti', snapshot => {
    liveProperties = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    renderProperty();
  }, () => {
    liveProperties = [...dataPropertyFallback];
    renderProperty();
  });

  liveCollection('pendidikan', snapshot => {
    liveEducations = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    renderEdu();
  }, () => {
    liveEducations = [...dataPendidikanFallback];
    renderEdu();
  });

  liveCollection('wifi_packages', snapshot => {
    liveWifiPackages = snapshot.docs.map(doc => doc.data());
    renderWifi();
  }, () => {
    liveWifiPackages = [...dataWifiFallback];
    renderWifi();
  });

  db.collection('wifi_coverage').onSnapshot(snapshot => {
    liveWifiCoverage = snapshot.docs.map(doc => doc.data());
    if (liveWifiCoverage.length === 0) liveWifiCoverage = [...dataWifiCoverageFallback];
  }, () => {
    liveWifiCoverage = [...dataWifiCoverageFallback];
  });

  liveCollection('wifi_vouchers', snapshot => {
    liveWifiVouchers = snapshot.docs.map(doc => doc.data());
    liveWifiVouchers.sort((a, b) => a.hari - b.hari);
    renderWifiVouchers();
  }, () => {
    liveWifiVouchers = [...dataWifiVouchersFallback];
    renderWifiVouchers();
  });
}

function renderAll() {
  renderPasarStorefront();
  renderProperty();
  renderEdu();
  renderWifi();
  renderWifiVouchers();
}

function openProductDetails(id) {
  if (!id) return;
  window.location.href = `product.html?id=${id}`;
}

// ============================================
// PASAR RENDER ENGINE
// ============================================
function renderPasarStorefront() {
  const grid = document.getElementById('pasarGrid');
  if (!grid) return;

  let filtered = liveProducts.filter(item => {
    const matchKategori = (activeSubKategori === 'all' || item.subKategori === activeSubKategori);
    const textQuery = searchQuery.toLowerCase();
    const matchSearch = item.nama.toLowerCase().includes(textQuery) || 
                        (item.sellerName && item.sellerName.toLowerCase().includes(textQuery)) ||
                        (item.tags && item.tags.some(t => t.toLowerCase().includes(textQuery)));
    return matchKategori && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px 0;">
        <span style="font-size:3rem">🥕</span>
        <h4 style="margin-top:10px; color:var(--dark)">Produk tidak ditemukan</h4>
        <p style="color:var(--muted); font-size:0.85rem">Coba ubah kata kunci atau sub-kategori lain.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const originalPrice = p.hargaCoret ? `<span class="strike-price">Rp ${p.hargaCoret.toLocaleString('id-ID')}</span>` : '';
    const discLabel = p.diskon ? `<span class="disc-pill">-${p.diskon}%</span>` : '';
    
    return `
      <div class="product-card">
        <div class="product-img" onclick="openProductDetails(${p.id})">
          ${p.emoji}
          ${discLabel}
        </div>
        <div class="product-info">
          <div class="product-vendor"><i class="fas fa-store"></i> ${p.sellerName || 'Mitra UMKM'}</div>
          <div class="product-name" onclick="openProductDetails(${p.id})">${p.nama}</div>
          <div class="price-row" style="margin-bottom:8px">
            <span style="color:var(--pasar); font-weight:800; font-size:0.95rem">Rp ${p.harga.toLocaleString('id-ID')}</span>
            ${originalPrice}
          </div>
          <div style="font-size:0.75rem; color:var(--muted); margin-bottom:12px;">
            ⭐ ${p.rating || '5.0'} (${p.totalReview || '0'}) · Terjual ${p.terjual || '0'}
          </div>
          <button class="btn-add" onclick="addToCart(${p.id})">
            <i class="fas fa-plus"></i> Tambah
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function handleSearch(val) {
  searchQuery = val;
  renderPasarStorefront();
}

function filterBySubKategori(sub) {
  activeSubKategori = sub;
  document.querySelectorAll('#pasarFilters .pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.outerHTML.includes(`'${sub}'`)) btn.classList.add('active');
  });
  renderPasarStorefront();
}

function populatePaymentMethods() {
  const select = document.getElementById('cartPayment');
  if (!select) return;

  if (livePayments.length === 0) {
    select.innerHTML = '<option value="cod">💵 COD (Bayar di Tempat)</option>';
    return;
  }

  select.innerHTML = livePayments.map(p => {
    const info = p.jenis === 'bank' ? `(A/N ${p.atasNama} - ${p.nomor})` : `(A/N ${p.atasNama})`;
    return `<option value="${p.id}">${p.icon} ${p.nama} — ${info}</option>`;
  }).join('') + '<option value="cod">💵 COD (Bayar di Tempat)</option>';
}

// ============================================
// PROPERTY RENDER ENGINE
// ============================================
function renderProperty() {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;

  if (liveProperties.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px 0;"><span style="font-size:3rem">🏘️</span><p style="color:var(--muted); margin-top:10px">Belum ada listing properti tersedia.</p></div>`;
    return;
  }

  grid.innerHTML = liveProperties.map(p => {
    const kontak = p.kontakPemilik || CS_WA;
    const teks = encodeURIComponent(`Halo, saya berminat menanyakan detail properti: "${p.title}" di ${p.loc} dengan harga ${p.price}. Bisa info lebih lanjut?`);
    return `
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
            ${p.features.map(f => `<span><i class="fas fa-check-circle"></i> ${f}</span>`).join('')}
          </div>
          <a href="https://wa.me/${kontak}?text=${teks}" target="_blank" class="btn-property">
            <i class="fab fa-whatsapp"></i> Hubungi ${p.pemilik || 'CS'}
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// EDUCATION RENDER ENGINE
// ============================================
function renderEdu() {
  const grid = document.getElementById('eduGrid');
  if (!grid) return;

  if (liveEducations.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px 0;"><span style="font-size:3rem">🎓</span><p style="color:var(--muted); margin-top:10px">Belum ada lembaga pendidikan yang terdaftar.</p></div>`;
    return;
  }

  grid.innerHTML = liveEducations.map(e => {
    const kontak = e.kontak || CS_WA;
    const teks = encodeURIComponent(`Halo, saya berminat mendaftar / info lebih lanjut mengenai "${e.name}" (${e.type}). Mohon detailnya.`);
    return `
      <div class="edu-card">
        <div class="edu-icon">${e.emoji}</div>
        <div class="edu-info">
          <div class="edu-type">${e.type}</div>
          <div class="edu-name">${e.name}</div>
          <div class="edu-desc">${e.desc}</div>
          ${e.biaya ? `<div style="font-size:0.78rem; color:var(--pendidikan); font-weight:700; margin-top:6px"><i class="fas fa-tag"></i> ${e.biaya}</div>` : ''}
          ${e.jadwal ? `<div style="font-size:0.75rem; color:var(--muted); margin-top:2px"><i class="fas fa-clock"></i> ${e.jadwal}</div>` : ''}
          <a href="https://wa.me/${kontak}?text=${teks}" target="_blank" class="btn-edu" style="margin-top:12px">
            <i class="fab fa-whatsapp"></i> Ajukan Brosur / Daftar
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// WIFI ENGINE
// ============================================
function switchWifiTab(type) {
  document.getElementById('btnTabFiber').classList.remove('active');
  document.getElementById('btnTabVoucher').classList.remove('active');
  document.getElementById('contentWifiFiber').style.display = 'none';
  document.getElementById('contentWifiVoucher').style.display = 'none';
  
  if (type === 'fiber') {
    document.getElementById('btnTabFiber').classList.add('active');
    document.getElementById('contentWifiFiber').style.display = 'block';
  } else {
    document.getElementById('btnTabVoucher').classList.add('active');
    document.getElementById('contentWifiVoucher').style.display = 'block';
  }
}

function renderWifi() {
  const grid = document.getElementById('wifiGrid');
  if (!grid) return;
  grid.innerHTML = liveWifiPackages.map(w => `
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

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findCoverage(userLat, userLng) {
  const hits = [];
  liveWifiCoverage.forEach(w => {
    const d = distanceKm(userLat, userLng, w.lat, w.lng);
    if (d <= w.radiusKm) hits.push({ ...w, jarak: d });
  });
  hits.sort((a, b) => a.jarak - b.jarak);
  return hits;
}

let lastUserLat = null; let lastUserLng = null;

function setLocStatus(msg, type) {
  const el = document.getElementById('locStatus');
  if (!el) return;
  el.style.display = 'block';
  el.className = type;
  el.innerHTML = msg;
}

function shareLocationWifi() {
  const btn = document.getElementById('btnShareLoc');
  if (!navigator.geolocation) {
    setLocStatus('❌ Sensor GPS tidak disokong browser Anda.', 'err');
    showManualWifiForm();
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghubungi Satelit...';
  setLocStatus('📍 Menunggu izin GPS...', 'load');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lastUserLat = pos.coords.latitude;
      lastUserLng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy);

      document.getElementById('wifiLat').value = lastUserLat;
      document.getElementById('wifiLng').value = lastUserLng;
      setLocStatus(`✅ Lokasi teridentifikasi (Akurasi: ±${acc}m)<br><small>GPS: ${lastUserLat.toFixed(6)}, ${lastUserLng.toFixed(6)}</small>`, 'ok');

      const hits = findCoverage(lastUserLat, lastUserLng);
      renderCoverageResult(hits);
      document.getElementById('wifiForm').style.display = 'block';
      fillPaketOptions(hits);

      if (hits.length > 0) {
        document.getElementById('wifiWilayahDetected').value = hits[0].nama;
        document.getElementById('wifiJarak').value = hits[0].jarak.toFixed(2) + ' km';
      } else {
        document.getElementById('wifiWilayahDetected').value = 'Di Luar Coverage';
        document.getElementById('wifiJarak').value = '-';
      }
      reverseGeocode(lastUserLat, lastUserLng);
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sync-alt"></i> Kalibrasi Ulang GPS';
    },
    () => {
      setLocStatus('❌ GPS gagal. Isi alamat manual.', 'err');
      showManualWifiForm();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-location-arrow"></i> Coba Lagi';
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

function renderCoverageResult(hits) {
  const box = document.getElementById('coverageResult');
  if (!box) return;
  box.style.display = 'block';

  if (!hits.length) {
    box.innerHTML = `<div class="coverage-empty"><i class="fas fa-exclamation-triangle"></i><b>Maaf, rumah Anda di luar radius kabel fiber optik.</b><br>Tetap kirim koordinat agar tim survei kami periksa penambahan rute.</div>`;
    return;
  }

  box.innerHTML = `
    <div style="font-size:0.88rem;color:var(--muted);margin-bottom:10px;font-weight:600">
      <i class="fas fa-check-circle" style="color:#059669"></i> Terbaca di jaringan rujukan:
    </div>
    ${hits.map(h => `
      <div class="coverage-card">
        <h4><i class="fas fa-broadcast-tower" style="color:var(--primary)"></i>${h.nama}<span style="font-size:0.72rem;font-weight:600;color:var(--muted);margin-left:auto">±${h.jarak.toFixed(2)} km</span></h4>
        <div class="coverage-meta">Radius: <b>${h.radiusKm} km</b> · ISP: <b>Youfiber (Regynet)</b></div>
      </div>
    `).join('')}
  `;
}

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
    liveWifiPackages.forEach(p => {
      map.set(p.name, { name: p.name + ' ' + p.speed + ' Mbps', price: Number(p.price.replace(/\./g, '')) });
    });
  }
  sel.innerHTML = '<option value="">-- Pilih Paket Internet --</option>' +
    [...map.values()].map(p => `<option value="${p.name} - Rp ${p.price.toLocaleString('id-ID')}">${p.name} — Rp ${p.price.toLocaleString('id-ID')}/bulan</option>`).join('');
}

function showManualWifiForm() {
  const form = document.getElementById('wifiForm');
  if (form) form.style.display = 'block';
  fillPaketOptions([]);
  const el = document.getElementById('wifiWilayahDetected');
  if (el) el.value = 'Input Manual';
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'id', 'User-Agent': 'PortalWargaApp/3.0' } });
    const data = await res.json();
    if (data && data.display_name) {
      const el = document.getElementById('wifiAlamat');
      if (el && !el.value) el.value = data.display_name;
    }
  } catch (e) { console.warn('Reverse geocode gagal:', e); }
}

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

  if (!nama || !wa || !alamat || !paket) { showToast('⚠️ Mohon lengkapi seluruh isian!'); return; }
  if (typeof recordWifiRegistration === 'function') {
    recordWifiRegistration(nama, wa, `[${wilayah} | ${jarak}] ${alamat} | GPS: ${lat},${lng}`, paket);
  }

  const mapsLink = (lat !== '-' && lng !== '-') ? `https://www.google.com/maps?q=${lat},${lng}` : '-';
  let msg = `*📡 REGISTRASI YOUFIBER REGYNET*\n===========================\n\n👤 *Pendaftar:* ${nama}\n📱 *WhatsApp:* ${wa}\n\n📦 *Paket:* ${paket}\n🗺️ *Wilayah:* ${wilayah} (${jarak})\n📍 *Alamat:* ${alamat}\n\n📌 *Pin Maps:* ${mapsLink}\n_Koordinat: ${lat}, ${lng}_\n\nMohon dijadwalkan survei. 🙏`;

  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('✓ Pendaftaran terkirim!');
  e.target.reset();

  setTimeout(() => {
    document.getElementById('wifiForm').style.display = 'none';
    document.getElementById('coverageResult').style.display = 'none';
    document.getElementById('locStatus').style.display = 'none';
  }, 4000);
}

function renderWifiVouchers() {
  const grid = document.getElementById('voucherGrid');
  if (!grid) return;

  if (liveWifiVouchers.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px 0; color:var(--muted)">Belum ada voucher yang tersedia saat ini.</div>`;
    return;
  }

  grid.innerHTML = liveWifiVouchers.map(v => `
    <div class="voucher-card">
      <div class="voucher-head">
        <h4>🎫 Masa Aktif ${v.hari} Hari</h4>
        <p>Akses Unlimited FUP</p>
      </div>
      <div class="voucher-body">
        <div class="v-price">Rp ${v.hargaUser.toLocaleString('id-ID')}</div>
        <div class="v-agen-price">
          Harga Khusus Agen: <b>Rp ${v.hargaAgen.toLocaleString('id-ID')}</b>
        </div>
        <button class="btn-buy-voucher" onclick="beliVoucherWA(${v.hari}, ${v.hargaUser})">
          <i class="fab fa-whatsapp" style="color:#25D366; font-size:1.1rem"></i> Beli via WhatsApp
        </button>
      </div>
    </div>
  `).join('');
}

function beliVoucherWA(hari, harga) {
  let msg = `*🎫 PEMBELIAN VOUCHER WIFI (HOTSPOT)*\n===========================\n\nHalo CS, saya berminat membeli Voucher WiFi dengan detail:\n\nMasa Aktif : *${hari} Hari*\nHarga User : *Rp ${harga.toLocaleString('id-ID')}*\n\nMohon kirimkan instruksi QRIS/Transfer untuk pembayarannya. Setelah transfer, tolong kirimkan kode vouchernya ke nomor WA ini ya. Terima kasih! 🙏`;
  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ============================================
// CART STORAGE SYSTEM
// ============================================
let cart = [];

function loadCartFromStorage() {
  const saved = localStorage.getItem('pw_cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch (e) { cart = []; }
  }
}

function saveCartToStorage() {
  localStorage.setItem('pw_cart', JSON.stringify(cart));
}

function addToCart(id) {
  const product = liveProducts.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      nama: product.nama,
      sellerName: product.sellerName,
      sellerId: product.sellerId || product.sellerName, // Disimpan untuk halaman checkout/seller
      emoji: product.emoji,
      harga: product.harga,
      qty: 1
    });
  }
  
  saveCartToStorage();
  updateCartUI();
  showToast(`✓ ${product.nama} ditambahkan!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCartToStorage();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else {
    saveCartToStorage();
    updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + (c.harga * c.qty), 0);
  
  // Update UI Header / Badge
  const badgeEl = document.getElementById('cartBadge');
  if (badgeEl) badgeEl.textContent = totalItems;

  // Update UI Ringkasan Footer (HTML Baru)
  const elCount = document.getElementById('cartItemCount');
  const elSub = document.getElementById('cartSubtotal');
  const elTotal = document.getElementById('cartTotal');
  const btnGo = document.getElementById('btnGoCheckout');

  if (elCount) elCount.textContent = totalItems;
  if (elSub) elSub.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
  if (elTotal) elTotal.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
  if (btnGo) btnGo.disabled = (cart.length === 0);

  // Render Isi Keranjang
  const cartBody = document.getElementById('cartBody');
  if (!cartBody) return;
  
  if (cart.length === 0) {
    cartBody.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-basket"></i><p>Keranjang kosong</p></div>`;
    return;
  }

  cartBody.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-img">${c.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.nama}</div>
        <div class="cart-item-vendor"><i class="fas fa-store"></i> ${c.sellerName}</div>
        <div class="cart-item-price">Rp ${(c.harga * c.qty).toLocaleString('id-ID')}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
}

// ============================================
// CHECKOUT REDIRECT
// ============================================
function goToCheckout() {
  if (cart.length === 0) {
    showToast('⚠️ Keranjang Anda masih kosong!');
    return;
  }
  
  // Pastikan data tersimpan sebelum pindah halaman
  saveCartToStorage();
  
  // Redirect ke halaman checkout dedicated
  window.location.href = 'checkout.html';
}

// ============================================
// NAVIGATION SYSTEM
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
// TOAST UTILITIES
// ============================================
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}