/**
 * File ini mengontrol semua logika utama untuk panel admin.
 * VERSI GABUNGAN: Mempertahankan struktur asli dan menambahkan fungsionalitas
 * spesifik untuk halaman manajemen siswa.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Memuat sidebar (fungsi ini dipertahankan dari kode asli Anda)
    loadSidebar();

    // 2. Menginisialisasi fungsionalitas spesifik untuk halaman data siswa
    initializeStudentPageLogic();
    
    // Catatan: Fungsi initializeModals() lama Anda sekarang digantikan oleh
    // initializeStudentPageLogic() yang lebih canggih, namun tetap aman 
    // dijalankan di halaman lain karena memiliki pengecekan.
});

// =========================================================================
// BAGIAN 1: FUNGSI SIDEBAR (DARI KODE ASLI ANDA + SEDIKIT PENYEMPURNAAN)
// =========================================================================

/**
 * Memuat sidebar_template.html secara dinamis.
 */
function loadSidebar() {
    const sidebarPath = 'sidebar_template.html'; 
    const sidebarContainer = document.getElementById('sidebar-container');

    if (!sidebarContainer) return;

    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) throw new Error(`Gagal memuat sidebar: ${response.status}`);
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            // Panggil fungsi inisialisasi setelah sidebar berhasil dimuat
            initializeSidebarFunctionality(sidebarContainer);
            setActiveLink(sidebarContainer);
        })
        .catch(error => {
            console.error('Error saat memuat sidebar:', error);
            sidebarContainer.innerHTML = `<div class="p-4 text-sm text-red-100 bg-red-700"><strong>Error:</strong> Gagal memuat sidebar.</div>`;
        });
}

/**
 * Menginisialisasi tombol toggle untuk sidebar.
 * PENYEMPURNAAN: Menggunakan class 'translate-x' untuk animasi slide yang lebih halus.
 */
function initializeSidebarFunctionality(container) {
    const sidebar = container.querySelector('#sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');
    
    if (!sidebar || !toggleButton) {
        console.error('Elemen #sidebar atau #sidebar-toggle tidak ditemukan.');
        return;
    }

    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('-translate-x-full');
    });
}

/**
 * Menandai link sidebar yang aktif sesuai halaman saat ini.
 * (Fungsi ini sama persis dengan kode asli Anda)
 */
function setActiveLink(container) {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = container.querySelectorAll('nav a');
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('bg-indigo-800', 'text-white');
            link.classList.remove('text-indigo-200', 'hover:bg-indigo-700', 'hover:bg-indigo-600');
        }
    });
}


// =========================================================================
// BAGIAN 2: LOGIKA SPESIFIK HALAMAN DATA SISWA (FITUR BARU)
// =========================================================================

/**
 * Menginisialisasi semua event listener dan logika untuk modal 
 * di halaman data siswa. Fungsi ini aman karena akan berhenti 
 * jika elemen-elemen spesifik tidak ditemukan.
 */
function initializeStudentPageLogic() {
    const studentModal = document.getElementById('student-modal');
    // Guard clause: Jika modal siswa tidak ada, berarti kita tidak di halaman data_siswa.html,
    // maka hentikan eksekusi fungsi ini agar tidak error di halaman lain.
    if (!studentModal) {
        return; 
    }

    // Ambil semua elemen yang dibutuhkan
    const deleteModal = document.getElementById('delete-modal');
    const modalTitle = document.getElementById('modal-title');
    const studentForm = document.getElementById('student-form');
    const studentIdInput = document.getElementById('student-id');
    const addStudentBtn = document.getElementById('add-student-btn');

    // Fungsi helper untuk buka/tutup modal dengan animasi
    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.modal-content')?.classList.remove('scale-95');
        }, 10);
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.add('opacity-0');
        modal.querySelector('.modal-content')?.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 250);
    };

    // Event listener untuk tombol "Tambah Siswa"
    addStudentBtn.addEventListener('click', () => {
        studentForm.reset();
        studentIdInput.value = '';
        modalTitle.textContent = 'Tambah Data Siswa Baru';
        openModal(studentModal);
    });

    // Event listener untuk semua tombol "Edit"
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            modalTitle.textContent = 'Edit Data Siswa';
            studentIdInput.value = row.dataset.id;
            studentForm.querySelector('#nis').value = row.dataset.nis;
            studentForm.querySelector('#nama').value = row.dataset.nama;
            studentForm.querySelector('#kelas').value = row.dataset.kelas;
            studentForm.querySelector('#email').value = row.dataset.email;
            openModal(studentModal);
        });
    });
    
    // Event listener untuk semua tombol "Hapus"
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const studentId = row.dataset.id;
            const confirmDeleteBtn = deleteModal.querySelector('#confirm-delete-btn');
            confirmDeleteBtn.dataset.id = studentId; // Simpan ID di tombol konfirmasi
            openModal(deleteModal);
        });
    });

    // Event listener untuk form submission (tambah/edit)
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const studentId = studentIdInput.value;
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        if (studentId) {
            console.log('Dummy Action: Memperbarui data siswa...', data);
        } else {
            console.log('Dummy Action: Menambah siswa baru...', data);
        }
        alert('Aksi berhasil! (Lihat data di console log)');
        closeModal(studentModal);
    });

    // Event listener untuk tombol konfirmasi hapus
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    confirmDeleteBtn.addEventListener('click', function() {
        const studentId = this.dataset.id;
        console.log(`Dummy Action: Menghapus siswa dengan ID: ${studentId}`);
        alert('Aksi hapus berhasil! (Lihat ID di console log)');
        closeModal(deleteModal);
    });

    // Event listener untuk menutup semua modal
    document.querySelectorAll('.modal-cancel, .modal-close').forEach(button => {
        button.addEventListener('click', () => closeModal(button.closest('.modal')));
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal(modal);
        });
    });
}
