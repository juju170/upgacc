// Event listener ini akan memastikan skrip berjalan setelah seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Path ke file sidebar Anda.
    const sidebarPath = 'admin/_sidebar_admin.html';
    // ID dari elemen container tempat sidebar akan dimuat.
    const sidebarContainerId = 'sidebar-container';

    const sidebarContainer = document.getElementById(sidebarContainerId);

    // Jika container tidak ditemukan, hentikan eksekusi untuk menghindari error.
    if (!sidebarContainer) {
        console.error(`Elemen dengan ID '${sidebarContainerId}' tidak ditemukan.`);
        return;
    }

    // Gunakan 'fetch' untuk mengambil konten dari _sidebar_admin.html
    fetch(sidebarPath)
        .then(response => {
            // Cek jika request berhasil
            if (!response.ok) {
                throw new Error(`Gagal memuat sidebar: ${response.statusText}`);
            }
            return response.text(); // Ambil konten sebagai teks
        })
        .then(html => {
            // Masukkan konten HTML sidebar ke dalam container
            sidebarContainer.innerHTML = html;

            // Logika untuk menandai link aktif
            setActiveLink();
        })
        .catch(error => {
            console.error('Error saat memuat sidebar:', error);
            sidebarContainer.innerHTML = '<p class="p-4 text-red-400">Gagal memuat sidebar.</p>';
        });

    function setActiveLink() {
        // Dapatkan path halaman saat ini, contoh: "/admin/data_siswa.html"
        const currentPagePath = window.location.pathname;
        // Dapatkan nama file dari path, contoh: "data_siswa.html"
        const currentPage = currentPagePath.split('/').pop();

        // Cari semua link (<a>) di dalam sidebar yang baru dimuat
        const sidebarLinks = sidebarContainer.querySelectorAll('nav a');

        sidebarLinks.forEach(link => {
            // Dapatkan href dari link dan ambil nama filenya saja
            const linkPage = link.getAttribute('href').split('/').pop();

            // Bandingkan nama file halaman saat ini dengan nama file dari link
            if (linkPage === currentPage) {
                // Jika cocok, tambahkan class untuk menandai sebagai aktif
                link.classList.add('bg-indigo-800', 'text-white');
                // Hapus class default agar tidak bentrok
                link.classList.remove('text-indigo-200', 'hover:bg-indigo-700');
            }
        });
    }
});
