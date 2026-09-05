/* ==========================================================================
   PORTALWARGA - SCRIPT CORE v4.1 (FULL IMAGE SUPPORT + 5 KATEGORI)
   ========================================================================== */

const CS_WA = '6285267891619';

// ============================================
// FALLBACK IMAGES (Jika field .image kosong)
// ============================================
const FALLBACK_IMG = {
  food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format',
  property: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&auto=format',
  edu: 'https://images.unsplash.com/photo-1609599006353-e629aaab31f5?w=300&auto=format',
  umroh: 'https://images.unsplash.com/photo-1565552643952-250626c7284d?w=500&auto=format'
};

function safeImg(url, type) {
  return url && url.trim() !== '' ? url : FALLBACK_IMG[type];
}

// ============================================
// STATE MANAGER (LIVE CONTAINERS)
// ============================================
let liveProducts = [];
let liveSellers = [];
let liveReviews = [];
let livePayments = [];
let liveProperties = [];
let liveEducations = [];
let liveUmroh = [];
let liveWifiPackages = [];
let liveWifiCoverage = [];
let liveWifiVouchers = [];

let activeSubKategori = 'all';
let activePropertyFilter = 'all';
let activeEduFilter = 'all';
let searchQuery = '';

// Filter Spesifikasi Umroh
let umrohFilter = { bulan: '', harga: '', pesawat: '', hotel: '' };
let userGpsLat = null;
let userGpsLng = null;

// ============================================
// DATA FALLBACKS — FOOD & F&B POPULER
// ============================================
let dataPasarFallback = [
  { id: 1, image: '', emoji: '🍜', nama: 'Mie Gacoan Level 3 (Setan)', sellerName: 'Mie Gacoan Cabang', harga: 15000, hargaCoret: 18000, diskon: 17, subKategori: 'mie', deskripsi: 'Mie pedas viral level setan.', stok: 99, terjual: 4520, rating: 4.9, totalReview: 890, tags: ['viral', 'pedas'], aktif: true },
  { id: 2, image: '', emoji: '🥟', nama: 'Dimsum Mercon Gacoan', sellerName: 'Mie Gacoan Cabang', harga: 12000, subKategori: 'mie', deskripsi: 'Dimsum ayam saus mercon.', stok: 60, terjual: 1200, rating: 4.8, totalReview: 234, tags: ['viral'], aktif: true },
  { id: 3, image: '', emoji: '🍤', nama: 'Udang Keju Gacoan', sellerName: 'Mie Gacoan Cabang', harga: 13000, subKategori: 'mie', deskripsi: 'Udang crispy saus keju.', stok: 40, terjual: 780, rating: 4.7, totalReview: 156, tags: ['premium'], aktif: true },
  { id: 4, image: '', emoji: '🍱', nama: 'HokBen Paket Bento Spesial 1', sellerName: 'HokBen', harga: 45000, subKategori: 'bento', deskripsi: 'Chicken teriyaki + ebi furai + salad.', stok: 30, terjual: 2340, rating: 4.9, totalReview: 567, tags: ['bento'], aktif: true },
  { id: 5, image: '', emoji: '🍙', nama: 'HokBen Salmon Onigiri', sellerName: 'HokBen', harga: 22000, subKategori: 'bento', deskripsi: 'Nasi kepal isi salmon mayo.', stok: 25, terjual: 1120, rating: 4.8, totalReview: 234, tags: ['fresh'], aktif: true },
  { id: 6, image: '', emoji: '🍣', nama: 'HokBen Beef Yakiniku Bento', sellerName: 'HokBen', harga: 55000, hargaCoret: 60000, diskon: 8, subKategori: 'bento', deskripsi: 'Sapi bakar saus khas Jepang + nasi.', stok: 20, terjual: 890, rating: 4.9, totalReview: 145, tags: ['premium'], aktif: true },
  { id: 7, image: '', emoji: '🍛', nama: 'Solaria Nasi Ayam Cabe Ijo', sellerName: 'Solaria', harga: 42000, subKategori: 'resto', deskripsi: 'Ayam suwir cabe hijau khas Solaria.', stok: 40, terjual: 1876, rating: 4.7, totalReview: 345, tags: ['pedas'], aktif: true },
  { id: 8, image: '', emoji: '🍲', nama: 'Solaria Mie Ayam Jamur', sellerName: 'Solaria', harga: 35000, subKategori: 'resto', deskripsi: 'Mie ayam premium + jamur.', stok: 40, terjual: 1450, rating: 4.6, totalReview: 267, tags: [], aktif: true },
  { id: 9, image: '', emoji: '🍹', nama: 'Solaria Es Teller Special', sellerName: 'Solaria', harga: 25000, subKategori: 'resto', deskripsi: 'Es teller alpukat kelapa nangka.', stok: 50, terjual: 987, rating: 4.8, totalReview: 189, tags: ['fresh'], aktif: true },
  { id: 10, image: '', emoji: '🍕', nama: "Domino's Pizza Cheese Burst L", sellerName: "Domino's Pizza", harga: 129000, hargaCoret: 145000, diskon: 11, subKategori: 'fastfood', deskripsi: 'Pizza L pinggiran keju meleleh.', stok: 25, terjual: 2340, rating: 4.9, totalReview: 456, tags: ['viral', 'keju'], aktif: true },
  { id: 11, image: '', emoji: '🍕', nama: "Domino's Meat Lover Reguler", sellerName: "Domino's Pizza", harga: 89000, subKategori: 'fastfood', deskripsi: 'Topping penuh daging premium.', stok: 30, terjual: 1567, rating: 4.8, totalReview: 289, tags: ['daging'], aktif: true },
  { id: 12, image: '', emoji: '🥤', nama: "Domino's Kentang + Cola 500ml", sellerName: "Domino's Pizza", harga: 35000, subKategori: 'fastfood', deskripsi: 'Paket hemat side dish + minuman.', stok: 50, terjual: 780, rating: 4.5, totalReview: 123, tags: [], aktif: true },
  { id: 13, image: '', emoji: '🍗', nama: 'Ayam Sabana Paket Combo Dada', sellerName: 'Ayam Sabana', harga: 20000, subKategori: 'ayam', deskripsi: 'Dada crispy + nasi + saus.', stok: 100, terjual: 5670, rating: 4.8, totalReview: 890, tags: ['legend', 'crispy'], aktif: true },
  { id: 14, image: '', emoji: '🍗', nama: 'Ayam Sabana Paha Bawah', sellerName: 'Ayam Sabana', harga: 18000, subKategori: 'ayam', deskripsi: 'Paha bawah crispy + nasi.', stok: 100, terjual: 4520, rating: 4.9, totalReview: 780, tags: ['crispy'], aktif: true },
  { id: 15, image: '', emoji: '🍔', nama: 'Sabana Chicken Burger', sellerName: 'Ayam Sabana', harga: 15000, hargaCoret: 18000, diskon: 17, subKategori: 'ayam', deskripsi: 'Burger ayam sabana khas.', stok: 40, terjual: 890, rating: 4.6, totalReview: 145, tags: [], aktif: true }
];

