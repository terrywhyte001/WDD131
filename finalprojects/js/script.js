/* js/script.js
   Handles:
   - Menu toggle
   - Learning Cards (load/save/render/add/delete/toggle)
   - Contact form save & display
   - Uses template literals exclusively for output HTML strings
*/

(function () {
  'use strict';

  // ---- Constants & keys ----
  const CARDS_KEY = 'programmingHub.cards';
  const CONTACTS_KEY = 'programmingHub.contacts';

  // DOM elements (selected once)
  const menuToggle = document.getElementById('menuToggle') || document.getElementById('menuToggleAlt');
  const primaryNav = document.getElementById('primary-nav') || document.getElementById('primary-nav-alt');
  const currentYearEls = document.querySelectorAll('#currentyear, #currentyearAbout, #currentyearContact, #currentyearRef');

  const cardForm = document.getElementById('card-form');
  const cardTitle = document.getElementById('card-title');
  const cardDesc = document.getElementById('card-desc');
  const cardLang = document.getElementById('card-lang');
  const cardsContainer = document.getElementById('cards-container');
  const cardFormMsg = document.getElementById('card-form-msg');
  const clearCardsBtn = document.getElementById('clear-cards');

  const contactForm = document.getElementById('contact-form');
  const submissionsList = document.getElementById('submissions-list');
  const contactFormMsg = document.getElementById('contact-form-msg');

  // ensure page-ready behaviors
  document.addEventListener('DOMContentLoaded', init);

  // ---- Initialization ----
  function init() {
    setCurrentYears();
    setupMenuToggle();
    initCardFeature();
    initContactFormFeature();
  }

  // ---- Utility Functions ----
  function setCurrentYears() {
    const year = new Date().getFullYear();
    currentYearEls.forEach(el => {
      if (el) el.textContent = year;
    });
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  // ---- Menu toggle (small screens) ----
  function setupMenuToggle() {
    if (!menuToggle || !primaryNav) return;
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.style.display = expanded ? '' : 'block';
    });
  }

  // ---- Learning Cards Feature ----
  function initCardFeature() {
    const cards = loadCards();
    renderCards(cards);
    attachCardHandlers(cards);
  }

  // load from localStorage (returns array)
  function loadCards() {
    const raw = localStorage.getItem(CARDS_KEY);
    if (!raw) {
      // default starter cards (object usage)
      return [
        { id: 1, title: 'JS: DOM Basics', description: 'Intro to DOM selection & events', language: 'javascript', starred: true },
        { id: 2, title: 'Python: Data Types', description: 'Variables, lists, and dicts', language: 'python', starred: false }
      ];
    }
    try {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr;
    } catch (e) {
      console.error('Failed to parse cards from storage', e);
      return [];
    }
  }

  // save array to localStorage
  function saveCards(cards) {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  }

  // render cards — template literals used for output
  function renderCards(cards) {
    if (!cardsContainer) return;
    if (!cards.length) {
      cardsContainer.innerHTML = `<p>No learning cards yet. Add one above.</p>`;
      return;
    }

    // build HTML fragments with template literals only
    cardsContainer.innerHTML = cards.map(c => `
      <article class="card" data-id="${c.id}">
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <p><strong>Topic:</strong> ${capitalize(c.language)}</p>
        <div class="card-actions">
          <button class="btn-toggle-star" data-id="${c.id}" aria-pressed="${c.starred ? 'true' : 'false'}">
            ${c.starred ? '★ Starred' : '☆ Star'}
          </button>
          <button class="btn-delete" data-id="${c.id}">Delete</button>
        </div>
      </article>
    `).join('');
  }

  // create an id for a new card
  function nextCardId(cards) {
    return cards.length ? Math.max(...cards.map(c => c.id)) + 1 : 1;
  }

  // attach handlers for adding cards and card actions (delegation)
  function attachCardHandlers(initialCards) {
    let cards = initialCards.slice();

    if (cardForm) {
      cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addCardFromForm(cards);
      });
    }

    if (clearCardsBtn) {
      clearCardsBtn.addEventListener('click', () => {
        if (!confirm('Clear all learning cards?')) return;
        cards = [];
        saveCards(cards);
        renderCards(cards);
        if (cardFormMsg) cardFormMsg.textContent = 'All cards cleared.';
      });
    }

    // event delegation for card buttons
    if (cardsContainer) {
      cardsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.btn-delete')) {
          const id = Number(target.dataset.id);
          cards = cards.filter(c => c.id !== id);
          saveCards(cards);
          renderCards(cards);
          return;
        }
        if (target.closest('.btn-toggle-star')) {
          const id = Number(target.dataset.id);
          cards = cards.map(c => c.id === id ? { ...c, starred: !c.starred } : c);
          saveCards(cards);
          renderCards(cards);
          return;
        }
      });
    }

    // initial save so storage persists default cards
    saveCards(cards);
  }

  // add new card from form inputs with validation
  function addCardFromForm(cards) {
    const title = cardTitle.value.trim();
    const desc = cardDesc.value.trim();
    const lang = cardLang.value;

    // conditional branching: validation
    if (title.length < 2) {
      showCardFormMessage('Please enter a title (at least 2 characters).', true);
      return;
    }
    if (desc.length < 5) {
      showCardFormMessage('Please enter a longer description (at least 5 characters).', true);
      return;
    }

    const newCard = {
      id: nextCardId(cards),
      title,
      description: desc,
      language: lang,
      starred: false
    };

    cards.push(newCard);
    saveCards(cards);
    renderCards(cards);
    cardForm.reset();
    showCardFormMessage('Card added.', false);
  }

  function showCardFormMessage(msg, isError) {
    if (!cardFormMsg) return;
    cardFormMsg.textContent = msg;
    cardFormMsg.style.color = isError ? '#b91c1c' : 'var(--accent)';
    setTimeout(() => { if (cardFormMsg) cardFormMsg.textContent = ''; }, 3000);
  }

  // ---- Contact Form Feature (uses objects, arrays, localStorage) ----
  function initContactFormFeature() {
    if (!contactForm) return;
    // load and render saved submissions
    renderSubmissions(loadSubmissions());

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      // simple validation (conditional branching)
      if (name.length < 2) {
        showContactMessage('Please enter your name (at least 2 characters).', true);
        return;
      }
      if (!isValidEmail(email)) {
        showContactMessage('Please enter a valid email address.', true);
        return;
      }
      if (message.length < 10) {
        showContactMessage('Message is too short (min 10 chars).', true);
        return;
      }

      const submissions = loadSubmissions();
      const newSubmission = {
        id: nextContactId(submissions),
        name,
        email,
        message,
        date: new Date().toISOString()
      };
      submissions.push(newSubmission);
      saveSubmissions(submissions);
      renderSubmissions(submissions);
      contactForm.reset();
      showContactMessage('Thanks — your message has been saved locally.', false);
    });
  }

  function isValidEmail(email) {
    // basic email pattern
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function nextContactId(submissions) {
    return submissions.length ? Math.max(...submissions.map(s => s.id)) + 1 : 1;
  }

  function loadSubmissions() {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  }

  function saveSubmissions(arr) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(arr));
  }

  function renderSubmissions(arr) {
    if (!submissionsList) return;
    if (!arr.length) {
      submissionsList.innerHTML = `<p>No saved submissions yet.</p>`;
      return;
    }
    submissionsList.innerHTML = arr.map(s => {
      // template literals for output
      return `
        <div class="submission" data-id="${s.id}">
          <p><strong>${escapeHtml(s.name)}</strong> — <a href="mailto:${escapeHtml(s.email)}">${escapeHtml(s.email)}</a></p>
          <p>${escapeHtml(s.message)}</p>
          <small>Saved: ${new Date(s.date).toLocaleString()}</small>
        </div>
      `;
    }).join('');
  }

  function showContactMessage(msg, isError) {
    if (!contactFormMsg) return;
    contactFormMsg.textContent = msg;
    contactFormMsg.style.color = isError ? '#b91c1c' : 'var(--accent)';
    setTimeout(() => { if (contactFormMsg) contactFormMsg.textContent = ''; }, 3500);
  }

  // ---- Helpers ----
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function capitalize(s) {
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
  }

})();
