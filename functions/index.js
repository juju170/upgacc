const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Lama waktu (30 hari dalam milidetik)
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

exports.cleanupStaleAdmins = functions.pubsub
  .schedule('every 24 hours') // jalan otomatis setiap hari
  .onRun(async () => {
    const now = Date.now();
    const cutoffTimestamp = admin.firestore.Timestamp.fromMillis(now - THIRTY_DAYS_MS);

    // Ambil semua sekolah (admin)
    const schoolSnap = await db.collection('sekolah').get();
    if (schoolSnap.empty) {
      console.log('Tidak ada admin/sekolah ditemukan.');
      return null;
    }

    for (const schoolDoc of schoolSnap.docs) {
      const schoolData = schoolDoc.data();
      const adminId = schoolDoc.id;

      // Lewati jika belum punya field createdAt
      if (!schoolData.createdAt) {
        console.log(`Lewati admin ${adminId} karena tidak ada createdAt`);
        continue;
      }

      // Cek apakah dokumen terlalu lama (lebih dari 30 hari)
      if (schoolData.createdAt.toMillis() <= cutoffTimestamp.toMillis()) {
        console.log(`Cek guru untuk admin ${adminId}`);

        // Cek apakah ada guru yang terhubung ke sekolah ini
        const guruSnap = await db.collection('guru')
          .where('id_sekolah', '==', adminId)
          .limit(1)
          .get();

        if (guruSnap.empty) {
          console.log(`Admin ${adminId} dianggap fiktif. Hapus akun & data.`);
          
          // Hapus akun Auth
          try {
            await auth.deleteUser(adminId);
            console.log(`Akun auth ${adminId} dihapus`);
          } catch (err) {
            console.error(`Gagal hapus auth ${adminId}:`, err.message);
          }

          // Hapus dokumen sekolah
          try {
            await db.collection('sekolah').doc(adminId).delete();
            console.log(`Dokumen sekolah ${adminId} dihapus`);
          } catch (err) {
            console.error(`Gagal hapus dokumen sekolah ${adminId}:`, err.message);
          }
        } else {
          console.log(`Admin ${adminId} aktif (ada guru)`);
        }
      }
    }

    return null;
  });
