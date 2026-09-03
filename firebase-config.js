/* ========================================================
   PORTALWARGA — FIREBASE CONFIG & HELPER ENGINE v3.1
   Project: portalwarga-963e4
   ======================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyB7scF94Mi9VChS1q81L_0qlM9j8qNecgI",
  authDomain: "portalwarga-963e4.firebaseapp.com",
  projectId: "portalwarga-963e4",
  storageBucket: "portalwarga-963e4.firebasestorage.app",
  messagingSenderId: "655923017032",
  appId: "1:655923017032:web:4484b33b72829460192f7d",
  measurementId: "G-ZDV26D8SGM"
};

// Inisialisasi Firebase secara aman tanpa membuat Crash App
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Gunakan var/global db agar tidak terjadi "SyntaxError: db already declared"
var db = firebase.firestore();

// ============================================
// HELPER FUNCTIONS (TRANSAKSI FIRESTORE)
// ============================================

// 1. Simpan Data Pendaftaran WiFi Masuk
async function recordWifiRegistration(nama, wa, alamat, paket) {
  if (!db) return;
  try {
    await db.collection('pendaftaran_wifi').add({
      nama,
      whatsapp: wa,
      alamat,
      paket,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Data pendaftaran WiFi tersimpan ke Firestore');
  } catch (e) {
    console.warn('Gagal menyimpan pendaftaran WiFi:', e);
  }
}

// 2. Simpan Data Order Belanja Masuk
async function recordOrder(items, total) {
  if (!db) return;
  try {
    await db.collection('pesanan').add({
      items: items.map(c => ({
        id: c.id,
        nama: c.nama || c.name,
        vendor: c.sellerName || c.vendor,
        qty: c.qty,
        harga: c.harga || c.price,
        subtotal: (c.harga || c.price) * c.qty
      })),
      total: total,
      status: "Pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Pesanan tersimpan ke Firestore');
  } catch (e) {
    console.warn('Gagal menyimpan pesanan:', e);
  }
}