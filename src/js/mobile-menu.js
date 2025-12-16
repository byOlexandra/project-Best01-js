export function initMobileMenu() {
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const menu = document.querySelector('[data-menu]');
  const menuLinks = document.querySelectorAll('.header-wrapper a');

  if (!openBtn || !closeBtn || !menu) return;

  const openMenu = () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openMenu);

  closeBtn.addEventListener('click', closeMenu);

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  menu.addEventListener('click', e => {
    if (e.target === menu) {
      closeMenu();
    }
  });
}