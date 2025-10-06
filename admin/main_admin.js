document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
});

// Variabel global untuk elemen utama
let sidebar;
let overlay;
let mainContent; // Konten utama yang harus bergeser

function loadSidebar() {
  const sidebarPath = './sidebar_template.html';
  const sidebarContainer = document.getElementById('sidebar-container');
  
  // Ambil elemen konten utama (perlu ID baru di dashboard_admin.html)
  mainContent = document.getElementById('main-content-wrapper'); 

  if (!sidebarContainer || !mainContent) {
    console.error('Container sidebar atau main content tidak ditemukan.');
    return;
  }

  fetch(sidebarPath)
    .then(res => res.text())
    .then(html => {
      sidebarContainer.innerHTML = html;
      setTimeout(() => initializeSidebarFunctionality(sidebarContainer), 100);
    })
    .catch(err => console.error('Sidebar gagal dimuat:', err));
}

function initializeSidebarFunctionality(container) {
  sidebar = container.querySelector('#sidebar');
  const toggleButton = document.getElementById('sidebar-toggle');
  overlay = document.getElementById('sidebar-overlay');
  
  if (!sidebar || !toggleButton || !overlay) return;

  // 1. Tentukan status awal sidebar (sembunyikan di HP, tampilkan di desktop)
  const isDesktop = window.innerWidth >= 768; // Tailwind md: breakpoint
  
  if (!isDesktop) {
    // Mode HP/Tablet: Sembunyikan sidebar
    sidebar.classList.add('-translate-x-full');
    mainContent.classList.remove('md:ml-64'); // Pastikan tidak ada margin di awal
  } else {
    // Mode Desktop: Tampilkan sidebar secara default
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.add('hidden');
    mainContent.classList.add('md:ml-64'); // Berikan margin untuk konten utama
  }

  // 2. Event Listener untuk Toggle
  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Toggle class di sidebar dan overlay
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');

    // Toggle class untuk menggeser konten utama di desktop
    if (window.innerWidth >= 768) {
        mainContent.classList.toggle('md:ml-64');
    }
  });

  // 3. Tutup saat klik overlay (hanya berlaku untuk mode HP/tablet)
  overlay.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  });

  // 4. Handle resize (memastikan tampilan konsisten saat orientasi/ukuran berubah)
  window.addEventListener('resize', () => {
    const newIsDesktop = window.innerWidth >= 768;
    
    if (newIsDesktop) {
      // Di desktop, sidebar harus terlihat dan konten bergeser
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.add('hidden');
      mainContent.classList.add('md:ml-64');
    } else {
      // Di HP, sidebar harus disembunyikan dan konten tidak bergeser
      sidebar.classList.add('-translate-x-full');
      mainContent.classList.remove('md:ml-64');
    }
  });
}
