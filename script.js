function togglemenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

const track = document.querySelector ('.carousel-track')
const cards = Array.from(track.children)
const nextBtn = document.querySelector ('.carousel-btn.next')
const prevBtn = document.querySelector ('.carousel-btn.prev')
const realCardCount = cards.length

let visibleCards = 3;
let currentIndex;

function updateVisibleCards() {
    const width = window.innerWidth;
    if (width <= 600) visibleCards = 1;
    else if (width <= 900) visibleCards = 2;
    else visibleCards = 3;
}

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

function updateCarousel(animated = true) {
    const allCards = Array.from(track.children);
    const cardWidth = allCards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap);

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

nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel(true);
});

prevBtn.addEventListener('click', () => {
    currentIndex--;
    updateCarousel(true);
});

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

setupCarousel();