// ============================================
// DATA FALLBACKS — PROPERTY (LENGKAP GPS)
// ============================================
let dataPropertyFallback = [
  { id: 'prop_01', image: '', emoji: '🏠', type: 'kontrakan', typeName: 'Kontrakan', status: 'Tersedia', title: 'Rumah 2 Kamar Dekat Pasar', loc: 'Ds. Sukamaju', price: 'Rp 1,2 Jt/bulan', features: ['2 Kamar', '1 KM', 'Carport'], pemilik: 'Bu Aminah', kontakPemilik: '081234567801', lat: -6.72015, lng: 106.79001, aktif: true },
  { id: 'prop_02', image: '', emoji: '🏡', type: 'rumah', typeName: 'Rumah Dijual', status: 'Nego', title: 'Rumah Minimalis SHM', loc: 'Ds. Cinta Damai', price: 'Rp 350 Jt', features: ['3 Kamar', '2 KM', 'LT 90m²'], pemilik: 'Pak Hendra', kontakPemilik: '081234567802', lat: -6.72505, lng: 106.79350, aktif: true },
  { id: 'prop_03', image: '', emoji: '🛏️', type: 'kos', typeName: 'Kos Putri', status: 'Sisa 2', title: 'Kos Nyaman Dekat Kampus', loc: 'Ds. Mulyasari', price: 'Rp 600 Rb/bulan', features: ['AC', 'WiFi', 'K.Dalam'], pemilik: 'Bu Yanti', kontakPemilik: '081234567803', lat: -6.71800, lng: 106.79600, aktif: true },
  { id: 'prop_04', image: '', emoji: '🌾', type: 'tanah', typeName: 'Tanah Dijual', status: 'Cash', title: 'Tanah Datar Cocok Usaha', loc: 'Jl. Raya Kec.', price: 'Rp 500 Jt', features: ['200 m²', 'SHM', 'Strategis'], pemilik: 'Pak Rudi', kontakPemilik: '081234567804', lat: -6.71250, lng: 106.79800, aktif: true },
  { id: 'prop_05', image: '', emoji: '🏘️', type: 'kontrakan', typeName: 'Kontrakan', status: 'Tersedia', title: 'Rumah 3 Kamar Halaman Luas', loc: 'Ds. Sejahtera', price: 'Rp 1,8 Jt/bulan', features: ['3 Kamar', '2 KM', 'Halaman'], pemilik: 'Pak Yusuf', kontakPemilik: '081234567805', lat: -6.72900, lng: 106.78700, aktif: true },
  { id: 'prop_06', image: '', emoji: '🏬', type: 'kos', typeName: 'Kos Putra', status: 'Sisa 3', title: 'Kos Pria Ekonomis', loc: 'Ds. Mulyasari', price: 'Rp 450 Rb/bulan', features: ['Kasur', 'WiFi', 'Dapur'], pemilik: 'Pak Danu', kontakPemilik: '081234567806', lat: -6.71950, lng: 106.79450, aktif: true },
  { id: 'prop_07', image: '', emoji: '🏡', type: 'rumah', typeName: 'Rumah Dijual', status: 'Tersedia', title: 'Rumah Baru 2 Lantai', loc: 'Perumahan Melati', price: 'Rp 725 Jt', features: ['4 Kamar', '3 KM', '2 Lantai'], pemilik: 'Pak Iwan', kontakPemilik: '081234567807', lat: -6.71050, lng: 106.79200, aktif: true }
];

