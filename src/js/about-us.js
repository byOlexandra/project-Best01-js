export function initAboutUsSlider() {
  const slides = document.querySelectorAll('.why-slide');
  const container = document.querySelector('.why-slides');
  const prev = document.querySelector('.why-prev');
  const next = document.querySelector('.why-next');
  const dotsWrap = document.querySelector('.why-dots');

  if (!slides.length || !container || !prev || !next || !dotsWrap) return;

  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'why-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = document.querySelectorAll('.why-dot');

  function update() {
    container.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }

  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    update();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  update();
}
