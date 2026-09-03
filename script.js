/* ==========================================================================
   PORTALWARGA - SCRIPT CORE v3.0 (FULL LIVE SYNC ALL 4 CATEGORIES)
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

let activeSubKategori = 'all';
let searchQuery = '';

// ============================================
// DATA FALLBACKS UNTUK EMERGENCY OFFLINE MODE
// ============================================
let dataPasarFallback = [
  { id: 1, emoji: '🥬', nama: 'Sayur Bayam', sellerName: 'Toko Bu Tini', harga: 5000, subKategori: 'sayur', deskripsi: 'Bayam segar.', stok: 10, berat: 200, satuan: 'ikat', terjual: 5, rating: 5, totalReview: 1, tags: ['fresh'] }
];

let dataPropertyFallback = [
  { id: 'prop_fb', emoji: '🏠', type: 'Kontrakan', status: 'Tersedia', title: 'Rumah Contoh', loc: 'Ds. Sample', price: 'Rp 1 Jt/bulan', features: ['2 Kamar'], deskripsi: 'Rumah contoh fallback.', kontakPemilik: '' }
];

let dataPendidikanFallback = [
  { id: 'edu_fb', emoji: '📚', type: 'Bimbel', name: 'Bimbel Contoh', desc: 'Fallback bimbel data.', kontak: '' }
];

let dataWifiFallback = [
  { id: 1, name: 'Basic', speed: '15', price: '165.000', features: ['Unlimited'], popular: true }
];

let dataWifiCoverageFallback = [
  { id: 'A', nama: 'Radar A', lat: -6.07185544, lng: 107.02091269, radiusKm: 1, paket: [{ name: 'Basic 15 Mbps', speed: 15, price: 165000 }] }
];

// ============================================
// INITIALIZATION FIRESTORE LIVE SYNC ENGINE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLiveDatabase();
  updateCartUI();
});

function initLiveDatabase() {
  if (typeof db === 'undefined' || db === null) {
    console.warn("⚠️ Firebase Offline. Menggunakan data lokal fallback.");
    liveProducts = [...dataPasarFallback];
    liveProperties = [...dataPropertyFallback];
    liveEducations = [...dataPendidikanFallback];
    liveWifiPackages = [...dataWifiFallback];
    liveWifiCoverage = [...dataWifiCoverageFallback];
    renderAll();
    return;
  }

  // 1. LIVE SYNC PRODUK PASAR
  db.collection('produk').where('aktif', '==', true).onSnapshot(snapshot => {
    liveProducts = [];
    snapshot.forEach(doc => liveProducts.push({ firestoreId: doc.id, ...doc.data() }));
    const statEl = document.getElementById('statProducts');
    if (statEl) statEl.textContent = liveProducts.length;
    renderPasarStorefront();
  }, () => {
    liveProducts = [...dataPasarFallback];
    renderPasarStorefront();
  });

  // 2. LIVE SYNC SELLERS
  db.collection('sellers').onSnapshot(snapshot => {
    liveSellers = [];
    snapshot.forEach(doc => liveSellers.push(doc.data()));
    const statEl = document.getElementById('statSellers');
    if (statEl) statEl.textContent = liveSellers.length;
  });

  // 3. LIVE SYNC METODE PEMBAYARAN
  db.collection('payment_methods').where('aktif', '==', true).onSnapshot(snapshot => {
    livePayments = [];
    snapshot.forEach(doc => livePayments.push(doc.data()));
    populatePaymentMethods();
  });

  // 4. LIVE SYNC REVIEWS
  db.collection('reviews').onSnapshot(snapshot => {
    liveReviews = [];
    snapshot.forEach(doc => liveReviews.push(doc.data()));
  });

  // 5. LIVE SYNC PROPERTI (BARU)
  db.collection('properti').where('aktif', '==', true).onSnapshot(snapshot => {
    liveProperties = [];
    snapshot.forEach(doc => liveProperties.push({ firestoreId: doc.id, ...doc.data() }));
    if (liveProperties.length === 0) liveProperties = [...dataPropertyFallback];
    renderProperty();
  }, () => {
    liveProperties = [...dataPropertyFallback];
    renderProperty();
  });

  // 6. LIVE SYNC PENDIDIKAN (BARU)
  db.collection('pendidikan').where('aktif', '==', true).onSnapshot(snapshot => {
    liveEducations = [];
    snapshot.forEach(doc => liveEducations.push({ firestoreId: doc.id, ...doc.data() }));
    if (liveEducations.length === 0) liveEducations = [...dataPendidikanFallback];
    renderEdu();
  }, () => {
    liveEducations = [...dataPendidikanFallback];
    renderEdu();
  });

  // 7. LIVE SYNC WIFI PACKAGES
  db.collection('wifi_packages').where('aktif', '==', true).onSnapshot(snapshot => {
    liveWifiPackages = [];
    snapshot.forEach(doc => liveWifiPackages.push(doc.data()));
    if (liveWifiPackages.length === 0) liveWifiPackages = [...dataWifiFallback];
    renderWifi();
  }, () => {
    liveWifiPackages = [...dataWifiFallback];
    renderWifi();
  });

  // 8. LIVE SYNC WIFI COVERAGE ZONE
  db.collection('wifi_coverage').onSnapshot(snapshot => {
    liveWifiCoverage = [];
    snapshot.forEach(doc => liveWifiCoverage.push(doc.data()));
    if (liveWifiCoverage.length === 0) liveWifiCoverage = [...dataWifiCoverageFallback];
  }, () => {
    liveWifiCoverage = [...dataWifiCoverageFallback];
  });
}

function renderAll() {
  renderPasarStorefront();
  renderProperty();
  renderEdu();
  renderWifi();
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

// ============================================
// PAYMENT METHODS DYNAMIC POPULATOR
// ============================================
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
// PRODUCT DETAIL MODAL
// ============================================
function openProductDetails(id) {
  const prod = liveProducts.find(x => x.id === id);
  if (!prod) return;

  document.getElementById('modalEmoji').textContent = prod.emoji;
  document.getElementById('modalSellerName').innerHTML = `<i class="fas fa-store"></i> ${prod.sellerName}`;
  document.getElementById('modalProductName').textContent = prod.nama;
  document.getElementById('modalPrice').textContent = `Rp ${prod.harga.toLocaleString('id-ID')}`;
  
  const strikePriceEl = document.getElementById('modalStrikePrice');
  if (prod.hargaCoret) {
    strikePriceEl.style.display = 'inline';
    strikePriceEl.textContent = `Rp ${prod.hargaCoret.toLocaleString('id-ID')}`;
  } else {
    strikePriceEl.style.display = 'none';
  }

  const discEl = document.getElementById('modalDiscount');
  if (prod.diskon) {
    discEl.style.display = 'inline-block';
    discEl.textContent = `Diskon ${prod.diskon}%`;
  } else {
    discEl.style.display = 'none';
  }

  document.getElementById('modalUnit').textContent = prod.satuan || 'Pcs';
  document.getElementById('modalStock').textContent = `${prod.stok || 'Tersedia'} unit`;
  document.getElementById('modalWeight').textContent = prod.berat ? `${prod.berat} gr` : '-';
  document.getElementById('modalDesc').textContent = prod.deskripsi || 'Tidak ada deskripsi.';
  
  const tagBox = document.getElementById('modalTags');
  if (prod.tags && prod.tags.length > 0) {
    tagBox.style.display = 'flex';
    tagBox.innerHTML = prod.tags.map(t => `<span>#${t}</span>`).join('');
  } else {
    tagBox.style.display = 'none';
  }

  const reviewCount = document.getElementById('modalReviewCount');
  const reviewList = document.getElementById('reviewsContainer');
  const matchingReviews = liveReviews.filter(r => r.productId === id);

  reviewCount.textContent = matchingReviews.length;
  if (matchingReviews.length > 0) {
    reviewList.innerHTML = matchingReviews.map(r => `
      <div class="review-item">
        <div class="review-meta"><strong>${r.userName}</strong> · <span style="color:#eab308">${'★'.repeat(r.rating)}</span></div>
        <p class="review-comment">"${r.komentar}"</p>
        ${r.balasanSeller ? `<div class="review-reply"><strong>Balasan Mitra:</strong> ${r.balasanSeller}</div>` : ''}
      </div>
    `).join('');
  } else {
    reviewList.innerHTML = `<p style="color:var(--muted); font-size:0.8rem">Belum ada ulasan.</p>`;
  }

  document.getElementById('modalAddBtn').onclick = () => {
    addToCart(prod.id);
    closeProductModal(null);
  };

  document.getElementById('productModal').classList.add('open');
}

function closeProductModal(e) {
  if (e === null || e.target === document.getElementById('productModal') || e.target.classList.contains('modal-close-btn')) {
    document.getElementById('productModal').classList.remove('open');
  }
}

// ============================================
// PROPERTY RENDER ENGINE (DYNAMIC LIVE)
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
// EDUCATION RENDER ENGINE (DYNAMIC LIVE)
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
// WIFI RENDER ENGINE (LIVE)
// ============================================
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

// ============================================
// WIFI GPS RADAR ENGINE
// ============================================
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

let lastUserLat = null;
let lastUserLng = null;

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

      setLocStatus(
        `✅ Lokasi teridentifikasi (Akurasi: ±${acc}m)<br>
         <small>GPS: ${lastUserLat.toFixed(6)}, ${lastUserLng.toFixed(6)}</small>`, 'ok'
      );

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
        <h4>
          <i class="fas fa-broadcast-tower" style="color:var(--primary)"></i>
          ${h.nama}
          <span style="font-size:0.72rem;font-weight:600;color:var(--muted);margin-left:auto">
            ±${h.jarak.toFixed(2)} km
          </span>
        </h4>
        <div class="coverage-meta">
          Radius: <b>${h.radiusKm} km</b> · ISP: <b>Youfiber (Regynet)</b>
        </div>
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
    [...map.values()].map(p =>
      `<option value="${p.name} - Rp ${p.price.toLocaleString('id-ID')}">
        ${p.name} — Rp ${p.price.toLocaleString('id-ID')}/bulan
      </option>`
    ).join('');
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
  } catch (e) {
    console.warn('Reverse geocode gagal:', e);
  }
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

  if (!nama || !wa || !alamat || !paket) {
    showToast('⚠️ Mohon lengkapi seluruh isian!');
    return;
  }

  if (typeof recordWifiRegistration === 'function') {
    recordWifiRegistration(nama, wa, `[${wilayah} | ${jarak}] ${alamat} | GPS: ${lat},${lng}`, paket);
  }

  const mapsLink = (lat !== '-' && lng !== '-') ? `https://www.google.com/maps?q=${lat},${lng}` : '-';

  let msg = `*📡 REGISTRASI YOUFIBER REGYNET*\n===========================\n\n`;
  msg += `👤 *Pendaftar:* ${nama}\n📱 *WhatsApp:* ${wa}\n\n`;
  msg += `📦 *Paket:* ${paket}\n🗺️ *Wilayah:* ${wilayah} (${jarak})\n`;
  msg += `📍 *Alamat:* ${alamat}\n\n📌 *Pin Maps:* ${mapsLink}\n`;
  msg += `_Koordinat: ${lat}, ${lng}_\n\nMohon dijadwalkan survei. 🙏`;

  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('✓ Pendaftaran terkirim!');
  e.target.reset();

  setTimeout(() => {
    document.getElementById('wifiForm').style.display = 'none';
    document.getElementById('coverageResult').style.display = 'none';
    document.getElementById('locStatus').style.display = 'none';
  }, 4000);
}

// ============================================
// CART SYSTEM
// ============================================
let cart = [];

function addToCart(id) {
  const product = liveProducts.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCartUI();
  showToast(`✓ ${product.nama} ditambahkan!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + (c.harga * c.qty), 0);
  const badgeEl = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  if (badgeEl) badgeEl.textContent = totalItems;
  if (totalEl) totalEl.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');

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

function checkoutWA() {
  if (cart.length === 0) {
    showToast('⚠️ Keranjang kosong!');
    return;
  }

  const selectedPaymentVal = document.getElementById('cartPayment').value;
  let paymentLabel = 'COD (Bayar di Tempat)';
  if (selectedPaymentVal !== 'cod') {
    const paymentObj = livePayments.find(p => p.id === selectedPaymentVal);
    if (paymentObj) {
      paymentLabel = `${paymentObj.nama} (A/N ${paymentObj.atasNama} — ${paymentObj.nomor || ''})`;
    }
  }

  const total = cart.reduce((sum, c) => sum + (c.harga * c.qty), 0);
  if (typeof recordOrder === 'function') recordOrder(cart, total);

  let msg = `*🛒 PESANAN BARU - PortalWarga*\n===========================\n\n`;
  cart.forEach((c, i) => {
    msg += `${i + 1}. *${c.nama}* (${c.qty}x)\n   Toko: ${c.sellerName}\n   Subtotal: *Rp ${(c.harga * c.qty).toLocaleString('id-ID')}*\n\n`;
  });
  msg += `------------------------------\n💰 *Total:* Rp ${total.toLocaleString('id-ID')}\n💳 *Bayar:* ${paymentLabel}\n_Belum termasuk ongkir._\n\n📍 Alamat: _(Mohon ketik alamat lengkap)_\n\nTerima kasih! 🙏`;

  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  cart = [];
  updateCartUI();
  closeCart();
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