// ============================================
// DATA FALLBACKS — PENDIDIKAN MANHAJ SALAF
// ============================================
let dataPendidikanFallback = [
  { id: 'edu_01', image: '', emoji: '🕌', type: 'pesantren', typeName: 'Ponpes Salaf', name: 'Ma\'had Ibnul Qoyyim', desc: 'Pondok tahfidz & pengajaran ilmu syar\'i berdasarkan Manhaj Salafush Shalih.', biaya: 'Mulai Rp 600rb/bulan', jadwal: 'Mukim & Kalong', kontak: CS_WA, aktif: true },
  { id: 'edu_02', image: '', emoji: '📖', type: 'tahfidz', typeName: 'Rumah Tahfidz', name: 'Tahfidz Al-Bayyinah', desc: 'Tahsin & Tahfidz Qur\'an metode Ummi, ustadz alumni Timur Tengah.', biaya: 'Rp 350rb/bulan', jadwal: 'Ba\'da Subuh & Ashar', kontak: CS_WA, aktif: true },
  { id: 'edu_03', image: '', emoji: '🏫', type: 'tksd', typeName: 'SDIT', name: 'SDIT Al-Furqon Al-Islami', desc: 'Sekolah dasar bermanhaj Ahlussunnah. Kurikulum diknas + tahfidz 5 Juz.', biaya: 'DPP Rp 4Jt + Bulanan Rp 750rb', jadwal: 'Senin - Jumat', kontak: CS_WA, aktif: true },
  { id: 'edu_04', image: '', emoji: '🎒', type: 'tksd', typeName: 'TKIT', name: 'TKIT Ibnu Taimiyah', desc: 'Taman kanak-kanak Islam terpadu, penekanan adab dan bahasa Arab dasar.', biaya: 'Rp 400rb/bulan', jadwal: 'Senin - Jumat', kontak: CS_WA, aktif: true },
  { id: 'edu_05', image: '', emoji: '🏫', type: 'smpsma', typeName: 'SMAIT', name: 'SMAIT Darush Sholihin', desc: 'Sekolah menengah manhaj salaf. Program science & agama seimbang.', biaya: 'DPP Rp 8Jt + Bulanan Rp 950rb', jadwal: 'Full Day School', kontak: CS_WA, aktif: true },
  { id: 'edu_06', image: '', emoji: '🗣️', type: 'bahasa', typeName: 'Bahasa Arab', name: 'Ma\'had Al-Lughoh Bina Karakter', desc: 'Kursus bahasa Arab intensif metode Madinah & Al-Arabiyyah baina Yadaik.', biaya: 'Mulai Rp 500rb/level', jadwal: 'Online & Offline', kontak: CS_WA, aktif: true },
  { id: 'edu_07', image: '', emoji: '📚', type: 'tahfidz', typeName: 'Halaqoh Qur\'an', name: 'Rumah Qur\'an Al-Atsari', desc: 'Halaqoh khusus akhwat dewasa & remaja. Setoran & muraja\'ah rutin.', biaya: 'Infaq seikhlasnya', jadwal: 'Setiap Ahad Pagi', kontak: CS_WA, aktif: true }
];

// ============================================
// DATA FALLBACKS — TRAVEL UMROH
// ============================================
let dataUmrohFallback = [
  { id: 'um_01', image: '', emoji: '🕋', name: 'Umroh Ekonomis Direct Saudia', bulan: 'oktober', bulanLabel: 'Oktober 2026', harga: 27500000, hargaKategori: 'hemat', pesawat: 'saudia', pesawatLabel: 'Saudia Airlines (Direct)', hotel: 'bintang4', hotelLabel: 'Bintang 4', hotelMakkah: 'Rayyana Al Ajyad (400m)', hotelMadinah: 'Al Aqeeq (Ring 2)', durasi: '9 Hari', fasilitas: ['Visa', 'Manasik', 'Muthowif', 'Bus AC', 'Konsumsi 3x'], aktif: true },
  { id: 'um_02', image: '', emoji: '🕋', name: 'Umroh Standar Ramadhan Awal', bulan: 'ramadhan', bulanLabel: 'Ramadhan Awal 2027', harga: 32000000, hargaKategori: 'standar', pesawat: 'garuda', pesawatLabel: 'Garuda Indonesia (Direct)', hotel: 'bintang5', hotelLabel: 'Bintang 5', hotelMakkah: 'Swissotel Al Maqam', hotelMadinah: 'Dar Al Iman Intercontinental', durasi: '12 Hari', fasilitas: ['Visa', 'Manasik', 'Muthowif Berpengalaman', 'Perlengkapan Umroh', 'Konsumsi 3x Prasmanan'], aktif: true },
  { id: 'um_03', image: '', emoji: '⭐', name: 'Umroh Premium VIP Ring 1', bulan: 'desember', bulanLabel: 'Desember 2026', harga: 42500000, hargaKategori: 'premium', pesawat: 'emirates', pesawatLabel: 'Emirates (Transit Dubai)', hotel: 'ring1', hotelLabel: 'Ring 1 Makkah', hotelMakkah: 'Fairmont Clock Tower', hotelMadinah: 'Movenpick', durasi: '10 Hari', fasilitas: ['Visa', 'Manasik VIP', 'Ustadz Pembimbing', 'City Tour Dubai', 'Kamar Tripple/Double'], aktif: true },
  { id: 'um_04', image: '', emoji: '🕋', name: 'Umroh Hemat Lion Air', bulan: 'november', bulanLabel: 'November 2026', harga: 26000000, hargaKategori: 'hemat', pesawat: 'lion', pesawatLabel: 'Lion Air (Direct)', hotel: 'bintang4', hotelLabel: 'Bintang 4', hotelMakkah: 'Le Meridien Towers', hotelMadinah: 'Retaj Al Bayt', durasi: '9 Hari', fasilitas: ['Visa', 'Manasik', 'Muthowif', 'Konsumsi', 'Ziarah'], aktif: true },
  { id: 'um_05', image: '', emoji: '⭐', name: 'Umroh Syawal Qatar Airways', bulan: 'syawal', bulanLabel: 'Syawal 2027', harga: 35000000, hargaKategori: 'standar', pesawat: 'qatar', pesawatLabel: 'Qatar Airways (Transit Doha)', hotel: 'bintang5', hotelLabel: 'Bintang 5', hotelMakkah: 'Pullman Zamzam', hotelMadinah: 'The Oberoi', durasi: '11 Hari', fasilitas: ['Visa', 'Manasik', 'Kelas Tahsin', 'Kamar Kuad', 'Baggage 30kg'], aktif: true }
];

