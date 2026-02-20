// Admin Dashboard JavaScript

let currentEditingServiceId = null;
const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));
const imageUploadModal = new bootstrap.Modal(document.getElementById('imageUploadModal'));

document.addEventListener('DOMContentLoaded', function () {
  // Check authentication
  checkAuth();

  // Setup navigation
  setupNavigation();

  // Load initial data
  loadServices();
  loadGallery();
  loadContacts();

  // Setup auth state listener
  SupabaseService.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      window.location.href = 'index.html';
    }
  });
});

// Check authentication
async function checkAuth() {
  try {
    const user = await SupabaseService.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
    }
  } catch (error) {
    window.location.href = 'index.html';
  }
}

// Setup navigation
function setupNavigation() {
  const navLinks = document.querySelectorAll('.sidebar .nav-link[data-section]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      switchSection(section);

      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Switch between sections
function switchSection(sectionName) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionName).classList.add('active');
}

// Logout
async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    try {
      await SupabaseService.signOut();
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

// ========== SERVICES MANAGEMENT ==========

async function loadServices() {
  const container = document.getElementById('servicesList');
  if (!container) return;

  try {
    const services = await SupabaseService.getServices();
    container.innerHTML = '';

    if (services && services.length > 0) {
      services.forEach(service => {
        const card = createServiceCard(service);
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<div class="col-12"><p class="text-muted">No services yet. Add your first service!</p></div>';
    }
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<div class="col-12"><p class="text-danger">Error loading services.</p></div>';
  }
}

function createServiceCard(service) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-3';

  col.innerHTML = `
    <div class="card">
      <img src="${service.image_url || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${service.title}" style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${service.title}</h5>
        <p class="card-text">${service.description}</p>
        <p class="card-text"><strong>Price:</strong> ${service.price}</p>
        <button class="btn btn-sm btn-primary" onclick="editService('${service.id}')">
          <i class="bi bi-pencil"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteService('${service.id}')">
          <i class="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  `;

  return col;
}

function showServiceModal(serviceId = null) {
  currentEditingServiceId = serviceId;
  const modalTitle = document.getElementById('serviceModalTitle');
  const form = document.getElementById('serviceForm');

  if (serviceId) {
    modalTitle.textContent = 'Edit Service';
    // Load service data
    loadServiceData(serviceId);
  } else {
    modalTitle.textContent = 'Add Service';
    form.reset();
    document.getElementById('serviceId').value = '';
  }

  document.getElementById('serviceFormMessage').innerHTML = '';
  serviceModal.show();
}

async function loadServiceData(serviceId) {
  try {
    const services = await SupabaseService.getServices();
    const service = services.find(s => s.id === serviceId);

    if (service) {
      document.getElementById('serviceId').value = service.id;
      document.getElementById('serviceTitle').value = service.title;
      document.getElementById('serviceDescription').value = service.description;
      document.getElementById('servicePrice').value = service.price;
      document.getElementById('serviceImageUrl').value = service.image_url || '';
    }
  } catch (error) {
    console.error('Error loading service:', error);
    alert('Error loading service data');
  }
}

async function saveService() {
  const id = document.getElementById('serviceId').value;
  const title = document.getElementById('serviceTitle').value;
  const description = document.getElementById('serviceDescription').value;
  const price = document.getElementById('servicePrice').value;
  const imageUrl = document.getElementById('serviceImageUrl').value;
  const messageDiv = document.getElementById('serviceFormMessage');

  if (!title || !description || !price || !imageUrl) {
    messageDiv.innerHTML = '<div class="alert alert-warning">Please fill in all fields.</div>';
    return;
  }

  try {
    if (id) {
      // Update existing service
      await SupabaseService.updateService(id, {
        title,
        description,
        price,
        image_url: imageUrl
      });
      messageDiv.innerHTML = '<div class="alert alert-success">Service updated successfully!</div>';
    } else {
      // Create new service
      await SupabaseService.createService({
        title,
        description,
        price,
        image_url: imageUrl
      });
      messageDiv.innerHTML = '<div class="alert alert-success">Service created successfully!</div>';
    }

    setTimeout(() => {
      serviceModal.hide();
      loadServices();
    }, 1000);
  } catch (error) {
    console.error('Error saving service:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Error saving service. Please try again.</div>';
  }
}

async function editService(serviceId) {
  showServiceModal(serviceId);
}

async function deleteService(serviceId) {
  if (!confirm('Are you sure you want to delete this service?')) {
    return;
  }

  try {
    await SupabaseService.deleteService(serviceId);
    loadServices();
  } catch (error) {
    console.error('Error deleting service:', error);
    alert('Error deleting service');
  }
}

// ========== GALLERY MANAGEMENT ==========

async function loadGallery() {
  const container = document.getElementById('galleryList');
  if (!container) return;

  try {
    const gallery = await SupabaseService.getGallery();
    container.innerHTML = '';

    if (gallery && gallery.length > 0) {
      gallery.forEach(item => {
        const card = createGalleryCard(item);
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<div class="col-12"><p class="text-muted">No gallery images yet. Upload your first image!</p></div>';
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
    container.innerHTML = '<div class="col-12"><p class="text-danger">Error loading gallery.</p></div>';
  }
}

function createGalleryCard(item) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-3';

  col.innerHTML = `
    <div class="card">
      <img src="${item.image_url}" class="card-img-top" alt="Gallery Image" style="height: 250px; object-fit: cover;">
      <div class="card-body">
        <p class="card-text text-muted small">Uploaded: ${new Date(item.created_at).toLocaleDateString()}</p>
        <button class="btn btn-sm btn-danger" onclick="deleteGalleryImage('${item.id}', '${item.image_url}')">
          <i class="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  `;

  return col;
}

function showImageUploadModal() {
  document.getElementById('imageUploadForm').reset();
  document.getElementById('imageUploadMessage').innerHTML = '';
  imageUploadModal.show();
}

async function uploadImage() {
  const fileInput = document.getElementById('imageFile');
  const file = fileInput.files[0];
  const messageDiv = document.getElementById('imageUploadMessage');

  if (!file) {
    messageDiv.innerHTML = '<div class="alert alert-warning">Please select an image file.</div>';
    return;
  }

  try {
    messageDiv.innerHTML = '<div class="alert alert-info">Uploading image...</div>';
    await SupabaseService.uploadImage(file);
    messageDiv.innerHTML = '<div class="alert alert-success">Image uploaded successfully!</div>';

    setTimeout(() => {
      imageUploadModal.hide();
      loadGallery();
    }, 1000);
  } catch (error) {
    console.error('Error uploading image:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Error uploading image. Please try again.</div>';
  }
}

async function deleteGalleryImage(id, imageUrl) {
  if (!confirm('Are you sure you want to delete this image?')) {
    return;
  }

  try {
    await SupabaseService.deleteGalleryImage(id, imageUrl);
    loadGallery();
  } catch (error) {
    console.error('Error deleting image:', error);
    alert('Error deleting image');
  }
}

// ========== CONTACTS MANAGEMENT ==========

async function loadContacts() {
  const container = document.getElementById('contactsList');
  if (!container) return;

  try {
    const contacts = await SupabaseService.getContacts();
    container.innerHTML = '';

    if (contacts && contacts.length > 0) {
      const table = document.createElement('table');
      table.className = 'table table-striped';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${contacts.map(contact => `
            <tr>
              <td>${contact.name}</td>
              <td>${contact.email}</td>
              <td>${contact.message}</td>
              <td>${new Date(contact.created_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
      container.appendChild(table);
    } else {
      container.innerHTML = '<p class="text-muted">No contact messages yet.</p>';
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
    container.innerHTML = '<p class="text-danger">Error loading contacts.</p>';
  }
}
