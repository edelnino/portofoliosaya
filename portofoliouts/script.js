const appDataKey = "portfolioAdminData";

const defaultData = {
  profile: {
    name: "Edward Daniel",
    subtitle: "UI/UX Designer & Frontend Developer",
    heroTitle: "Membangun website yang modern, cepat, dan fokus hasil.",
    heroDescription:
      "Portofolio ini menampilkan proyek web, branding, dan dashboard interaktif yang dirancang untuk meningkatkan engagement pengguna serta performa bisnis.",
    aboutSubtitle:
      "Saya membantu brand dan bisnis membuat pengalaman digital yang tidak hanya cantik, tetapi juga efektif.",
    aboutText:
      "Fokus utama saya adalah frontend development, desain antarmuka, dan optimasi alur pengguna agar produk digital lebih mudah digunakan.",
    photoDataUrl: "",
  },
  projects: [
    {
      id: "educourse",
      category: "web",
      title: "EduCourse Platform",
      description: "Portal pembelajaran interaktif untuk mahasiswa.",
      link: "project-educourse.html",
      imageDataUrl: "",
    },
    {
      id: "foodchain",
      category: "dashboard",
      title: "FoodChain Analytics",
      description: "Dashboard performa penjualan dan stok real-time.",
      link: "project-foodchain.html",
      imageDataUrl: "",
    },
    {
      id: "moda",
      category: "branding",
      title: "Moda Brand System",
      description: "Perancangan identitas visual untuk bisnis fashion.",
      link: "project-moda.html",
      imageDataUrl: "",
    },
    {
      id: "clinic",
      category: "web",
      title: "Clinic Booking App",
      description: "Reservasi online dengan notifikasi otomatis.",
      link: "contact.html",
      imageDataUrl: "",
    },
  ],
};

const menuBtn = document.querySelector("[data-menu-btn]");
const menu = document.querySelector("[data-menu]");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("[data-link]").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPath) {
    link.classList.add("active");
  }
});

function loadAppData() {
  const raw = localStorage.getItem(appDataKey);
  if (!raw) {
    return JSON.parse(JSON.stringify(defaultData));
  }

  try {
    const stored = JSON.parse(raw);
    return {
      profile: {
        ...defaultData.profile,
        ...(stored.profile || {}),
      },
      projects: Array.isArray(stored.projects)
        ? stored.projects
        : JSON.parse(JSON.stringify(defaultData.projects)),
    };
  } catch (error) {
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function saveAppData(data) {
  localStorage.setItem(appDataKey, JSON.stringify(data));
}

function setProfileCard(profile) {
  const profileCard = document.querySelector(".profile-card");
  if (!profileCard) return;

  const title = profileCard.querySelector("h3");
  const subtitle = profileCard.querySelector(".section-subtitle");
  const img = profileCard.querySelector("img");

  if (title) title.textContent = profile.name || defaultData.profile.name;
  if (subtitle)
    subtitle.textContent = profile.subtitle || defaultData.profile.subtitle;
  if (img) {
    img.src = profile.photoDataUrl || img.src;
    img.alt = profile.name || defaultData.profile.name;
  }
}

function applyIndexData() {
  const data = loadAppData();

  const heroTitle = document.querySelector("[data-hero-title]");
  const heroDescription = document.querySelector("[data-hero-description]");
  const profileName = document.querySelector(".profile-card h3");
  const profileSubtitle = document.querySelector(
    ".profile-card .section-subtitle",
  );
  const profileImg = document.querySelector(".profile-card img");

  if (heroTitle) heroTitle.textContent = data.profile.heroTitle;
  if (heroDescription)
    heroDescription.textContent = data.profile.heroDescription;
  if (profileName) profileName.textContent = data.profile.name;
  if (profileSubtitle) profileSubtitle.textContent = data.profile.subtitle;
  if (profileImg && data.profile.photoDataUrl) {
    profileImg.src = data.profile.photoDataUrl;
  }
}

function applyAboutData() {
  const data = loadAppData();
  const subtitle = document.querySelector("[data-about-subtitle]");
  const text = document.querySelector("[data-about-text]");

  if (subtitle) subtitle.textContent = data.profile.aboutSubtitle;
  if (text) text.textContent = data.profile.aboutText;
}

function renderProjectCards(projects) {
  const grid = document.querySelector("[data-portfolio-grid]");
  if (!grid) return;

  if (!projects.length) {
    grid.innerHTML = `<div class="panel"><p>Belum ada proyek. Tambahkan proyek melalui halaman <a href="admin.html">Admin</a>.</p></div>`;
    return;
  }

  grid.innerHTML = projects
    .map((project) => {
      const thumbStyle = project.imageDataUrl
        ? `background-image: url('${project.imageDataUrl}'); background-size: cover; background-position: center;`
        : "";

      return `
      <article class="portfolio-item" data-category="${project.category}">
        <div class="thumb" style="${thumbStyle}"></div>
        <div class="content">
          <p class="meta">${project.category}</p>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" class="btn btn-ghost">Detail</a>
        </div>
      </article>
    `;
    })
    .join("");
}

function initializePortfolioFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const portfolioCards = document.querySelectorAll("[data-category]");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      portfolioCards.forEach((card) => {
        const category = card.dataset.category;
        const show = selected === "all" || selected === category;
        card.style.display = show ? "block" : "none";
      });
    });
  });
}

