/**
 * File ini mengontrol semua logika utama untuk panel admin,
 * termasuk memuat sidebar, fungsionalitas tombol, dan manajemen modal.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- BAGIAN SIDEBAR ---
    loadSidebar();

    // --- BAGIAN MODAL (Logika dipindahkan ke sini agar terpusat) ---
    initializeModals();
});

/**
 * Fungsi untuk memuat sidebar secara dinamis dan menginisialisasi fungsinya.
 */
function loadSidebar() {
    const sidebarPath = './_sidebar_admin.html';
    const sidebarContainerId = 'sidebar-container';
    const sidebarToggleId = 'sidebar-toggle';

    const sidebarContainer = document.getElementById(sidebarContainerId);
    const sidebarToggleButton = document.getElementById(sidebarToggleId);

    if (!sidebarContainer || !sidebarToggleButton) {
        console.error(`PENTING: Pastikan ada elemen dengan id="${sidebarContainerId}" dan id="${sidebarToggleId}" di file HTML Anda.`);
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
 * Menginisialisasi fungsionalitas sidebar setelah dimuat.
 * @param {HTMLElement} container - Elemen container sidebar.
 * @param {HTMLElement} toggleButton - Tombol untuk membuka/menutup sidebar.
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
 * Menandai link navigasi yang sedang aktif di sidebar.
 * @param {HTMLElement} container - Elemen container sidebar.
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
 * Menginisialisasi semua fungsionalitas modal di halaman.
 */
function initializeModals() {
    const allModals = document.querySelectorAll('.modal');
    if (allModals.length === 0) return; // Jika tidak ada modal, hentikan

    const openModal = (modal) => modal.classList.remove('hidden');
    const closeModal = (modal) => modal.classList.add('hidden');

    // Umum: Tombol batal atau 'X' untuk menutup modal
    document.querySelectorAll('.modal-cancel, .modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalToClose = btn.closest('.modal');
            if(modalToClose) closeModal(modalToClose);
        });
    });

    // Umum: Klik di luar area modal untuk menutup
    allModals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Logika spesifik per tombol pembuka modal
    const modalTriggers = {
        'add-student-btn': 'student-modal',
        'add-teacher-btn': 'form-modal', // di data_guru
        'add-class-btn': 'form-modal', // di data_kelas
    };

    for (const [btnId, modalId] of Object.entries(modalTriggers)) {
        const triggerBtn = document.getElementById(btnId);
        const targetModal = document.getElementById(modalId);
        if (triggerBtn && targetModal) {
            triggerBtn.addEventListener('click', () => openModal(targetModal));
        }
    }

    // Tombol-tombol aksi dalam tabel (edit, hapus, detail)
    document.querySelectorAll('.edit-btn').forEach(btn => {
        const modal = document.getElementById('student-modal') || document.getElementById('form-modal');
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
}
