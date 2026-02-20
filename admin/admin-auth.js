// Admin authentication

document.addEventListener('DOMContentLoaded', function () {
  // Check if user is already logged in
  checkAuth();

  // Handle login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function checkAuth() {
  try {
    const user = await SupabaseService.getCurrentUser();
    if (user) {
      // User is logged in, redirect to dashboard
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    // Not logged in, stay on login page
    console.log('Not authenticated');
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('loginMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  messageDiv.innerHTML = '';

  try {
    await SupabaseService.signIn(email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Invalid email or password.</div>';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
}
