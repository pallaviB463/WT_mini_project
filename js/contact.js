document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  // create an inline message container under the form
  const inlineMsg = document.createElement('div');
  inlineMsg.className = 'inline-message';
  inlineMsg.style.display = 'none';
  form.appendChild(inlineMsg);

  // create a toast container to append to body
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  function showToast(text, type = 'success', time = 3500) {
    toast.textContent = text;
    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), time);
  }

  function showInline(text, type = 'success') {
    inlineMsg.textContent = text;
    inlineMsg.classList.remove('success', 'error');
    inlineMsg.classList.add(type);
    inlineMsg.style.display = 'block';
  }

  function hideInline() {
    inlineMsg.style.display = 'none';
  }

  function isValidEmail(v) {
    // simple regex for validation
    return /\S+@\S+\.\S+/.test(v);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();

    if (!name || !email || !msg) {
      showInline('Please fill out all fields.', 'error');
      showToast('Please fill out all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showInline('Please provide a valid email address.', 'error');
      showToast('Invalid email address.', 'error');
      return;
    }

    // simulate sending
    // In a real app, you'd send the data to a server here.
    showInline(`Thank you, ${name}! Your message has been sent.`, 'success');
    showToast(`✅ Message sent — thank you, ${name}!`, 'success');

    // reset after a short delay so user sees the confirmation
    setTimeout(() => {
      form.reset();
      hideInline();
    }, 1400);
  });
});