// ============================================
// WIFI FALLBACKS
// ============================================
let dataWifiFallback = [
  { id: 1, name: 'Ekonomis', speed: '10', price: '130.000', features: ['Unlimited Tanpa FUP', 'Gratis Modem', 'CS 24 Jam'], popular: false, aktif: true },
  { id: 2, name: 'Basic', speed: '15', price: '165.000', features: ['Unlimited Tanpa FUP', 'Gratis Modem', 'Gratis Kabel'], popular: true, aktif: true },
  { id: 3, name: 'Advanced', speed: '30', price: '220.000', features: ['Unlimited Tanpa FUP', 'Modem Dual-Band', 'Prioritas'], popular: false, aktif: true },
  { id: 4, name: 'Extra', speed: '50', price: '330.000', features: ['Unlimited Tanpa FUP', 'Modem Dual-Band', 'Stabil'], popular: false, aktif: true },
  { id: 5, name: 'Premiere', speed: '100', price: '550.000', features: ['100 Mbps', 'Wifi 6', 'CS VIP'], popular: false, aktif: true }
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
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  initLiveDatabase();
  updateCartUI();
  bindUmrohFilters();

  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get('openCart') === '1') setTimeout(() => openCart(), 500);
});

function initLiveDatabase() {
  if (typeof db === 'undefined' || db === null) {
    console.warn("⚠️ Firebase Offline. Menggunakan data lokal fallback.");
    liveProducts = [...dataPasarFallback];
    liveProperties = [...dataPropertyFallback];
    liveEducations = [...dataPendidikanFallback];
    liveUmroh = [...dataUmrohFallback];
    liveWifiPackages = [...dataWifiFallback];
    liveWifiCoverage = [...dataWifiCoverageFallback];
    liveWifiVouchers = [...dataWifiVouchersFallback];
    renderAll();
    return;
  }

  console.log("🔥 Firebase terhubung. Mulai live sync...");

  function liveCollection(name, onData, onEmptyFallback) {
    db.collection(name).where('aktif', '==', true).onSnapshot(snapshot => {
      if (!snapshot.empty) onData(snapshot);
      else if (onEmptyFallback) onEmptyFallback();
    }, err => {
      console.warn(`⚠️ Sync ${name} gagal:`, err.message);
      if (onEmptyFallback) onEmptyFallback();
    });
  }

  // === PRODUK FOOD (dengan validasi F&B) ===
  liveCollection('produk', snapshot => {
    const fromFb = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    const FNB_CATS = ['mie', 'bento', 'resto', 'fastfood', 'ayam'];
    const hasFnB = fromFb.some(p => FNB_CATS.includes(p.subKategori));

    if (!hasFnB) {
      console.warn('⚠️ Produk Firebase masih data lama. Menggunakan fallback F&B.');
      liveProducts = [...dataPasarFallback];
    } else {
      liveProducts = fromFb;
    }
    renderPasarStorefront();
  }, () => {
    liveProducts = [...dataPasarFallback];
    renderPasarStorefront();
  });

  liveCollection('properti', snapshot => {
    liveProperties = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    renderProperty();
  }, () => { liveProperties = [...dataPropertyFallback]; renderProperty(); });

  liveCollection('pendidikan', snapshot => {
    liveEducations = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    renderEdu();
  }, () => { liveEducations = [...dataPendidikanFallback]; renderEdu(); });

  liveCollection('umroh_packages', snapshot => {
    liveUmroh = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    renderUmroh();
  }, () => { liveUmroh = [...dataUmrohFallback]; renderUmroh(); });

  liveCollection('wifi_packages', snapshot => {
    liveWifiPackages = snapshot.docs.map(doc => doc.data());
    renderWifi();
  }, () => { liveWifiPackages = [...dataWifiFallback]; renderWifi(); });

  db.collection('wifi_coverage').onSnapshot(snapshot => {
    liveWifiCoverage = snapshot.docs.map(doc => doc.data());
    if (liveWifiCoverage.length === 0) liveWifiCoverage = [...dataWifiCoverageFallback];
  }, () => { liveWifiCoverage = [...dataWifiCoverageFallback]; });

  liveCollection('wifi_vouchers', snapshot => {
    liveWifiVouchers = snapshot.docs.map(doc => doc.data());
    liveWifiVouchers.sort((a, b) => a.hari - b.hari);
    renderWifiVouchers();
  }, () => { liveWifiVouchers = [...dataWifiVouchersFallback]; renderWifiVouchers(); });

  liveCollection('payment_methods', snapshot => {
    livePayments = snapshot.docs.map(doc => doc.data());
    populatePaymentMethods();
  }, () => populatePaymentMethods());
}

function renderAll() {
  renderPasarStorefront();
  renderProperty();
  renderEdu();
  renderUmroh();
  renderWifi();
  renderWifiVouchers();
}

function openProductDetails(id) {
  if (!id) return;
  window.location.href = `product.html?id=${id}`;
}

