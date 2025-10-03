// Event listener ini akan memastikan skrip berjalan setelah seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Path ke file sidebar Anda.
    const sidebarPath = './_sidebar_admin.html';
    // ID dari elemen container tempat sidebar akan dimuat.
    const sidebarContainerId = 'sidebar-container';
    // ID dari tombol toggle.
    const sidebarToggleId = 'sidebar-toggle';

    const sidebarContainer = document.getElementById(sidebarContainerId);
    const sidebarToggleButton = document.getElementById(sidebarToggleId);

    // Jika container atau tombol tidak ditemukan, hentikan eksekusi.
    if (!sidebarContainer || !sidebarToggleButton) {
        console.error(`Elemen sidebar-container atau sidebar-toggle tidak ditemukan.`);
        return;
    }

    // Gunakan 'fetch' untuk mengambil konten dari _sidebar_admin.html
    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal memuat sidebar: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Masukkan konten HTML sidebar ke dalam container
            sidebarContainer.innerHTML = html;

            // --- FUNGSI BARU DITAMBAHKAN DI SINI ---
            // Setelah sidebar dimuat, tambahkan fungsionalitas pada tombol toggle.
            initializeSidebarToggle();
            
            // Logika untuk menandai link aktif juga dijalankan setelah sidebar dimuat.
            setActiveLink();
        })
        .catch(error => {
            console.error('Error saat memuat sidebar:', error);
            sidebarContainer.innerHTML = '<p class="p-4 text-red-400">Gagal memuat sidebar.</p>';
        });

    /**
     * Fungsi untuk menambahkan event listener ke tombol toggle sidebar.
     * Dijalankan SETELAH sidebar berhasil dimuat ke dalam DOM.
     */
    function initializeSidebarToggle() {
        sidebarToggleButton.addEventListener('click', () => {
            // Cari elemen sidebar di dalam container-nya.
            const sidebar = sidebarContainer.querySelector('#sidebar');
            if (sidebar) {
                sidebar.classList.toggle('hidden');
            }
        });
    }

    /**
     * Fungsi untuk menandai link navigasi yang sedang aktif.
     */
    function setActiveLink() {
        const currentPagePath = window.location.pathname;
        const currentPage = currentPagePath.split('/').pop();
        const sidebarLinks = sidebarContainer.querySelectorAll('nav a');

        sidebarLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('bg-indigo-800', 'text-white');
                link.classList.remove('text-indigo-200', 'hover:bg-indigo-700');
            }
        });
    }
});
