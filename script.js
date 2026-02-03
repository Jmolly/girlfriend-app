// Get elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const heartsContainer = document.getElementById('heartsContainer');

// Initial sizes
let yesSize = 1;
let noSize = 1;

// Track if No button is being hovered
let noHoverCount = 0;

// No button hover effect - shrink No, grow Yes
noBtn.addEventListener('mouseenter', () => {
    noHoverCount++;

    // Shrink No button (minimum 0.3)
    noSize = Math.max(0.3, noSize - 0.15);
    noBtn.style.transform = `scale(${noSize})`;

    // Grow Yes button (maximum 2)
    yesSize = Math.min(2, yesSize + 0.2);
    yesBtn.style.transform = `scale(${yesSize})`;

    // Make No button harder to click as it shrinks
    if (noSize < 0.5) {
        noBtn.style.padding = '8px 16px';
    }
});

// Yes button click - go to celebration page
yesBtn.addEventListener('click', () => {
    page1.classList.remove('active');
    page2.classList.add('active');

    // Start fireworks
    startFireworks();
});

// No button click - unlikely but just in case
noBtn.addEventListener('click', () => {
    // Make it even harder by shrinking more
    noSize = Math.max(0.2, noSize - 0.2);
    noBtn.style.transform = `scale(${noSize})`;

    yesSize = Math.min(2.5, yesSize + 0.3);
    yesBtn.style.transform = `scale(${yesSize})`;
});

// Fireworks function
function startFireworks() {
    const emojis = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '💟', '💞'];

    // Create initial burst
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 100);
    }

    // Continue creating hearts periodically
    const interval = setInterval(() => {
        createHeart();
    }, 300);

    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);
}

function createHeart() {
    const emojis = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '💟', '💞'];
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random position
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 50 + 25 + 'vh';

    // Random delay
    heart.style.animationDelay = Math.random() * 0.5 + 's';

    heartsContainer.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 3000);
}