// ============================================
// PASAR / FOOD RENDER (WITH IMAGE)
// ============================================
function renderPasarStorefront() {
  const grid = document.getElementById('pasarGrid');
  if (!grid) return;

  let filtered = liveProducts.filter(item => {
    const matchKategori = (activeSubKategori === 'all' || item.subKategori === activeSubKategori);
    const q = searchQuery.toLowerCase();
    const matchSearch = item.nama.toLowerCase().includes(q) || 
                        (item.sellerName && item.sellerName.toLowerCase().includes(q));
    return matchKategori && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 0"><span style="font-size:3rem">🍽️</span><h4 style="margin-top:10px">Menu tidak ditemukan</h4><p style="color:var(--muted);font-size:0.85rem">Coba filter atau kata kunci lain.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const originalPrice = p.hargaCoret ? `<span class="strike-price">Rp ${p.hargaCoret.toLocaleString('id-ID')}</span>` : '';
    const discLabel = p.diskon ? `<span class="disc-pill">-${p.diskon}%</span>` : '';
    return `
      <div class="product-card">
        <div class="product-img" onclick="openProductDetails(${p.id})">
          <img src="${safeImg(p.image, 'food')}" alt="${p.nama}" loading="lazy" onerror="this.src='${FALLBACK_IMG.food}'">
          ${discLabel}
        </div>
        <div class="product-info">
          <div class="product-vendor"><i class="fas fa-store"></i> ${p.sellerName}</div>
          <div class="product-name" onclick="openProductDetails(${p.id})">${p.nama}</div>
          <div class="price-row" style="margin-bottom:8px">
            <span style="color:var(--pasar);font-weight:800;font-size:0.95rem">Rp ${p.harga.toLocaleString('id-ID')}</span>
            ${originalPrice}
          </div>
          <div style="font-size:0.75rem;color:var(--muted);margin-bottom:12px">⭐ ${p.rating || '5.0'} (${p.totalReview || 0}) · Terjual ${p.terjual || 0}</div>
          <button class="btn-add" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Tambah</button>
        </div>
      </div>`;
  }).join('');
}

function handleSearch(val) {
  searchQuery = val;
  renderPasarStorefront();
}

function filterBySubKategori(sub) {
  activeSubKategori = sub;
  document.querySelectorAll('#pasarFilters .pill').forEach(btn => btn.classList.remove('active'));
  const activeBtn = [...document.querySelectorAll('#pasarFilters .pill')].find(b => b.getAttribute('onclick')?.includes(`'${sub}'`));
  if (activeBtn) activeBtn.classList.add('active');
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
  }).join('') + '<option value="cod">💵 COD</option>';
}

// ============================================
// PROPERTY + GPS + JARAK (WITH IMAGE)
// ============================================
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function shareLocationProperty() {
  if (!navigator.geolocation) {
    showToast('❌ GPS tidak didukung browser Anda');
    return;
  }
  showToast('📍 Mendeteksi lokasi Anda...');
  navigator.geolocation.getCurrentPosition(pos => {
    userGpsLat = pos.coords.latitude;
    userGpsLng = pos.coords.longitude;
    showToast('✓ Lokasi terdeteksi. Properti diurutkan terdekat!');
    renderProperty();
  }, () => {
    showToast('❌ Gagal deteksi. Izinkan akses lokasi.');
  }, { enableHighAccuracy: true, timeout: 10000 });
}

function filterProperty(type) {
  activePropertyFilter = type;
  document.querySelectorAll('#cat-property .filter-pills .pill').forEach(btn => btn.classList.remove('active'));
  const activeBtn = [...document.querySelectorAll('#cat-property .filter-pills .pill')].find(b => b.getAttribute('onclick')?.includes(`'${type}'`));
  if (activeBtn) activeBtn.classList.add('active');
  renderProperty();
}

function renderProperty() {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;

  let list = liveProperties.filter(p => activePropertyFilter === 'all' || p.type === activePropertyFilter);

  if (userGpsLat !== null && userGpsLng !== null) {
    list = list.map(p => ({
      ...p,
      jarak: (p.lat && p.lng) ? haversineDistance(userGpsLat, userGpsLng, p.lat, p.lng) : null
    })).sort((a, b) => (a.jarak ?? 999) - (b.jarak ?? 999));
  }

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 0"><span style="font-size:3rem">🏘️</span><p style="color:var(--muted);margin-top:10px">Belum ada properti untuk filter ini.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const kontak = p.kontakPemilik || CS_WA;
    const teks = encodeURIComponent(`Halo, saya berminat properti: "${p.title}" di ${p.loc}. Bisa info detail?`);
    const jarakLabel = (p.jarak !== null && p.jarak !== undefined) ? `<div style="font-size:0.78rem;color:var(--property);font-weight:700;margin-top:6px"><i class="fas fa-route"></i> ${p.jarak.toFixed(2)} km dari lokasi Anda</div>` : '';
    return `
      <div class="property-card">
        <div class="property-img">
          <img src="${safeImg(p.image, 'property')}" alt="${p.title}" loading="lazy" onerror="this.src='${FALLBACK_IMG.property}'">
          <span class="property-status">${p.status}</span>
        </div>
        <div class="property-info">
          <div class="property-type">${p.typeName || p.type}</div>
          <div class="property-title">${p.title}</div>
          <div class="property-loc"><i class="fas fa-map-marker-alt"></i> ${p.loc}</div>
          ${jarakLabel}
          <div class="property-price">${p.price}</div>
          <div class="property-features">${p.features.map(f => `<span><i class="fas fa-check-circle"></i> ${f}</span>`).join('')}</div>
          <a href="https://wa.me/${kontak}?text=${teks}" target="_blank" class="btn-property"><i class="fab fa-whatsapp"></i> Hubungi ${p.pemilik || 'Pemilik'}</a>
        </div>
      </div>`;
  }).join('');
}

// ============================================
// PENDIDIKAN SALAF (WITH IMAGE)
// ============================================
function filterEdu(type) {
  activeEduFilter = type;
  document.querySelectorAll('#cat-pendidikan .filter-pills .pill').forEach(btn => btn.classList.remove('active'));
  const activeBtn = [...document.querySelectorAll('#cat-pendidikan .filter-pills .pill')].find(b => b.getAttribute('onclick')?.includes(`'${type}'`));
  if (activeBtn) activeBtn.classList.add('active');
  renderEdu();
}

