document.addEventListener('DOMContentLoaded', () => {
  // Initialize Countdown Timer if on Coming Soon page
  initCountdown();

  // Initialize Coming Soon Newsletter Form if exists
  initNewsletter();

  // Initialize Booking Modal if on Tours page
  initBookingModal();
});

/**
 * COUNTDOWN TIMER LOGIC
 */
function initCountdown() {
  const countdownDays = document.getElementById('days');
  const countdownHours = document.getElementById('hours');
  const countdownMinutes = document.getElementById('minutes');
  const countdownSeconds = document.getElementById('seconds');

  if (!countdownDays) return; // Not on Coming Soon page

  // Target date: Start of the tour (July 25, 2026)
  const targetDate = new Date('July 25, 2026 20:00:00').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
      // Tour has started!
      const container = document.querySelector('.countdown-container');
      if (container) {
        container.innerHTML = '<h3 style="color: var(--color-accent-gold); letter-spacing: 0.1em;">THE MEHFIL HAS BEGUN!</h3>';
      }
      clearInterval(timerInterval);
      return;
    }

    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Render with leading zeros
    countdownDays.textContent = String(days).padStart(2, '0');
    countdownHours.textContent = String(hours).padStart(2, '0');
    countdownMinutes.textContent = String(minutes).padStart(2, '0');
    countdownSeconds.textContent = String(seconds).padStart(2, '0');
  };

  // Run initial call and set interval
  updateCountdown();
  const timerInterval = setInterval(updateCountdown, 1000);
}

/**
 * NEWSLETTER FORM LOGIC
 */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const msg = document.getElementById('form-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!validateEmail(email)) {
      showFormMessage(msg, 'Please enter a valid email address.', 'error');
      return;
    }

    // Simulate API request
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Signing up...';

    setTimeout(() => {
      btn.innerHTML = 'Success!';
      showFormMessage(msg, "You're on the list! See you at the Mehfil.", 'success');
      input.value = '';
      
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }, 3000);
    }, 1200);
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFormMessage(element, text, statusClass) {
  element.textContent = text;
  element.className = 'form-msg ' + statusClass;
  
  // Subtle entrance animation
  element.style.transform = 'translateY(-5px)';
  setTimeout(() => {
    element.style.transform = 'translateY(0)';
  }, 200);
}

/**
 * TICKET BOOKING MODAL LOGIC
 */
function initBookingModal() {
  const modal = document.getElementById('ticket-modal');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('btn-cancel-booking');
  const bookingForm = document.getElementById('booking-form');
  
  if (!modal) return; // Not on Tours page

  // Field Elements inside Modal
  const modalCity = document.getElementById('modal-city');
  const modalDate = document.getElementById('modal-date');
  const modalShowCityInput = document.getElementById('modal-show-city-input');
  const modalShowDateInput = document.getElementById('modal-show-date-input');

  // Open Modal function
  const openModal = (city, date) => {
    modalCity.textContent = city;
    modalDate.textContent = date;
    modalShowCityInput.value = city;
    modalShowDateInput.value = date;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  // Close Modal function
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scrolling
    bookingForm.reset();
  };

  // Attach event listeners to all "TICKETS" buttons
  document.querySelectorAll('.btn-buy-tickets').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.tour-card');
      const city = card.getAttribute('data-city');
      const date = card.getAttribute('data-date');
      openModal(city, date);
    });
  });

  // Attach event listeners to "MEET & GREET" and "WAITLIST" buttons
  document.querySelectorAll('.btn-meet-greet').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.tour-card');
      const city = card.getAttribute('data-city');
      alert(`Meet & Greet registration for ${city} will open soon! Keep an eye on your inbox.`);
    });
  });

  document.querySelectorAll('.btn-waitlist').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.tour-card');
      const city = card.getAttribute('data-city');
      alert(`You have been added to the ticket waitlist for ${city}. We will notify you if more tickets become available.`);
    });
  });

  // Close triggers
  closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close on clicking outside the card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle booking submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const qty = document.getElementById('booking-qty').value;
    const city = modalShowCityInput.value;

    if (!name || !email) {
      alert('Please fill out all fields.');
      return;
    }

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Processing reservation...';

    setTimeout(() => {
      submitBtn.innerHTML = 'Confirmed!';
      alert(`Success! We've reserved ${qty} ticket(s) for Mirza Ki Mehfil in ${city} for ${name}. A confirmation email has been sent to ${email}.`);
      closeModal();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1500);
  });
}
