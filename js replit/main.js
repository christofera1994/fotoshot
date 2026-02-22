// Main application JavaScript

document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true,
      offset: 50
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Initialize Swiper for testimonials
  initTestimonialSwiper();

  // Load services
  loadServices();

  // Load gallery
  loadGallery();

  // Handle contact form
  handleContactForm();
});

// Initialize testimonial swiper
function initTestimonialSwiper() {
  if (document.querySelector('.testimonial-swiper')) {
    new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      spaceBetween: 50,
      loop: true,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
}

// Load services from Supabase
async function loadServices() {
  const container = document.getElementById('services-container');
  if (!container) return;

  try {
    const services = await SupabaseService.getServices();

    if (services && services.length > 0) {
      container.innerHTML = '';
      services.forEach((service, index) => {
        const serviceCard = createServiceCard(service, index);
        container.appendChild(serviceCard);
      });
      AOS.refresh();
    } else {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No services available yet.</p></div>';
    }
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading services.</p></div>';
  }
}

// Create service card HTML
function createServiceCard(service, index) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';
  col.setAttribute('data-aos', 'fade-up');
  col.setAttribute('data-aos-delay', (index * 100).toString());

  col.innerHTML = `
    <div class="service-card">
      <div class="service-image-wrapper">
        <img src="${service.image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800'}" class="img-fluid w-100" alt="${service.title}" style="height: 400px; object-fit: cover;">
      </div>
      <div class="service-details">
        <span class="text-accent fw-bold text-uppercase small ls-2">${service.price || 'Bespoke'}</span>
        <h3 class="mt-2 h4">${service.title}</h3>
        <p class="mt-3 text-muted small">${service.description || ''}</p>
      </div>
    </div>
  `;

  return col;
}

// Load gallery from Supabase
async function loadGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  try {
    const gallery = await SupabaseService.getGallery();

    if (gallery && gallery.length > 0) {
      container.innerHTML = '';
      gallery.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        container.appendChild(galleryItem);
      });
      AOS.refresh();
    } else {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No gallery images available yet.</p></div>';
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
    container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading gallery.</p></div>';
  }
}

// Create gallery item HTML
function createGalleryItem(item, index) {
  const col = document.createElement('div');
  col.className = 'col-md-4 col-6';
  col.setAttribute('data-aos', 'zoom-in');
  col.setAttribute('data-aos-delay', (index * 50).toString());

  col.innerHTML = `
    <div class="gallery-grid-item" onclick="openImageModal('${item.image_url}')">
      <img src="${item.image_url}" class="img-fluid w-100" alt="Gallery Image" style="height: 450px; object-fit: cover;">
      <div class="gallery-overlay">
        <div class="text-white text-center">
          <i class="bi bi-plus-lg display-4 text-accent"></i>
        </div>
      </div>
    </div>
  `;

  return col;
}

// Open image in modal
function openImageModal(imageUrl) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: zoom-out; animation: fadeIn 0.3s ease;';
  overlay.onclick = () => overlay.remove();

  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; box-shadow: 0 0 50px rgba(0,0,0,0.5);';

  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

// Handle contact form submission
function handleContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    const messageDiv = document.getElementById('contactFormMessage');

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    try {
      await SupabaseService.createContact({
        name: name,
        email: email,
        message: message
      });

      messageDiv.innerHTML = '<div class="alert alert-success bg-transparent text-accent border-accent">Message sent. We will contact you soon.</div>';
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      messageDiv.innerHTML = '<div class="alert alert-danger bg-transparent text-danger border-danger">Error sending message.</div>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