function renderEdu() {
  const grid = document.getElementById('eduGrid');
  if (!grid) return;

  const list = liveEducations.filter(e => activeEduFilter === 'all' || e.type === activeEduFilter);

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 0"><span style="font-size:3rem">🎓</span><p style="color:var(--muted);margin-top:10px">Belum ada lembaga untuk kategori ini.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(e => {
    const kontak = e.kontak || CS_WA;
    const teks = encodeURIComponent(`Assalamu'alaikum, saya berminat mendaftar / info mengenai "${e.name}" (${e.typeName || e.type}). Mohon detailnya.`);
    return `
      <div class="edu-card">
        <div class="edu-icon">
          <img src="${safeImg(e.image, 'edu')}" alt="${e.name}" loading="lazy" onerror="this.src='${FALLBACK_IMG.edu}'">
        </div>
        <div class="edu-info">
          <div class="edu-type">${e.typeName || e.type}</div>
          <div class="edu-name">${e.name}</div>
          <div class="edu-desc">${e.desc}</div>
          ${e.biaya ? `<div style="font-size:0.78rem;color:var(--pendidikan);font-weight:700;margin-top:6px"><i class="fas fa-tag"></i> ${e.biaya}</div>` : ''}
          ${e.jadwal ? `<div style="font-size:0.75rem;color:var(--muted);margin-top:2px"><i class="fas fa-clock"></i> ${e.jadwal}</div>` : ''}
          <a href="https://wa.me/${kontak}?text=${teks}" target="_blank" class="btn-edu" style="margin-top:12px"><i class="fab fa-whatsapp"></i> Info & Pendaftaran</a>
        </div>
      </div>`;
  }).join('');
}

// ============================================
// TRAVEL UMROH — SPEC & FILTER (WITH IMAGE)
// ============================================
function bindUmrohFilters() {
  ['filterBulan','filterHarga','filterPesawat','filterHotel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
      umrohFilter.bulan = document.getElementById('filterBulan')?.value || '';
      umrohFilter.harga = document.getElementById('filterHarga')?.value || '';
      umrohFilter.pesawat = document.getElementById('filterPesawat')?.value || '';
      umrohFilter.hotel = document.getElementById('filterHotel')?.value || '';
      renderUmroh();
    });
  });
}

function renderUmroh() {
  const grid = document.getElementById('umrohGrid');
  if (!grid) return;

  let list = liveUmroh.filter(u => {
    if (umrohFilter.bulan && u.bulan !== umrohFilter.bulan) return false;
    if (umrohFilter.harga && u.hargaKategori !== umrohFilter.harga) return false;
    if (umrohFilter.pesawat && u.pesawat !== umrohFilter.pesawat) return false;
    if (umrohFilter.hotel && u.hotel !== umrohFilter.hotel) return false;
    return true;
  });

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px;background:white;border-radius:16px;border:1px solid var(--border)">
        <i class="fas fa-kaaba" style="font-size:3rem;color:var(--umroh);margin-bottom:12px"></i>
        <h3 style="font-weight:800">Tidak Ada Paket Sesuai Filter</h3>
        <p style="color:var(--muted);font-size:0.9rem;margin-bottom:16px">Kami bisa custom sesuai spesifikasi Anda. Klik di bawah untuk konsultasi.</p>
        <button onclick="konsultasiCustomUmroh()" class="btn-submit" style="background:var(--gradient-umroh);width:auto;display:inline-flex;margin:0;box-shadow:0 6px 16px var(--umroh-glow)">
          <i class="fab fa-whatsapp"></i> Konsultasi Paket Customize
        </button>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(u => {
    const hargaLabel = 'Rp ' + u.harga.toLocaleString('id-ID');
    return `
      <div class="property-card">
        <div class="property-img">
          <img src="${safeImg(u.image, 'umroh')}" alt="${u.name}" loading="lazy" onerror="this.src='${FALLBACK_IMG.umroh}'">
          <span class="property-status" style="color:var(--umroh)">${u.durasi}</span>
        </div>
        <div class="property-info">
          <div class="property-type" style="color:var(--umroh)">${u.bulanLabel}</div>
          <div class="property-title">${u.name}</div>
          <div class="property-price" style="color:var(--umroh)">${hargaLabel}</div>
          <div style="display:grid;gap:6px;font-size:0.82rem;color:var(--text-secondary);padding:10px 0;border-top:1px dashed var(--border);border-bottom:1px dashed var(--border);margin-bottom:14px">
            <div><i class="fas fa-plane" style="color:var(--umroh);width:18px"></i> <b>${u.pesawatLabel}</b></div>
            <div><i class="fas fa-hotel" style="color:var(--umroh);width:18px"></i> Makkah: <b>${u.hotelMakkah}</b></div>
            <div><i class="fas fa-mosque" style="color:var(--umroh);width:18px"></i> Madinah: <b>${u.hotelMadinah}</b></div>
          </div>
          <div class="property-features" style="border:none;padding:0;margin-bottom:14px">
            ${u.fasilitas.map(f => `<span><i class="fas fa-check-circle" style="color:var(--umroh)"></i> ${f}</span>`).join('')}
          </div>
          <button onclick="daftarUmroh('${u.id}')" class="btn-property" style="background:var(--gradient-umroh);box-shadow:0 4px 12px var(--umroh-glow)">
            <i class="fab fa-whatsapp"></i> Daftar / Info Detail
          </button>
        </div>
      </div>`;
  }).join('');
}

