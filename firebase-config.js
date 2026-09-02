/* ========================================================
   PORTALWARGA — FIREBASE LIVE SYNC ENGINE
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

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 1. Sinkronisasi Real-time Pasar
function syncPasar() {
  db.collection('pasar').onSnapshot(snapshot => {
    if (!snapshot.empty) {
      dataPasar = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.id - b.id);
      renderPasar();
    }
  }, err => console.warn('Sync Pasar fallback to local data:', err));
}

// 2. Sinkronisasi Real-time Property
function syncProperty() {
  db.collection('property').onSnapshot(snapshot => {
    if (!snapshot.empty) {
      dataProperty = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.id - b.id);
      renderProperty();
    }
  }, err => console.warn('Sync Property fallback to local data:', err));
}

// 3. Sinkronisasi Real-time Pendidikan
function syncPendidikan() {
  db.collection('pendidikan').onSnapshot(snapshot => {
    if (!snapshot.empty) {
      dataPendidikan = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.id - b.id);
      renderEdu();
    }
  }, err => console.warn('Sync Edu fallback to local data:', err));
}

// 4. Sinkronisasi Real-time WiFi
function syncWifi() {
  db.collection('wifi_paket').onSnapshot(snapshot => {
    if (!snapshot.empty) {
      dataWifi = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.id - b.id);
      renderWifi();
    }
  }, err => console.warn('Sync WiFi fallback to local data:', err));
}

// 5. Simpan Data Pendaftaran WiFi Masuk
async function recordWifiRegistration(nama, wa, alamat, paket) {
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
    console.warn('Gagal menyimpan pendaftaran:', e);
  }
}

// 6. Simpan Data Order Belanja Masuk
async function recordOrder(items, total) {
  try {
    await db.collection('pesanan').add({
      items: items.map(c => ({
        nama: c.name,
        vendor: c.vendor,
        qty: c.qty,
        harga: c.price,
        subtotal: c.price * c.qty
      })),
      total,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Pesanan tersimpan ke Firestore');
  } catch (e) {
    console.warn('Gagal menyimpan pesanan:', e);
  }
}

// Jalankan sinkronisasi saat web dimuat
document.addEventListener('DOMContentLoaded', () => {
  syncPasar();
  syncProperty();
  syncPendidikan();
  syncWifi();
});