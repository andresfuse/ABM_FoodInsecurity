// script.js

// Mostrar en consola qué sección está visible mientras haces scroll (para pruebas futuras)
document.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  const scrollPos = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      console.log(`Sección visible: ${section.id}`);
    }
  });
});