function daftarUmroh(id) {
  const u = liveUmroh.find(x => x.id === id);
  if (!u) return;
  const msg = `*🕋 PENDAFTARAN UMROH*\n==============================\n\n📦 *Paket:* ${u.name}\n📅 *Keberangkatan:* ${u.bulanLabel}\n⏱️ *Durasi:* ${u.durasi}\n💰 *Harga:* Rp ${u.harga.toLocaleString('id-ID')}\n\n✈️ *Pesawat:* ${u.pesawatLabel}\n🏨 *Hotel Makkah:* ${u.hotelMakkah}\n🕌 *Hotel Madinah:* ${u.hotelMadinah}\n\n✅ *Fasilitas:*\n${u.fasilitas.map(f => '- ' + f).join('\n')}\n\nMohon info detail pembayaran & jadwal manasik. 🙏`;
  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

function konsultasiCustomUmroh() {
  const b = umrohFilter.bulan || '(fleksibel)';
  const h = umrohFilter.harga || '(fleksibel)';
  const p = umrohFilter.pesawat || '(fleksibel)';
  const ht = umrohFilter.hotel || '(fleksibel)';
  const msg = `*🕋 KONSULTASI UMROH CUSTOM*\n==============================\n\nAssalamu'alaikum, saya ingin custom paket Umroh dengan preferensi:\n\n📅 Bulan: *${b}*\n💰 Range Harga: *${h}*\n✈️ Pesawat: *${p}*\n🏨 Hotel: *${ht}*\n\nMohon bantuannya untuk menyusunkan paket yang sesuai. Jazakumullah khairan. 🙏`;
  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ============================================
// WIFI ENGINE
// ============================================
function switchWifiTab(type) {
  const tabFiber = document.getElementById('btnTabFiber');
  const tabVoucher = document.getElementById('btnTabVoucher');
  const contentFiber = document.getElementById('contentWifiFiber');
  const contentVoucher = document.getElementById('contentWifiVoucher');
  if (tabFiber) tabFiber.classList.remove('active');
  if (tabVoucher) tabVoucher.classList.remove('active');
  if (contentFiber) contentFiber.style.display = 'none';
  if (contentVoucher) contentVoucher.style.display = 'none';
  if (type === 'fiber') {
    if (tabFiber) tabFiber.classList.add('active');
    if (contentFiber) contentFiber.style.display = 'block';
  } else {
    if (tabVoucher) tabVoucher.classList.add('active');
    if (contentVoucher) contentVoucher.style.display = 'block';
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
      <ul class="wifi-list">${w.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
    </div>`).join('');
}

function findCoverage(userLat, userLng) {
  const hits = [];
  liveWifiCoverage.forEach(w => {
    const d = haversineDistance(userLat, userLng, w.lat, w.lng);
    if (d <= w.radiusKm) hits.push({ ...w, jarak: d });
  });
  hits.sort((a, b) => a.jarak - b.jarak);
  return hits;
}

function setLocStatus(msg, type) {
  const el = document.getElementById('locStatus');
  if (!el) return;
  el.style.display = 'block';
  el.className = type;
  el.innerHTML = msg;
}

function shareLocationWifi() {
  const btn = document.getElementById('btnShareLoc');
  if (!btn) return;
  if (!navigator.geolocation) {
    setLocStatus('❌ Sensor GPS tidak disokong browser.', 'err');
    showManualWifiForm();
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghubungi Satelit...';
  setLocStatus('📍 Menunggu izin GPS...', 'load');

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const acc = Math.round(pos.coords.accuracy);
    if (document.getElementById('wifiLat')) document.getElementById('wifiLat').value = lat;
    if (document.getElementById('wifiLng')) document.getElementById('wifiLng').value = lng;
    setLocStatus(`✅ Lokasi teridentifikasi (Akurasi: ±${acc}m)`, 'ok');
    const hits = findCoverage(lat, lng);
    renderCoverageResult(hits);
    const form = document.getElementById('wifiForm');
    if (form) form.style.display = 'block';
    fillPaketOptions(hits);
    if (hits.length > 0) {
      if (document.getElementById('wifiWilayahDetected')) document.getElementById('wifiWilayahDetected').value = hits[0].nama;
      if (document.getElementById('wifiJarak')) document.getElementById('wifiJarak').value = hits[0].jarak.toFixed(2) + ' km';
    }
    reverseGeocode(lat, lng);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-sync-alt"></i> Kalibrasi Ulang GPS';
  }, () => {
    setLocStatus('❌ GPS gagal. Isi alamat manual.', 'err');
    showManualWifiForm();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-location-arrow"></i> Coba Lagi';
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
}

function renderCoverageResult(hits) {
  const box = document.getElementById('coverageResult');
  if (!box) return;
  box.style.display = 'block';
  if (!hits.length) {
    box.innerHTML = `<div class="coverage-empty"><i class="fas fa-exclamation-triangle"></i><b>Maaf, di luar coverage saat ini.</b><br>Data akan diteruskan ke tim survei.</div>`;
    return;
  }
  box.innerHTML = `<div style="font-size:0.88rem;color:var(--muted);margin-bottom:10px;font-weight:600"><i class="fas fa-check-circle" style="color:#059669"></i> Terdeteksi coverage:</div>${hits.map(h => `<div class="coverage-card"><h4><i class="fas fa-broadcast-tower" style="color:var(--primary)"></i>${h.nama}<span style="font-size:0.72rem;margin-left:auto;color:var(--muted)">±${h.jarak.toFixed(2)} km</span></h4></div>`).join('')}`;
}

function fillPaketOptions(hits) {
  const sel = document.getElementById('wifiPaket');
  if (!sel) return;
  const map = new Map();
  if (hits.length) {
    hits.forEach(h => h.paket.forEach(p => map.set(p.name + '|' + p.price, p)));
  } else {
    liveWifiPackages.forEach(p => map.set(p.name, { name: p.name + ' ' + p.speed + ' Mbps', price: Number(p.price.replace(/\./g, '')) }));
  }
  sel.innerHTML = '<option value="">-- Pilih Paket --</option>' + [...map.values()].map(p => `<option value="${p.name} - Rp ${p.price.toLocaleString('id-ID')}">${p.name} — Rp ${p.price.toLocaleString('id-ID')}/bulan</option>`).join('');
}

function showManualWifiForm() {
  const form = document.getElementById('wifiForm');
  if (form) form.style.display = 'block';
  fillPaketOptions([]);
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`, { headers: { 'Accept-Language': 'id' } });
    const data = await res.json();
    if (data && data.display_name) {
      const el = document.getElementById('wifiAlamat');
      if (el && !el.value) el.value = data.display_name;
    }
  } catch (e) {}
}

function submitWifiCoverage(e) {
  e.preventDefault();
  const nama = document.getElementById('wifiNama')?.value.trim();
  const wa = document.getElementById('wifiWa')?.value.trim();
  const alamat = document.getElementById('wifiAlamat')?.value.trim();
  const paket = document.getElementById('wifiPaket')?.value;
  const lat = document.getElementById('wifiLat')?.value || '-';
  const lng = document.getElementById('wifiLng')?.value || '-';
  if (!nama || !wa || !alamat || !paket) { showToast('⚠️ Lengkapi seluruh isian!'); return; }
  const mapsLink = (lat !== '-') ? `https://www.google.com/maps?q=${lat},${lng}` : '-';
  const msg = `*📡 REGISTRASI WIFI RUMAH*\n\n👤 ${nama}\n📱 ${wa}\n📦 ${paket}\n📍 ${alamat}\n🗺️ ${mapsLink}`;
  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('✓ Pendaftaran terkirim!');
  e.target.reset();
}

function renderWifiVouchers() {
  const grid = document.getElementById('voucherGrid');
  if (!grid) return;
  if (liveWifiVouchers.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px 0;color:var(--muted)">Belum ada voucher.</div>`;
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
        <div class="v-agen-price">Harga Agen: <b>Rp ${v.hargaAgen.toLocaleString('id-ID')}</b></div>
        <button class="btn-buy-voucher" onclick="beliVoucherWA(${v.hari}, ${v.hargaUser})"><i class="fab fa-whatsapp" style="color:#25D366"></i> Beli via WhatsApp</button>
      </div>
    </div>`).join('');
}

function beliVoucherWA(hari, harga) {
  const msg = `*🎫 BELI VOUCHER HOTSPOT*\n\nMasa Aktif: *${hari} Hari*\nHarga: *Rp ${harga.toLocaleString('id-ID')}*\n\nMohon instruksi pembayaran. Terima kasih!`;
  window.open(`https://wa.me/${CS_WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ============================================
// CART SYSTEM (WITH IMAGE)
// ============================================
let cart = [];

function loadCartFromStorage() {
  const saved = localStorage.getItem('pw_cart');
  if (saved) { try { cart = JSON.parse(saved); } catch (e) { cart = []; } }
}
function saveCartToStorage() { localStorage.setItem('pw_cart', JSON.stringify(cart)); }

function addToCart(id) {
  const product = liveProducts.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ 
    id: product.id, 
    nama: product.nama, 
    sellerName: product.sellerName, 
    sellerId: product.sellerId || product.sellerName, 
    image: product.image, 
    emoji: product.emoji, 
    harga: product.harga, 
    qty: 1 
  });
  saveCartToStorage();
  updateCartUI();
  showToast(`✓ ${product.nama} ditambahkan!`);
}

function removeFromCart(id) { cart = cart.filter(c => c.id !== id); saveCartToStorage(); updateCartUI(); }

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCartToStorage(); updateCartUI(); }
}

