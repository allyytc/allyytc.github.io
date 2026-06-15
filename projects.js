/* ============================================================
   Projects page interactions:
   - Expand/collapse project cards
   - Thumbnail strips -> full-screen modal gallery
   - Design Work masonry -> lightbox
   ============================================================ */

// --- Accordion: expand/collapse project cards ---------------
document.querySelectorAll('.proj-card-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.closest('.proj-card');
    const wrap = card.querySelector('.proj-card-detail-wrap');
    const isOpen = card.classList.contains('open');

    if (isOpen) {
      wrap.style.maxHeight = '0px';
      card.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
    } else {
      card.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
      wrap.style.maxHeight = wrap.scrollHeight + 'px';
    }
  });
});

// Keep open panels sized correctly if the viewport changes
// (e.g. text reflow on resize).
window.addEventListener('resize', () => {
  document.querySelectorAll('.proj-card.open .proj-card-detail-wrap').forEach(wrap => {
    wrap.style.maxHeight = wrap.scrollHeight + 'px';
  });
});

// --- Full-screen modal gallery -------------------------------
const modal = document.getElementById('galleryModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

/*
  Each entry below is a gallery for a thumbnail strip. Replace the
  placeholder `caption` text and add `src` (image path) or, for
  videos, an embeddable URL (e.g. a YouTube embed link) to swap in
  real media. Items without a `src` render as a labeled placeholder
  box so the layout can be previewed before assets are ready.
*/
const galleryData = {

  // --- Projects In Progress -----------------------------------
  'impact-studio-homepage': [
    { type: 'image', src: 'impact-wireframe/mock%203.png', caption: 'Homepage redesign — hero, approach, and lifecycle process' },
  ],
  'impact-studio-about': [
    { type: 'image', src: 'impact-wireframe/mock%201.png', caption: 'About Us page — mission and team directory' },
  ],
  'cddc-home': [
    { type: 'image', src: 'cddc-wireframes/home.png', caption: 'Homepage wireframe' },
  ],
  'cddc-get-help': [
    { type: 'image', src: 'cddc-wireframes/get-help.png', caption: 'Get Help page wireframe' },
  ],
  'cddc-contact': [
    { type: 'image', src: 'cddc-wireframes/contact.png', caption: 'Contact Us page wireframe' },
  ],
  'cddc-about': [
    { type: 'image', src: 'cddc-wireframes/about.png', caption: 'About Us page wireframe' },
  ],
  'cddc-donate': [
    { type: 'image', src: 'cddc-wireframes/donate.png', caption: 'Donate page wireframe' },
  ],

  // --- Hackathon Wins -------------------------------------------
  'er-overwatch': [
    // TODO: replace src with a real embeddable demo link, e.g.
    // 'https://www.youtube.com/embed/VIDEO_ID'
    { type: 'video', src: '', caption: 'Demo video — add embed link' },
    { type: 'image', caption: 'Team photo — replace with real photo' },
    { type: 'image', caption: 'Dashboard screenshot — replace with real photo' },
    { type: 'image', caption: 'Awards ceremony — replace with real photo' },
  ],
  'combocraft': [
    // TODO: replace src with a real embeddable demo link, e.g.
    // 'https://www.youtube.com/embed/VIDEO_ID'
    { type: 'video', src: '', caption: 'Demo video — add embed link' },
    { type: 'image', caption: 'Gameplay screenshot — replace with real photo' },
    { type: 'image', caption: 'Gesture detection in action — replace with real photo' },
    { type: 'image', caption: 'Team photo — replace with real photo' },
  ],

  // --- Past Projects ---------------------------------------------
  'sallys-pos': [
    { type: 'image', caption: 'Order screen — replace with real screenshot' },
    { type: 'image', caption: 'Database schema — replace with real screenshot' },
    { type: 'image', caption: 'Loyalty points dashboard — replace with real screenshot' },
  ],
};

// Build a slide element for the modal gallery
function buildSlide(item) {
  const slide = document.createElement('div');
  slide.className = 'modal-slide';

  if (item.type === 'video') {
    if (item.src) {
      slide.innerHTML = `
        <div class="modal-video-wrap">
          <iframe src="${item.src}" title="${item.caption}" loading="lazy" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
        <figcaption>${item.caption}</figcaption>`;
    } else {
      slide.innerHTML = `
        <div class="modal-placeholder"><span>${item.caption}</span></div>
        <figcaption>${item.caption}</figcaption>`;
    }
  } else if (item.src) {
    slide.innerHTML = `
      <figure>
        <img src="${item.src}" alt="${item.caption}">
        <figcaption>${item.caption}</figcaption>
      </figure>`;
  } else {
    slide.innerHTML = `
      <div class="modal-placeholder"><span>${item.caption}</span></div>
      <figcaption>${item.caption}</figcaption>`;
  }

  return slide;
}

function openGallery(galleryId, startIndex) {
  const items = galleryData[galleryId];
  if (!items || !items.length) return;

  modalContent.innerHTML = '';
  items.forEach((item, i) => {
    const slide = buildSlide(item);
    slide.id = `${galleryId}-slide-${i}`;
    modalContent.appendChild(slide);
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const target = document.getElementById(`${galleryId}-slide-${startIndex}`);
  if (target) {
    // Wait a frame so layout is ready before scrolling
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  modalContent.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// Wire up thumbnail strips
document.querySelectorAll('.thumb[data-gallery], .thumb-btn[data-gallery]').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const galleryId = thumb.dataset.gallery;
    const index = parseInt(thumb.dataset.index, 10) || 0;
    openGallery(galleryId, index);
  });
});

// --- Design Work masonry -> lightbox -------------------------
const designItems = document.querySelectorAll('.design-masonry-item');
if (designItems.length) {
  galleryData['design-work'] = Array.from(designItems).map(item => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.design-masonry-caption');
    return {
      type: 'image',
      src: img ? img.getAttribute('src') : '',
      caption: caption ? caption.textContent.trim() : '',
    };
  });

  designItems.forEach((item, i) => {
    item.addEventListener('click', () => openGallery('design-work', i));
  });
}
