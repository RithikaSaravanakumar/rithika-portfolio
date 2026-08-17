document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const progressBar = document.querySelector('.scroll-progress-bar');

  if (progressBar) {
    const updateScrollProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.transform = `scaleX(${Math.min(Math.max(scrollProgress / 100, 0), 1)})`;
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
  }

  if (header) {
    const updateHeaderState = () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navAnchors.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;

      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        target.classList.add('visible');
        target.classList.remove('is-visible');
        return;
      }

      target.classList.remove('visible');
      target.classList.remove('is-visible');
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -5% 0px'
  });

  revealElements.forEach((element) => {
    sectionObserver.observe(element);
  });

  const activeSections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements', 'contact'];
  const sectionTargets = activeSections
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute('id');
      navAnchors.forEach((link) => {
        const linkHref = link.getAttribute('href');
        link.classList.toggle('active', linkHref === `#${id}`);
      });
    });
  }, {
    threshold: 0.45,
    rootMargin: '-10% 0px -40% 0px'
  });

  sectionTargets.forEach((section) => navObserver.observe(section));

  const projectCards = document.querySelectorAll('.project-card');
  const projectToggles = document.querySelectorAll('.project-toggle');

  if (projectCards.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;
        const index = Array.from(projectCards).indexOf(card);
        card.style.transitionDelay = `${index * 80}ms`;
        card.classList.add('is-visible');
        revealObserver.unobserve(card);
      });
    }, { threshold: 0.15 });

    projectCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 80}ms`;
      revealObserver.observe(card);
    });
  }

  projectToggles.forEach((toggle) => {
    const card = toggle.closest('.project-card');
    if (!card) return;

    toggle.addEventListener('click', () => {
      const isOpen = card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? 'Hide Details' : 'View Details';
    });
  });

  const contactForm = document.querySelector('.contact-form');
  const submitButton = document.getElementById('contact-submit');
  const statusBox = document.querySelector('.form-status');
  const messageInput = document.getElementById('message');
  const messageCounter = document.getElementById('message-counter');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const fieldErrors = document.querySelectorAll('.field-error');

  if (!contactForm || !submitButton || !statusBox || !messageInput || !messageCounter) {
    return;
  }

  const MAX_MESSAGE_LENGTH = 2000;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const recipientEmail = 'rithikasaravanakumar005@gmail.com';

  function clearFieldErrors() {
    fieldErrors.forEach(error => {
      error.textContent = '';
      error.classList.remove('visible');
    });
  }

  function getFieldError(fieldName) {
    return document.querySelector(`[data-error-for="${fieldName}"]`);
  }

  function setFieldError(fieldName, message) {
    const fieldError = getFieldError(fieldName);
    if (fieldError) {
      fieldError.textContent = message;
      fieldError.classList.add('visible');
    }
  }

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
    messageCounter.style.color = currentLength >= MAX_MESSAGE_LENGTH ? 'var(--error)' : 'var(--text-soft)';
  }

  function validateForm() {
    clearFieldErrors();
    clearStatus();

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();
    let isValid = true;

    if (!nameValue) {
      setFieldError('name', 'Name cannot be empty.');
      nameInput.focus();
      isValid = false;
    } else if (nameValue.length > 100) {
      setFieldError('name', 'Name must be 100 characters or fewer.');
      nameInput.focus();
      isValid = false;
    }

    if (!emailValue) {
      setFieldError('email', 'Email is required.');
      if (isValid) emailInput.focus();
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldError('email', 'Please enter a valid email address.');
      if (isValid) emailInput.focus();
      isValid = false;
    }

    if (!messageValue) {
      setFieldError('message', 'Message cannot be empty.');
      if (isValid) messageInput.focus();
      isValid = false;
    } else if (messageValue.length > MAX_MESSAGE_LENGTH) {
      setFieldError('message', 'Message must be 2000 characters or fewer.');
      if (isValid) messageInput.focus();
      isValid = false;
    }

    return isValid;
  }

  function buildGmailUrl(name, email, message) {
    const subject = `Portfolio Contact from ${name}`;
    const body = [
      'Hello Rithika,',
      '',
      `My name is ${name}.`,
      '',
      `My email address is ${email}.`,
      '',
      'Message:',
      '',
      message,
      '',
      'Regards,',
      name
    ].join('\n');

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  nameInput.addEventListener('input', () => {
    const fieldError = getFieldError('name');
    if (nameInput.value.trim() && fieldError && fieldError.textContent) {
      clearFieldErrors();
    }
    clearStatus();
  });

  emailInput.addEventListener('input', () => {
    const fieldError = getFieldError('email');
    if (emailInput.value.trim() && fieldError && fieldError.textContent) {
      clearFieldErrors();
    }
    clearStatus();
  });

  messageInput.addEventListener('input', () => {
    updateCounter();
    const fieldError = getFieldError('message');
    if (messageInput.value.trim() && fieldError && fieldError.textContent) {
      clearFieldErrors();
    }
    clearStatus();
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (submitButton.disabled) {
      return;
    }

    const visitorName = nameInput.value.trim();
    const visitorEmail = emailInput.value.trim();
    const visitorMessage = messageInput.value.trim();
    const gmailUrl = buildGmailUrl(visitorName, visitorEmail, visitorMessage);

    submitButton.disabled = true;
    submitButton.textContent = 'Opening Gmail...';
    setStatus('info', 'Opening Gmail so you can review and send your message.');

    const gmailWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    if (!gmailWindow) {
      setStatus('error', 'Gmail could not open. Please use the direct email link below.');
      submitButton.disabled = false;
      submitButton.textContent = 'Mail Me';
      return;
    }

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Mail Me';
      clearStatus();
      contactForm.reset();
      updateCounter();
    }, 1200);
  });

  updateCounter();
});
