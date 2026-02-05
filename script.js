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

    // Hide page 1 bg decorations so they don't mix with heart rain
    document.querySelectorAll('.bg-decoration').forEach(el => {
        el.style.display = 'none';
    });

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
    // Create initial batch immediately so rain is visible right away
    for (let i = 0; i < 8; i++) {
        createRainHeart(true);
    }

    const isMobile = window.innerWidth <= 600;
    const interval = isMobile ? 600 : 400;

    heartRainInterval = setInterval(() => {
        // Limit total hearts in DOM for mobile performance
        const currentHearts = heartRainContainer.querySelectorAll('.heart-rain').length;
        const maxHearts = isMobile ? 12 : 20;
        if (currentHearts < maxHearts) {
            createRainHeart(false);
        }
    }, interval);
}

function createRainHeart(isInitial) {
    const emojis = ['💕', '💖', '💗', '💓', '💞', '💝'];
    const heart = document.createElement('div');
    heart.className = 'heart-rain';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random position
    heart.style.left = Math.random() * 95 + '%';

    // Random duration
    const isMobile = window.innerWidth <= 600;
    const duration = isMobile ? (4 + Math.random() * 2) : (6 + Math.random() * 3);
    heart.style.animationDuration = duration + 's';

    // No delay - hearts appear immediately
    heart.style.animationDelay = '0s';

    // For initial batch, start hearts at random positions mid-screen
    if (isInitial) {
        const startOffset = Math.random() * 80;
        heart.style.animationDelay = `-${(duration * startOffset) / 100}s`;
    }

    // Touch/click handler
    heart.addEventListener('click', () => collectHeart(heart));
    heart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        collectHeart(heart);
    }, { passive: false });

    heartRainContainer.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, (duration + 0.5) * 1000);
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
    const isMobile = window.innerWidth <= 600;
    const particleCount = isMobile ? 4 : 8;
    const distance = isMobile ? 60 : 100;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];

        const angle = (Math.PI * 2 * i) / particleCount;
        const dist = distance + Math.random() * 30;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 600);
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

    // Start emoji rain on page 3
    startPage3EmojiRain();
});

// Page 3 - Clickable hearts handlers
const clickableHeart1 = document.getElementById('clickableHeart1');
const clickableHeart2 = document.getElementById('clickableHeart2');
const finalReveal = document.getElementById('finalReveal');
const fireworkAudio = document.getElementById('fireworkAudio');
const heartsBackground = document.querySelector('.hearts-background');
const page3EmojiRain = document.getElementById('page3EmojiRain');
let page3RainInterval;

// Page 3 emoji rain
function startPage3EmojiRain() {
    page3RainInterval = setInterval(() => {
        createPage3RainEmoji();
    }, 300);
}

function createPage3RainEmoji() {
    const emojis = ['💕', '💖', '💗', '💓', '💞', '💝', '✨', '⭐', '💫', '🌟', '🌸', '🌺', '🌹', '🌷', '💐'];
    const emoji = document.createElement('div');
    emoji.className = 'page3-rain-emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random position
    emoji.style.left = Math.random() * 100 + '%';

    // Random duration
    const duration = 8 + Math.random() * 7;
    emoji.style.animationDuration = duration + 's';

    // Random delay
    emoji.style.animationDelay = Math.random() * 2 + 's';

    page3EmojiRain.appendChild(emoji);

    // Remove after animation
    setTimeout(() => {
        if (emoji.parentNode) {
            emoji.remove();
        }
    }, (duration + 2) * 1000);
}

// Create firework explosion with emojis
function createFireworkExplosion(x, y) {
    const emojis = ['✨', '⭐', '💫', '🌟', '💕', '💖', '💗', '💓', '💞'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-emoji';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Random direction for each particle
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 150 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotate = Math.random() * 720;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.setProperty('--rotate', rotate + 'deg');

        document.body.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}

// Create floating hearts background - positioned around edges to avoid faces
function createFloatingHeartsBackground() {
    const emojis = ['💕', '💖', '💗', '💓', '💞', '💝', '✨', '⭐', '💫', '🌟', '🌸', '🌺', '🌹', '🌷', '💐', '🩷', '❤️', '💘'];

    // Edge positions - avoid center where photo/faces are
    const edgePositions = [
        // Top edge
        { left: '5%', top: '5%' }, { left: '15%', top: '3%' }, { left: '25%', top: '8%' },
        { left: '75%', top: '5%' }, { left: '85%', top: '3%' }, { left: '95%', top: '8%' },
        // Bottom edge
        { left: '5%', top: '90%' }, { left: '15%', top: '93%' }, { left: '25%', top: '88%' },
        { left: '75%', top: '92%' }, { left: '85%', top: '95%' }, { left: '95%', top: '88%' },
        // Left edge
        { left: '2%', top: '20%' }, { left: '5%', top: '35%' }, { left: '3%', top: '50%' },
        { left: '5%', top: '65%' }, { left: '2%', top: '80%' },
        // Right edge
        { left: '95%', top: '20%' }, { left: '98%', top: '35%' }, { left: '95%', top: '50%' },
        { left: '98%', top: '65%' }, { left: '95%', top: '80%' },
        // Corners extra
        { left: '10%', top: '12%' }, { left: '90%', top: '12%' },
        { left: '10%', top: '85%' }, { left: '90%', top: '85%' },
        // More scattered edges
        { left: '35%', top: '2%' }, { left: '65%', top: '2%' },
        { left: '35%', top: '96%' }, { left: '65%', top: '96%' },
        { left: '8%', top: '45%' }, { left: '92%', top: '45%' }
    ];

    edgePositions.forEach((pos, i) => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
        emoji.style.left = pos.left;
        emoji.style.top = pos.top;
        emoji.style.opacity = '0.4';
        emoji.style.animation = `float ${4 + Math.random() * 4}s ease-in-out infinite`;
        emoji.style.animationDelay = (i * 0.15) + 's';
        emoji.style.pointerEvents = 'none';

        heartsBackground.appendChild(emoji);
    });
}

// First heart click handler
if (clickableHeart1) {
    clickableHeart1.addEventListener('click', (e) => {
        // Create firework explosions at click position
        const rect = clickableHeart1.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Create multiple explosions
        createFireworkExplosion(x, y);
        setTimeout(() => createFireworkExplosion(x - 100, y - 50), 200);
        setTimeout(() => createFireworkExplosion(x + 100, y - 50), 400);

        // Play firework sound (short - 2 seconds)
        fireworkAudio.currentTime = 0;
        fireworkAudio.play().catch(e => console.log('Firework audio play failed:', e));
        setTimeout(() => {
            fireworkAudio.pause();
            fireworkAudio.currentTime = 0;
        }, 2000);

        // Show final reveal with delay
        setTimeout(() => {
            finalReveal.classList.add('show');
            createFloatingHeartsBackground();
        }, 800);
    });
}

// Second heart click handler - opens YouTube video
if (clickableHeart2) {
    clickableHeart2.addEventListener('click', () => {
        window.open('https://youtu.be/7uinhV9khgY?si=G-3yusoE7t90nclr', '_blank');
    });
}

// Click anywhere on final reveal to close it
if (finalReveal) {
    finalReveal.addEventListener('click', () => {
        finalReveal.classList.remove('show');
        // Clear floating hearts
        if (heartsBackground) {
            heartsBackground.innerHTML = '';
        }
    });
}
