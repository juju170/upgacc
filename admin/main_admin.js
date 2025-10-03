/**
 * File ini mengontrol semua logika utama untuk panel admin.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
    initializeModals();
});

/**
 * Fungsi untuk memuat sidebar secara dinamis dan menginisialisasi fungsinya.
 */
function loadSidebar() {
    // --- PERUBAHAN DI SINI ---
    // Mengubah path ke nama file yang baru dan lebih aman.
    const sidebarPath = './sidebar_template.html'; 
    
    const sidebarContainer = document.getElementById('sidebar-container');
    const sidebarToggleButton = document.getElementById('sidebar-toggle');

    if (!sidebarContainer || !sidebarToggleButton) {
        console.error('PENTING: Pastikan ada elemen dengan id="sidebar-container" dan id="sidebar-toggle" di file HTML Anda.');
        return;
    }

    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) {
                // Memberikan pesan error yang lebih spesifik jika file tidak ditemukan.
                throw new Error(`Gagal memuat file dari path: ${sidebarPath}. Status: ${response.status}. Periksa apakah nama file dan lokasinya sudah benar.`);
            }
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            initializeSidebarFunctionality(sidebarContainer, sidebarToggleButton);
            setActiveLink(sidebarContainer);
        })
        .catch(error => {
            console.error('Error saat memuat sidebar:', error);
            sidebarContainer.innerHTML = `<div class="p-4 text-sm text-red-100 bg-red-700 rounded-md"><strong>Error:</strong> ${error.message}</div>`;
        });
}

// --- Sisa kode di bawah ini sama persis dan tidak perlu diubah ---

function initializeSidebarFunctionality(container, toggleButton) {
    const sidebar = container.querySelector('#sidebar');
    if (!sidebar) {
        console.error('Elemen #sidebar tidak ditemukan di dalam file sidebar_template.html');
        return;
    }
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

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

function initializeModals() {
    const allModals = document.querySelectorAll('.modal');
    if (allModals.length === 0) return;

    const openModal = (modal) => modal.classList.remove('hidden');
    const closeModal = (modal) => modal.classList.add('hidden');

    const modalTriggers = {
        'add-student-btn': 'student-modal',
        'add-teacher-btn': 'form-modal',
        'add-class-btn': 'form-modal',
        'add-btn': 'form-modal'
    };

    for (const [btnId, modalId] of Object.entries(modalTriggers)) {
        const triggerBtn = document.getElementById(btnId);
        const targetModal = document.getElementById(modalId);
        if (triggerBtn && targetModal) {
            triggerBtn.addEventListener('click', () => openModal(targetModal));
        }
    }

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

    allModals.forEach(modal => {
        modal.querySelectorAll('.modal-cancel, .modal-close').forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
}
