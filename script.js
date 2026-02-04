/* =========================
   HAMBURGER MENU
========================= */

function togglemenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

/* =========================
   CAROUSEL
========================= */

document.querySelectorAll('.carousel').forEach(carousel => {

const track = carousel.querySelector ('.carousel-track')
const cards = Array.from(track.children)
const nextBtn = carousel.querySelector ('.carousel-btn.next')
const prevBtn = carousel.querySelector ('.carousel-btn.prev')
const realCardCount = cards.length

let visibleCards = 3;
let currentIndex = 0;
let autoplayInterval = null;

const AUTOPLAY_DELAY = 4000; // 4 seconds

/* ---------- Responsive card count ---------- */

function updateVisibleCards() {
    const width = window.innerWidth;
    if (width <= 600) visibleCards = 1;
    else if (width <= 900) visibleCards = 2;
    else visibleCards = 3;
}

/* ---------- Setup / rebuild carousel ---------- */

function setupCarousel() {
    track.innerHTML = '';
    updateVisibleCards();

    const allCards = [...cards];
    const firstClones = allCards.slice(0, visibleCards).map(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });
    const lastClones = allCards.slice(-visibleCards).map(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });

    [...lastClones, ...allCards, ...firstClones].forEach(card => {
        track.appendChild(card);
    });

    currentIndex = visibleCards;
    updateCarousel(false);
}

/* ---------- Move carousel ---------- */

function updateCarousel(animated = true) {
    const allCards = Array.from(track.children);
    const cardWidth = allCards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    if (!animated) {
        track.style.transition = 'none';
    }
    else {
        track.style.transition = 'transform 0.5s ease';
    }

    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    if (!animated) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              track.style.transition = 'transform 0.5s ease';  
            });
        });
    }
}

/* ---------- Autoplay ---------- */

function startAutoplay() {
    stopAutoplay(); // prevents duplicates
    autoplayInterval = setInterval(() => {
        currentIndex++;
        updateCarousel(true);
    },  AUTOPLAY_DELAY);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}
/* ---------- Buttons ---------- */

nextBtn?.addEventListener('click', () => {
    stopAutoplay();
    currentIndex++;
    updateCarousel(true);
    startAutoplay();
});

prevBtn?.addEventListener('click', () => {
    stopAutoplay();
    currentIndex--;
    updateCarousel(true);
    startAutoplay();
});

/* ---------- Infinite loop correction ---------- */

track.addEventListener('transitionend', () => {
    const totalCards = track.children.length;

    // RIGHT → into first clones
    if (currentIndex >= realCardCount + visibleCards) {
        currentIndex = visibleCards;
        updateCarousel(false);
    }

    // LEFT ← into last clones
    if (currentIndex < visibleCards) {
        currentIndex = realCardCount + currentIndex;
        updateCarousel(false);
    }
});

window.addEventListener('resize', () => {
    setupCarousel();
});

/* =========================
   MOBILE ACCESSIBILITY
========================= */

/* ---------- Touch swipe ---------- */

let startX = 0;
let isDragging = false

track.addEventListener('touchstart', (e) => {
    stopAutoplay();
    startX = e.touches[0].clientX;
    isDragging = true;
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const diff = startX - e.touches[0].clientX;

    if (Math.abs(diff) > 50) {
        isDragging = false;
        currentIndex += diff > 0 ? 1 : -1;
        updateCarousel(true);
    }
}, { passive: true });

track.addEventListener('touchend', () => {
    isDragging = fals6e;
    startAutoplay();
});

track.addEventListener('touchcancel', () => {
    isDragging = false;
    startAutoplay();
});
/* ---------- Mouse hover ---------- */

track.addEventListener('mouseenter', stopAutoplay);
track.addEventListener('mouseleave', startAutoplay);

/* ---------- Keyboard navigation ---------- */

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        stopAutoplay();
        currentIndex++;
        updateCarousel(true);
        startAutoplay();
    }
    if (e.key === 'ArrowLeft') {
        stopAutoplay();
        currentIndex--;
        updateCarousel(true);
        startAutoplay();
    }
});

/* ---------- Resize ---------- */

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupCarousel, 150);
});

/* ---------- Init ---------- */

setupCarousel();
startAutoplay();

});

/* =========================
   3D SCROLL GALLERY
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const galleryCovers = document.querySelectorAll('.cf-gallery__cover');

    const updateGallery = () => {
        const viewCenter = window.innerHeight / 2;

        galleryCovers.forEach(cover => {
            const rect = cover.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            
            let progress = (itemCenter - viewCenter) / viewCenter;
            let absProg = Math.abs(progress);

            // 1. SELECTIVE DISPLACEMENT
            // This is the secret: If the card is away from the center, 
            // we counteract the scroll movement to "stack" them.
            // When progress is positive (below), we translateY negative to pull it up.
            // When progress is negative (above), we translateY positive to pull it down.
            const stackCompression = progress * -180; 
            
            // 2. THE PEAK POP
            // Only the card at the very center (absProg < 0.2) gets the full forward boost.
            const activeFactor = Math.pow(Math.max(0, 1 - absProg), 6);

            // 3. THE DEPTH
            // Cards in the "deck" sit at -200px. The active card jumps to +400px.
            const translateZ = (activeFactor * 600) - 200;
            
            // 4. THE TILT
            const rotateX = progress * 45;

            // Apply Transform
            // translateY(stackCompression) pulls the cards into a pile.
            cover.style.transform = `
                perspective(1500px)
                translateY(${stackCompression}px)
                translateZ(${translateZ}px)
                rotateX(${rotateX}deg)
                scale(${0.75 + (activeFactor * 0.25)})
            `;

            // 5. Z-INDEX
            // High for the active card, but also ensure cards higher in the HTML
            // are visually 'below' or 'above' correctly.
            cover.style.zIndex = Math.round(activeFactor * 100);
            
            // Hide cards that are too far away to keep performance high
            cover.style.opacity = absProg > 2 ? "0" : "1";
        });
    };

    window.addEventListener('scroll', updateGallery);
    window.addEventListener('resize', updateGallery);
    updateGallery(); 
});