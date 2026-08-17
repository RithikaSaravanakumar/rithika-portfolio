document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const contactForm = document.querySelector('.contact-form');
  const submitButton = document.getElementById('contact-submit');
  const statusBox = document.querySelector('.form-status');
  const messageInput = document.getElementById('message');
  const messageCounter = document.getElementById('message-counter');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  if (!contactForm || !submitButton || !statusBox || !messageInput || !messageCounter) {
    return;
  }

  const MAX_MESSAGE_LENGTH = 2000;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(type, message) {
    statusBox.textContent = message;
    statusBox.className = 'form-status visible ' + type;
  }

  function clearStatus() {
    statusBox.textContent = '';
    statusBox.className = 'form-status';
  }

  function updateCounter() {
    const currentLength = messageInput.value.length;
    messageCounter.textContent = `${currentLength} / ${MAX_MESSAGE_LENGTH}`;
    if (currentLength >= MAX_MESSAGE_LENGTH) {
      messageCounter.style.color = 'var(--error)';
      return;
    }
    messageCounter.style.color = 'var(--text-soft)';
  }

  function validateForm() {
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    if (!nameValue) {
      setStatus('error', 'Name cannot be empty.');
      nameInput.focus();
      return false;
    }

    if (nameValue.length > 100) {
      setStatus('error', 'Name must be 100 characters or fewer.');
      nameInput.focus();
      return false;
    }

    if (!emailValue) {
      setStatus('error', 'Email is required.');
      emailInput.focus();
      return false;
    }

    if (!emailPattern.test(emailValue)) {
      setStatus('error', 'Please enter a valid email address.');
      emailInput.focus();
      return false;
    }

    if (!messageValue) {
      setStatus('error', 'Message cannot be empty.');
      messageInput.focus();
      return false;
    }

    if (messageValue.length > MAX_MESSAGE_LENGTH) {
      setStatus('error', 'Message must be 2000 characters or fewer.');
      messageInput.focus();
      return false;
    }

    return true;
  }

  messageInput.addEventListener('input', () => {
    updateCounter();
    if (statusBox.classList.contains('error')) {
      clearStatus();
    }
  });

  nameInput.addEventListener('input', () => {
    if (statusBox.classList.contains('error')) {
      clearStatus();
    }
  });

  emailInput.addEventListener('input', () => {
    if (statusBox.classList.contains('error')) {
      clearStatus();
    }
  });

  contactForm.addEventListener('submit', (event) => {
    if (!validateForm()) {
      event.preventDefault();
      return;
    }

    if (submitButton.disabled) {
      event.preventDefault();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    setStatus('info', 'Sending your message...');
  });

  updateCounter();
});