function updateCartUI() {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + (c.harga * c.qty), 0);
  const badgeEl = document.getElementById('cartBadge');
  if (badgeEl) badgeEl.textContent = totalItems;
  const elCount = document.getElementById('cartItemCount');
  const elSub = document.getElementById('cartSubtotal');
  const elTotal = document.getElementById('cartTotal');
  const btnGo = document.getElementById('btnGoCheckout');
  if (elCount) elCount.textContent = totalItems;
  if (elSub) elSub.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
  if (elTotal) elTotal.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
  if (btnGo) btnGo.disabled = (cart.length === 0);

  const cartBody = document.getElementById('cartBody');
  if (!cartBody) return;
  if (cart.length === 0) {
    cartBody.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-basket"></i><p>Keranjang kosong</p></div>`;
    return;
  }
  cartBody.innerHTML = cart.map(c => {
    const imgHtml = c.image ? 
      `<img src="${c.image}" alt="${c.nama}" style="width:100%;height:100%;object-fit:cover;border-radius:14px" onerror="this.src='${FALLBACK_IMG.food}'">` :
      c.emoji;
    return `
      <div class="cart-item">
        <div class="cart-item-img" style="overflow:hidden">${imgHtml}</div>
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
      </div>`;
  }).join('');
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('show');
  document.body.classList.add('cart-open');
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('show');
  document.body.classList.remove('cart-open');
}
function goToCheckout() {
  if (cart.length === 0) { showToast('⚠️ Keranjang kosong!'); return; }
  saveCartToStorage();
  window.location.href = 'checkout.html';
}

// ============================================
// NAVIGATION
// ============================================
function showCategory(cat) {
  document.querySelectorAll('.cat-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`cat-${cat}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.desktop-nav .d-nav-item').forEach(m => m.classList.remove('active'));
  document.querySelector(`.desktop-nav .d-nav-item[onclick*="'${cat}'"]`)?.classList.add('active');

  document.querySelectorAll('.mobile-bottom-nav .m-nav-item').forEach(m => m.classList.remove('active'));
  document.querySelector(`.mobile-bottom-nav .m-nav-item[data-target="${cat}"]`)?.classList.add('active');

  const offset = window.innerWidth > 768 ? 100 : 120;
  const targetEl = document.getElementById('contentArea');
  if (targetEl) {
    const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
}

// ============================================
// TOAST
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