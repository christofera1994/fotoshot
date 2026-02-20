// Main application JavaScript

document.addEventListener('DOMContentLoaded', function () {
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
      spaceBetween: 30,
      freeMode: true,
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
      services.forEach(service => {
        const serviceCard = createServiceCard(service);
        container.appendChild(serviceCard);
      });
    } else {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No services available yet.</p></div>';
    }
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading services. Please try again later.</p></div>';
  }
}

// Create service card HTML
function createServiceCard(service) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-3';

  col.innerHTML = `
    <div class="card">
      <img src="${service.image_url || 'images/placeholder.jpg'}" class="card-img-top rounded-4" alt="${service.title}" style="height: 250px; object-fit: cover;">
      <div class="card-body p-0">
        <h3 class="pt-4">${service.price || 'Contact for pricing'}</h3>
        <h4 class="card-title">${service.title}</h4>
        <p class="card-text">${service.description || ''}</p>
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
      gallery.forEach(item => {
        const galleryItem = createGalleryItem(item);
        container.appendChild(galleryItem);
      });
    } else {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No gallery images available yet.</p></div>';
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
    container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading gallery. Please try again later.</p></div>';
  }
}

// Create gallery item HTML
function createGalleryItem(item) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-3';

  col.innerHTML = `
    <div class="card">
      <img src="${item.image_url}" class="card-img-top rounded-4" alt="Gallery Image" style="height: 300px; object-fit: cover; cursor: pointer;" onclick="openImageModal('${item.image_url}')">
    </div>
  `;

  return col;
}

// Open image in modal (simple implementation)
function openImageModal(imageUrl) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer;';
  overlay.onclick = () => overlay.remove();

  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;';

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

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      await SupabaseService.createContact({
        name: name,
        email: email,
        message: message
      });

      messageDiv.innerHTML = '<div class="alert alert-success">Thank you! Your message has been sent successfully.</div>';
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      messageDiv.innerHTML = '<div class="alert alert-danger">Error sending message. Please try again later.</div>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
