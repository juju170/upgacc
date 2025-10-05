document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
});

function loadSidebar() {
  const sidebarPath = './sidebar_template.html';
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;

  fetch(sidebarPath)
    .then(res => res.text())
    .then(html => {
      sidebarContainer.innerHTML = html;
      setTimeout(() => initializeSidebarFunctionality(sidebarContainer), 100);
    })
    .catch(err => console.error('Sidebar gagal dimuat:', err));
}

function initializeSidebarFunctionality(container) {
  const sidebar = container.querySelector('#sidebar');
  const toggleButton = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !toggleButton) return;

  sidebar.classList.add('-translate-x-full'); // tersembunyi di awal
  toggleButton.style.position = 'relative';
  toggleButton.style.zIndex = '60';

  // Buka / tutup sidebar
  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  });

  // Tutup saat klik overlay
  overlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });
}
