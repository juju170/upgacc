document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  initializeStudentPageLogic();
});

// ===============================
// 🔹 SIDEBAR DYNAMIC SYSTEM
// ===============================
function loadSidebar() {
  const sidebarPath = './sidebar_template.html';
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;

  fetch(sidebarPath)
    .then(r => {
      if (!r.ok) throw new Error(`Gagal memuat sidebar: ${r.status}`);
      return r.text();
    })
    .then(html => {
      sidebarContainer.innerHTML = html;
      requestAnimationFrame(() => {
        waitForElement('#sidebar-toggle', () => {
          initializeSidebarFunctionality(sidebarContainer);
          setActiveLink(sidebarContainer);
        });
      });
    })
    .catch(err => {
      console.error('Error sidebar:', err);
      sidebarContainer.innerHTML = `<div class="p-4 text-sm text-red-100 bg-red-700">Error: Sidebar gagal dimuat.</div>`;
    });
}

function waitForElement(selector, callback, interval = 100, timeout = 5000) {
  const start = Date.now();
  const timer = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      clearInterval(timer);
      callback(el);
    } else if (Date.now() - start > timeout) {
      clearInterval(timer);
      console.warn(`Timeout: elemen ${selector} tidak ditemukan.`);
    }
  }, interval);
}

function initializeSidebarFunctionality(container) {
  const sidebar = container.querySelector('#sidebar');
  const toggleButton = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !toggleButton) return;

  // Sidebar hidden by default in mobile
  sidebar.classList.add('-translate-x-full');

  // Toggle sidebar
  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  });

  // Click outside closes sidebar
  overlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 &&
        !sidebar.contains(e.target) &&
        !toggleButton.contains(e.target)) {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.add('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
    }
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

// ===============================
// 🟩 MODAL LOGIC (data siswa, dll.)
// ===============================
function initializeStudentPageLogic() {
  const studentModal = document.getElementById('student-modal');
  if (!studentModal) return;

  const deleteModal = document.getElementById('delete-modal');
  const modalTitle = document.getElementById('modal-title');
  const studentForm = document.getElementById('student-form');
  const studentIdInput = document.getElementById('student-id');
  const addStudentBtn = document.getElementById('add-student-btn');

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

  addStudentBtn.addEventListener('click', () => {
    studentForm.reset();
    studentIdInput.value = '';
    modalTitle.textContent = 'Tambah Data Siswa Baru';
    openModal(studentModal);
  });

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

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const studentId = row.dataset.id;
      const confirmDeleteBtn = deleteModal.querySelector('#confirm-delete-btn');
      confirmDeleteBtn.dataset.id = studentId;
      openModal(deleteModal);
    });
  });

  studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const studentId = studentIdInput.value;
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    console.log(studentId ? 'Update siswa:' : 'Tambah siswa:', data);
    alert('Aksi berhasil!');
    closeModal(studentModal);
  });

  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  confirmDeleteBtn.addEventListener('click', function() {
    const studentId = this.dataset.id;
    console.log(`Hapus siswa ID: ${studentId}`);
    alert('Data berhasil dihapus!');
    closeModal(deleteModal);
  });

  document.querySelectorAll('.modal-cancel, .modal-close').forEach(button => {
    button.addEventListener('click', () => closeModal(button.closest('.modal')));
  });
}
