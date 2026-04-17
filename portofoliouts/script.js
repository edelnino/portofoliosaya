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
      feedback.textContent = "Mohon isi data dengan benar, termasuk email yang valid.";
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
