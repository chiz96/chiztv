document.getElementById('year').textContent = new Date().getFullYear();
const btn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
