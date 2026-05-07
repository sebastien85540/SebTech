const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const yearTargets = document.querySelectorAll('[data-year]');
const revealElements = document.querySelectorAll('.reveal');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

yearTargets.forEach((target) => {
  target.textContent = new Date().getFullYear();
});

// Formulaire de contact avec brief projet dynamique
const contactForm = document.querySelector('#formulaire');
const serviceSelect = document.querySelector('#service-select');
const briefProjet = document.querySelector('#brief-projet');
const BRIEF_SERVICES = new Set(['Site web', 'Application']);

if (serviceSelect && briefProjet) {
  serviceSelect.addEventListener('change', () => {
    const needsBrief = BRIEF_SERVICES.has(serviceSelect.value);
    briefProjet.hidden = !needsBrief;
    // Active/désactive les required sur les champs du brief
    briefProjet.querySelectorAll('textarea, input, select').forEach((field) => {
      if (needsBrief && field.name === 'description') {
        field.required = true;
      } else {
        field.required = false;
      }
    });
  });
}

if (contactForm?.dataset.mailto) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const get = (key) => String(data.get(key) || '').trim();

    const name    = get('name');
    const email   = get('email');
    const service = get('service');
    const message = get('message');

    const isBrief = BRIEF_SERVICES.has(service);

    const lines = [
      `Nom : ${name}`,
      `Email : ${email}`,
      `Type de besoin : ${service}`,
    ];

    if (isBrief) {
      lines.push('');
      lines.push('── Brief projet ──');
      if (get('description')) lines.push(`Description : ${get('description')}`);
      if (get('pages'))       lines.push(`Pages / fonctionnalités : ${get('pages')}`);
      if (get('couleurs'))    lines.push(`Couleurs / charte : ${get('couleurs')}`);
      if (get('photos'))      lines.push(`Photos / visuels : ${get('photos')}`);
      if (get('reference'))   lines.push(`Référence / inspiration : ${get('reference')}`);
      if (get('delai'))       lines.push(`Délai souhaité : ${get('delai')}`);
      if (get('budget'))      lines.push(`Budget indicatif : ${get('budget')}`);
    }

    if (message) {
      lines.push('');
      lines.push('Message complémentaire :');
      lines.push(message);
    }

    const subject = isBrief
      ? `Demande de devis – ${service} | SebTech Internet Web & Cloud`
      : `Demande de contact – ${service} | SebTech Internet Web & Cloud`;

    window.location.href =
      `mailto:${contactForm.dataset.mailto}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`;
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}