const galleryData = {
  bmw750: {
    hash: 'bmw750',
    kicker: 'CHAPTER 01 — WHERE IT STARTED',
    title: 'BMW 750xi — The First Build',
    description: 'The damaged 7 Series that started the Projects & Problems salvage-build journey.',
    finalLabel: 'Finished',
    photos: [
      {src:'bmw750-auction-front.jpg',stage:'beginning',label:'Beginning',caption:'Front-end condition at the salvage auction.'},
      {src:'bmw750-auction-rear.jpg',stage:'beginning',label:'Beginning',caption:'Rear three-quarter view showing the otherwise complete body.'},
      {src:'bmw750-front-repair.jpg',stage:'build',label:'During the Build',caption:'Front structure exposed during the repair process.'},
      {src:'bmw750-engine-front.jpg',stage:'build',label:'During the Build',caption:'Cooling system and engine-bay access during front-end work.'},
      {src:'bmw750-brakes.jpg',stage:'build',label:'During the Build',caption:'Brake and suspension maintenance during the rebuild.'},
      {src:'bmw750-interior.jpg',stage:'final',label:'Finished',caption:'The luxury interior remained in strong condition.'}
    ]
  },
  porsche: {
    hash: 'porsche',
    kicker: 'CHAPTER 02 — THE MODERN CLASSIC',
    title: 'Porsche 911 Carrera 4S',
    description: 'A damaged 996 Carrera 4S brought back through repairs, replacement parts and continued ownership.',
    finalLabel: 'Finished',
    photos: [
      {src:'porsche-salvage_front.jpg',stage:'beginning',label:'Beginning',caption:'The Carrera 4S as it appeared at the salvage auction.'},
      {src:'porsche-salvage_front2.jpg',stage:'beginning',label:'Beginning',caption:'Front three-quarter view documenting the missing lighting and damage.'},
      {src:'porsche-salvage_rear.jpg',stage:'beginning',label:'Beginning',caption:'Rear auction condition of the wide-body 996.'},
      {src:'porsche-damage_close.jpg',stage:'beginning',label:'Beginning',caption:'Close view of the damaged front end.'},
      {src:'porsche-parts.jpg',stage:'build',label:'During the Build',caption:'Removed lighting and trim pieces organized during the repair.'},
      {src:'porsche-engine.jpg',stage:'build',label:'During the Build',caption:'Engine bay inspection and mechanical work.'},
      {src:'porsche-interior.jpg',stage:'build',label:'During the Build',caption:'Interior condition during the rebuild.'},
      {src:'porsche-keys.jpg',stage:'build',label:'During the Build',caption:'The keys and auction documentation that came with the car.'},
      {src:'porsche-finished.jpg',stage:'final',label:'Finished',caption:'The repaired Carrera 4S back on the road.'},
      {src:'porsche-before-after-v2.jpg',stage:'final',label:'Finished',caption:'Before and after: from auction damage to driver.'}
    ]
  },
  bmwg30: {
    hash: 'bmwg30',
    kicker: 'CHAPTER 03 — THE CURRENT BUILD',
    title: '2018 BMW 530i G30',
    description: 'From salvage purchase to inspection, rebuilt title, registration and the final cosmetic work still underway.',
    finalLabel: 'Current State',
    photos: [
      {src:'bmw-project.jpg',stage:'beginning',label:'Beginning',caption:'The G30 with its front-end components removed.'},
      {src:'bmw-wheel.jpg',stage:'build',label:'During the Build',caption:'Factory wheel and suspension-area inspection.'},
      {src:'bmw-interior.jpg',stage:'build',label:'During the Build',caption:'Interior condition during the project.'},
      {src:'bmw-rear-work.jpg',stage:'build',label:'During the Build',caption:'Rear bumper and diffuser work in progress.'},
      {src:'bmw-finished.jpg',stage:'final',label:'Current State',caption:'Road-ready with the gray primer front bumper awaiting paint.'},
      {src:'bmw-rear-finished.jpg',stage:'final',label:'Current State',caption:'Completed rear bumper and diffuser.'},
      {src:'bmw-before-after-preferred.jpg',stage:'final',label:'Current State',caption:'Before and current-state comparison of the BMW G30.'}
    ]
  }
};

const grid = document.querySelector('#gallery-grid');
const carTabs = [...document.querySelectorAll('.car-tab')];
const stageFilters = [...document.querySelectorAll('.stage-filter')];
const title = document.querySelector('#gallery-title');
const kicker = document.querySelector('#gallery-kicker');
const description = document.querySelector('#gallery-description');
const count = document.querySelector('#photo-count');
const finalFilter = document.querySelector('#final-filter');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');

let activeCar = galleryData[location.hash.slice(1)] ? location.hash.slice(1) : 'bmw750';
let activeStage = 'all';
let visiblePhotos = [];
let activePhoto = 0;
let lastFocused = null;

function renderGallery() {
  const car = galleryData[activeCar];
  visiblePhotos = car.photos.filter(photo => activeStage === 'all' || photo.stage === activeStage);
  kicker.textContent = car.kicker;
  title.textContent = car.title;
  description.textContent = car.description;
  count.textContent = visiblePhotos.length;
  finalFilter.textContent = car.finalLabel;

  carTabs.forEach(tab => {
    const selected = tab.dataset.car === activeCar;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  stageFilters.forEach(filter => filter.classList.toggle('is-active', filter.dataset.stage === activeStage));

  if (!visiblePhotos.length) {
    grid.innerHTML = '<div class="gallery-empty">More photos from this stage are coming soon.</div>';
    return;
  }

  grid.innerHTML = visiblePhotos.map((photo,index) => `
    <figure class="gallery-card">
      <button type="button" data-photo-index="${index}" aria-label="Open photo: ${photo.caption}">
        <div class="gallery-card-image">
          <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
          <span class="stage-badge">${photo.label}</span>
        </div>
        <figcaption>${photo.caption}</figcaption>
      </button>
    </figure>`).join('');

  grid.querySelectorAll('[data-photo-index]').forEach(button => {
    button.addEventListener('click', () => openLightbox(Number(button.dataset.photoIndex), button));
  });
}

function chooseCar(carName) {
  activeCar = carName;
  activeStage = 'all';
  history.replaceState(null, '', `#${galleryData[carName].hash}`);
  renderGallery();
}

function openLightbox(index, trigger) {
  activePhoto = index;
  lastFocused = trigger;
  updateLightbox();
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  lightbox.querySelector('.lightbox-close').focus();
}

function updateLightbox() {
  const photo = visiblePhotos[activePhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.caption;
  lightboxCaption.textContent = `${photo.label} — ${photo.caption}`;
}

function moveLightbox(direction) {
  activePhoto = (activePhoto + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
  if (lastFocused) lastFocused.focus();
}

carTabs.forEach(tab => tab.addEventListener('click', () => chooseCar(tab.dataset.car)));
stageFilters.forEach(filter => filter.addEventListener('click', () => {
  activeStage = filter.dataset.stage;
  renderGallery();
}));
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', () => moveLightbox(-1));
document.querySelector('.lightbox-next').addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

renderGallery();
