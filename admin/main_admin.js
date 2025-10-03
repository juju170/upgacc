/**
 * File ini mengontrol semua logika utama untuk panel admin,
 * termasuk memuat sidebar, fungsionalitas tombol, dan manajemen modal.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Memuat sidebar dan fungsionalitasnya
    loadSidebar();

    // Menginisialisasi semua modal di halaman
    initializeModals();
});

/**
 * Fungsi untuk memuat sidebar secara dinamis dan menginisialisasi fungsinya.
 */
function loadSidebar() {
    const sidebarPath = 'https://github.com/juju170/upgacc/blob/3f8a3c48c38bab1a4946efdf90770c1b7bb5822e/admin/_sidebar_admin.html';
    const sidebarContainer = document.getElementById('sidebar-container');
    const sidebarToggleButton = document.getElementById('sidebar-toggle');

    if (!sidebarContainer || !sidebarToggleButton) {
        console.error('PENTING: Pastikan ada elemen dengan id="sidebar-container" dan id="sidebar-toggle" di file HTML Anda.');
        return;
    }

    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) throw new Error(`Gagal memuat file dari path: ${sidebarPath}. Status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            initializeSidebarFunctionality(sidebarContainer, sidebarToggleButton);
            setActiveLink(sidebarContainer);
        })
        .catch(error => {
            console.error('Error saat memuat sidebar:', error);
            sidebarContainer.innerHTML = `<div class="p-4 text-sm text-red-500 bg-red-100">Error: ${error.message}. Periksa path.</div>`;
        });
}

/**
 * Menginisialisasi fungsionalitas sidebar (tombol toggle) setelah sidebar berhasil dimuat.
 * @param {HTMLElement} container - Elemen div yang berisi sidebar.
 * @param {HTMLElement} toggleButton - Tombol burger untuk tampilan mobile.
 */
function initializeSidebarFunctionality(container, toggleButton) {
    const sidebar = container.querySelector('#sidebar');
    if (!sidebar) {
        console.error('Elemen #sidebar tidak ditemukan di dalam file _sidebar_admin.html');
        return;
    }
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

/**
 * Menandai link navigasi yang sedang aktif di sidebar sesuai dengan halaman yang dibuka.
 * @param {HTMLElement} container - Elemen div yang berisi sidebar.
 */
function setActiveLink(container) {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = container.querySelectorAll('nav a');
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('bg-indigo-800', 'text-white');
            link.classList.remove('text-indigo-200', 'hover:bg-indigo-700');
        }
    });
}

/**
 * Menginisialisasi semua fungsionalitas modal di halaman (buka/tutup).
 */
function initializeModals() {
    const allModals = document.querySelectorAll('.modal');
    if (allModals.length === 0) return; // Jika tidak ada modal di halaman ini, hentikan fungsi.

    const openModal = (modal) => modal.classList.remove('hidden');
    const closeModal = (modal) => modal.classList.add('hidden');

    // Menambahkan fungsionalitas untuk semua tombol yang bisa membuka modal
    const modalTriggers = {
        'add-student-btn': 'student-modal', // Untuk data_siswa.html
        'add-teacher-btn': 'form-modal',    // Untuk data_guru.html
        'add-class-btn': 'form-modal',      // Untuk data_kelas.html
        'add-btn': 'form-modal'             // Untuk data_program.html dan data_berita.html
    };

    for (const [btnId, modalId] of Object.entries(modalTriggers)) {
        const triggerBtn = document.getElementById(btnId);
        const targetModal = document.getElementById(modalId);
        if (triggerBtn && targetModal) {
            triggerBtn.addEventListener('click', () => openModal(targetModal));
        }
    }

    // Menangani tombol aksi umum di dalam tabel (edit, hapus, detail)
    document.querySelectorAll('.edit-btn').forEach(btn => {
        const modal = document.getElementById('form-modal') || document.getElementById('student-modal');
        if (modal) btn.addEventListener('click', () => openModal(modal));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        const modal = document.getElementById('delete-modal');
        if (modal) btn.addEventListener('click', () => openModal(modal));
    });
    
    document.querySelectorAll('.detail-btn').forEach(btn => {
        const modal = document.getElementById('detail-modal');
        if (modal) btn.addEventListener('click', () => openModal(modal));
    });

    // Menangani semua cara untuk menutup modal
    allModals.forEach(modal => {
        // Klik tombol 'batal' atau 'x'
        modal.querySelectorAll('.modal-cancel, .modal-close').forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });
        // Klik di luar area modal
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
}