function renderPortfolioPage() {
  const data = loadAppData();
  renderProjectCards(data.projects);
  initializePortfolioFilters();
}

function readImageFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function setupAdminPage() {
  const profileForm = document.querySelector("[data-admin-profile-form]");
  if (!profileForm) return;

  const adminData = loadAppData();
  const profilePhotoInput = document.querySelector(
    "[data-admin-profile-photo]",
  );
  const profilePhotoPreview = document.querySelector(
    "[data-admin-profile-preview]",
  );
  const projectsContainer = document.querySelector("[data-admin-projects]");
  const addProjectButton = document.querySelector("[data-admin-add-project]");
  const projectFormPanel = document.querySelector("[data-admin-new-project]");
  const projectForm = document.querySelector("[data-admin-project-form]");
  const projectPhotoInput = document.querySelector(
    "[data-admin-project-photo]",
  );
  const projectPhotoPreview = document.querySelector(
    "[data-admin-project-preview]",
  );
  const adminSaveButton = document.querySelector("[data-admin-save]");
  const adminFeedback = document.querySelector("[data-admin-feedback]");

  function showFeedback(message, type = "ok") {
    if (!adminFeedback) return;
    adminFeedback.textContent = message;
    adminFeedback.className = `feedback ${type}`;
  }

  function fillProfileForm() {
    profileForm.name.value = adminData.profile.name;
    profileForm.subtitle.value = adminData.profile.subtitle;
    profileForm.heroTitle.value = adminData.profile.heroTitle;
    profileForm.heroDescription.value = adminData.profile.heroDescription;
    profileForm.aboutText.value = adminData.profile.aboutText;
    profileForm.aboutSubtitle.value = adminData.profile.aboutSubtitle;

    if (adminData.profile.photoDataUrl) {
      profilePhotoPreview.src = adminData.profile.photoDataUrl;
      profilePhotoPreview.hidden = false;
    }
  }

  function renderProjectList() {
    if (!projectsContainer) return;
    if (!adminData.projects.length) {
      projectsContainer.innerHTML = `<div class="panel"><p>Belum ada proyek. Tambahkan proyek baru.</p></div>`;
      return;
    }

    projectsContainer.innerHTML = adminData.projects
      .map((project) => {
        const image = project.imageDataUrl
          ? `<img class="project-thumbnail" src="${project.imageDataUrl}" alt="${project.title}" />`
          : `<div class="project-thumbnail empty">No image</div>`;

        return `
          <article class="project-item">
            <div class="project-preview">
              ${image}
            </div>
            <div class="project-meta">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <p><strong>Kategori:</strong> ${project.category}</p>
              <p><strong>Link:</strong> <a href="${project.link}">${project.link}</a></p>
            </div>
            <div class="project-actions">
              <button class="btn btn-primary" data-action="edit" data-id="${project.id}">Edit</button>
              <button class="btn btn-ghost" data-action="delete" data-id="${project.id}">Hapus</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function updateProfileDataFromForm() {
    adminData.profile.name = profileForm.name.value.trim();
    adminData.profile.subtitle = profileForm.subtitle.value.trim();
    adminData.profile.heroTitle = profileForm.heroTitle.value.trim();
    adminData.profile.heroDescription =
      profileForm.heroDescription.value.trim();
    adminData.profile.aboutText = profileForm.aboutText.value.trim();
    adminData.profile.aboutSubtitle = profileForm.aboutSubtitle.value.trim();
  }

  function persistAdminData(message = "Perubahan berhasil disimpan.") {
    updateProfileDataFromForm();
    saveAppData(adminData);
    showFeedback(message);
  }

  function resetProjectForm() {
    projectForm.reset();
    projectForm.projectId.value = "";
    projectPhotoPreview.hidden = true;
    projectPhotoPreview.src = "";
    if (projectPhotoInput) projectPhotoInput.value = "";
  }

  function openProjectForm(project = null) {
    if (!projectFormPanel) return;
    projectFormPanel.hidden = false;
    if (project) {
      projectForm.projectId.value = project.id;
      projectForm.title.value = project.title;
      projectForm.category.value = project.category;
      projectForm.description.value = project.description;
      projectForm.link.value = project.link;
      if (project.imageDataUrl) {
        projectPhotoPreview.src = project.imageDataUrl;
        projectPhotoPreview.hidden = false;
      }
    } else {
      resetProjectForm();
    }
  }

  function closeProjectForm() {
    if (!projectFormPanel) return;
    projectFormPanel.hidden = true;
    resetProjectForm();
  }

  function findProjectById(id) {
    return adminData.projects.find((project) => project.id === id);
  }

  function generateProjectId(title) {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || Date.now().toString()
    );
  }

  fillProfileForm();
  renderProjectList();

  profilePhotoInput?.addEventListener("change", async () => {
    const file = profilePhotoInput.files?.[0];
    if (!file) return;
    const dataUrl = await readImageFile(file);
    profilePhotoPreview.src = dataUrl;
    profilePhotoPreview.hidden = false;
    adminData.profile.photoDataUrl = dataUrl;
    persistAdminData("Foto profil tersimpan otomatis.");
  });

  profileForm.addEventListener("input", () => {
    updateProfileDataFromForm();
    persistAdminData("Perubahan profil tersimpan otomatis.");
  });

  projectPhotoInput?.addEventListener("change", async () => {
    const file = projectPhotoInput.files?.[0];
    if (!file) return;
    const dataUrl = await readImageFile(file);
    projectPhotoPreview.src = dataUrl;
    projectPhotoPreview.hidden = false;
  });

  addProjectButton?.addEventListener("click", () => {
    openProjectForm();
  });

  projectForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const title = formData.get("title")?.toString().trim();
    const category = formData.get("category")?.toString().trim().toLowerCase();
    const description = formData.get("description")?.toString().trim();
    const link = formData.get("link")?.toString().trim();
    const projectId = formData.get("projectId")?.toString();
    const photoFile = projectPhotoInput?.files?.[0];

    if (!title || !category || !description || !link) {
      showFeedback("Semua field proyek wajib diisi.", "error");
      return;
    }

    let imageDataUrl = projectPhotoPreview.src || "";
    if (photoFile) {
      imageDataUrl = await readImageFile(photoFile);
    }

    if (projectId) {
      const existingProject = findProjectById(projectId);
      if (existingProject) {
        existingProject.title = title;
        existingProject.category = category;
        existingProject.description = description;
        existingProject.link = link;
        existingProject.imageDataUrl = imageDataUrl;
      }
    } else {
      adminData.projects.push({
        id: generateProjectId(title),
        category,
        title,
        description,
        link,
        imageDataUrl,
      });
    }

    renderProjectList();
    closeProjectForm();
    persistAdminData("Proyek berhasil disimpan otomatis.");
  });

  projectsContainer?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const projectId = button.dataset.id;
    if (!projectId) return;

    if (action === "edit") {
      const project = findProjectById(projectId);
      if (project) {
        openProjectForm(project);
      }
    }

    if (action === "delete") {
      adminData.projects = adminData.projects.filter(
        (project) => project.id !== projectId,
      );
      renderProjectList();
      persistAdminData("Proyek dihapus otomatis.");
    }
  });

  const cancelButton = document.querySelector("[data-admin-cancel-project]");
  cancelButton?.addEventListener("click", () => closeProjectForm());

  adminSaveButton?.addEventListener("click", () => {
    persistAdminData("Semua perubahan berhasil disimpan ke browser.");
  });
}

applyIndexData();
applyAboutData();
renderPortfolioPage();
setupAdminPage();

const contactForm = document.querySelector("[data-contact-form]");
const feedback = document.querySelector("[data-feedback]");
const photoInput = document.querySelector("[data-photo-input]");
const photoPreview = document.querySelector("[data-photo-preview]");

if (photoInput && photoPreview) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file) {
      photoPreview.hidden = true;
      photoPreview.src = "";
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    const isImage = file.type.startsWith("image/");
    if (!isImage || file.size > maxSizeInBytes) {
      photoPreview.hidden = true;
      photoPreview.src = "";
      photoInput.value = "";
      if (feedback) {
        feedback.textContent =
          "Foto harus berupa gambar (JPG/PNG/WEBP) dengan ukuran maksimal 2MB.";
        feedback.className = "feedback error";
      }
      return;
    }

    photoPreview.src = URL.createObjectURL(file);
    photoPreview.hidden = false;
  });
}

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const photo = formData.get("photo");
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
    const hasPhoto = photo instanceof File && photo.size > 0;

    if (!name || !email || !message || !emailValid) {
      feedback.textContent =
        "Mohon isi data dengan benar, termasuk email yang valid.";
      feedback.className = "feedback error";
      return;
    }

    feedback.textContent = hasPhoto
      ? "Pesan dan foto dokumentasi berhasil disiapkan. Integrasikan ke backend/email service untuk pengiriman nyata."
      : "Pesan berhasil disiapkan. Integrasikan ke backend/email service untuk pengiriman nyata.";
    feedback.className = "feedback ok";
    contactForm.reset();
    if (photoPreview) {
      photoPreview.hidden = true;
      photoPreview.src = "";
    }
  });
}
