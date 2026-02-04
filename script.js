// Get elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const heartsContainer = document.getElementById('heartsContainer');
const heartRainContainer = document.getElementById('heartRainContainer');
const surpriseQuestion = document.getElementById('surpriseQuestion');
const surpriseYes = document.getElementById('surpriseYes');
const surpriseNo = document.getElementById('surpriseNo');
const noMessage = document.getElementById('noMessage');
const collectChallenge = document.getElementById('collectChallenge');
const heartCount = document.getElementById('heartCount');
const finalButton = document.getElementById('finalButton');
const btsAudio = document.getElementById('btsAudio');
const rickrollAudio = document.getElementById('rickrollAudio');
const sparkleAudio = document.getElementById('sparkleAudio');

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

    // Start heart rain
    startHeartRain();

    // Play BTS music
    btsAudio.play().catch(e => console.log('Audio play failed:', e));
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

// Heart rain functionality
let heartsCollected = 0;
let challengeActive = false;
let heartRainInterval;
const noMessages = ['Wrong answer! 😏', 'Try again! 😊'];
let noClickCount = 0;

function startHeartRain() {
    heartRainInterval = setInterval(() => {
        createRainHeart();
    }, 400);
}

function createRainHeart() {
    const emojis = ['💕', '💖', '💗', '💓', '💞', '💝'];
    const heart = document.createElement('div');
    heart.className = 'heart-rain';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random position
    heart.style.left = Math.random() * 95 + '%';

    // Random duration
    const duration = 6 + Math.random() * 3;
    heart.style.animationDuration = duration + 's';

    // Random delay
    heart.style.animationDelay = Math.random() * 1 + 's';

    // Always add click handler - collectHeart will check if challenge is active
    heart.addEventListener('click', () => collectHeart(heart));

    heartRainContainer.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, (duration + 1) * 1000);
}

// Surprise question handlers
surpriseNo.addEventListener('click', () => {
    noMessage.textContent = noMessages[noClickCount % 2];
    noClickCount++;

    // Trigger animation
    noMessage.style.animation = 'none';
    setTimeout(() => {
        noMessage.style.animation = 'shake 0.5s ease';
    }, 10);
});

surpriseYes.addEventListener('click', () => {
    surpriseQuestion.style.display = 'none';
    collectChallenge.style.display = 'block';
    challengeActive = true;

    // Make heart rain interactive - bring it to front
    heartRainContainer.classList.add('interactive');
});

// Sparkle sound function - play audio file
function playSparkleSound() {
    // Reset audio to beginning and play
    sparkleAudio.currentTime = 0;
    sparkleAudio.play().catch(e => console.log('Sparkle audio play failed:', e));
}

// Create explosion particles
function createExplosion(x, y) {
    const particles = ['💕', '💖', '💗', '💓', '💞', '✨', '⭐'];
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];

        // Random direction for each particle
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Collect heart function
function collectHeart(heart) {
    if (!challengeActive) return;

    // Play sparkle sound
    playSparkleSound();

    // Get heart position for explosion
    const rect = heart.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create explosion effect
    createExplosion(x, y);

    heart.classList.add('clicked');
    heartsCollected++;
    heartCount.textContent = heartsCollected;

    // Remove heart
    setTimeout(() => {
        heart.remove();
    }, 600);

    // Check if collected 10 hearts
    if (heartsCollected >= 10) {
        challengeActive = false;
        finalButton.style.display = 'block';

        // Move heart rain back to background
        heartRainContainer.classList.remove('interactive');
    }
}

// Final button handler
finalButton.addEventListener('click', () => {
    page2.classList.remove('active');
    page3.classList.add('active');

    // Stop heart rain
    clearInterval(heartRainInterval);

    // Stop BTS music and play rickroll
    btsAudio.pause();
    btsAudio.currentTime = 0;
    rickrollAudio.play().catch(e => console.log('Audio play failed:', e));
});
