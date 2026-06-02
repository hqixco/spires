export function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  const setState = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => {
    setState(menu.hidden);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setState(false));
  });

  const langToggles = [...document.querySelectorAll('[data-lang-toggle]')];
  if (langToggles.length > 0) {
    const syncLangState = (isDeu) => {
      langToggles.forEach((langToggle) => {
        langToggle.classList.toggle('is-deu', isDeu);
        langToggle.setAttribute('aria-pressed', String(isDeu));
      });
    };

    langToggles.forEach((langToggle) => {
      langToggle.addEventListener('click', () => {
        syncLangState(!langToggle.classList.contains('is-deu'));
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setState(false);
  });
}
