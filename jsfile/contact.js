/* ============================================================
   Contact.js – Form handling with Formspree
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) {
    console.warn('Contact form not found on this page.');
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // ---- Client-side validation ----
    if (!name || !email || !message) {
      feedback.style.display = 'flex';
      feedback.style.color = '#ff8a8a';
      feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all fields.';
      feedback.classList.add('show');

      setTimeout(() => {
        feedback.style.display = 'none';
        feedback.style.color = '#7ee0b8';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thanks! Your message was sent successfully.';
      }, 3000);
      return;
    }

    // ---- Show loading state ----
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    // ---- Submit to Formspree ----
    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Success
        feedback.style.display = 'flex';
        feedback.style.color = '#7ee0b8';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thanks! Your message was sent successfully.';
        feedback.classList.add('show');
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 5000);
      } else {
        // Server error
        feedback.style.display = 'flex';
        feedback.style.color = '#ff8a8a';
        feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again later.';
        feedback.classList.add('show');
        btn.innerHTML = originalText;
        btn.disabled = false;

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 5000);
      }
    })
    .catch(error => {
      // Network error
      feedback.style.display = 'flex';
      feedback.style.color = '#ff8a8a';
      feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please check your connection.';
      feedback.classList.add('show');
      btn.innerHTML = originalText;
      btn.disabled = false;

      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);
    });
  });

});