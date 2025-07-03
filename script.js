class BirthdayCard {
    constructor() {
        this.birthdayTarget = new Date('2025-07-03T18:00:00');
        this.isCardOpen = false;
        this.isMusicPlaying = false;
        this.confettiInterval = null;
        this.musicInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.startCountdown();
        this.createInitialBalloonAnimation();
    }
    
    initializeElements() {
        this.card = document.getElementById('birthdayCard');
        this.heartBtn = document.getElementById('heartBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.cakeBtn = document.getElementById('cakeBtn');
        this.confettiContainer = document.getElementById('confettiContainer');
        this.openSound = document.getElementById('openSound');
        this.birthdayMusic = document.getElementById('birthdayMusic');
        
        // Countdown display elements
        this.countdownHours = document.getElementById('countdownHours');
        this.countdownMinutes = document.getElementById('countdownMinutes');
        this.countdownSeconds = document.getElementById('countdownSeconds');
        this.countdownMessage = document.getElementById('countdownMessage');
    }
    
    bindEvents() {
        this.heartBtn.addEventListener('click', () => this.openCard());
        this.closeBtn.addEventListener('click', () => this.closeCard());
        this.cakeBtn.addEventListener('click', () => this.toggleMusic());
        
        // Prevent card from closing when clicking inside
        this.card.addEventListener('click', (e) => {
            if (this.isCardOpen && e.target === this.card) {
                this.closeCard();
            }
        });
    }
    
    openCard() {
        if (this.isCardOpen) return;
        
        this.isCardOpen = true;
        this.card.classList.add('open');
        
        // Play happy birthday melody
        this.playHappyBirthdayMelody();
        
        // Start confetti animation across the page
        setTimeout(() => {
            this.startConfetti();
        }, 600);
        
        // Stop confetti after 3 seconds
        setTimeout(() => {
            this.stopConfetti();
        }, 3600);
    }
    
    closeCard() {
        if (!this.isCardOpen) return;
        
        this.isCardOpen = false;
        this.card.classList.remove('open');
        this.stopConfetti();
        
        // Stop music when closing card
        if (this.isMusicPlaying) {
            this.toggleMusic();
        }
    }
    
    playHappyBirthdayMelody() {
        if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
            return;
        }
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Happy Birthday melody notes
        const melody = [
            { note: 'C', duration: 0.5 },
            { note: 'C', duration: 0.5 },
            { note: 'D', duration: 1 },
            { note: 'C', duration: 1 },
            { note: 'F', duration: 1 },
            { note: 'E', duration: 2 },
            { note: 'C', duration: 0.5 },
            { note: 'C', duration: 0.5 },
            { note: 'D', duration: 1 },
            { note: 'C', duration: 1 },
            { note: 'G', duration: 1 },
            { note: 'F', duration: 2 }
        ];
        
        const noteFrequencies = {
            'C': 261.63,
            'D': 293.66,
            'E': 329.63,
            'F': 349.23,
            'G': 392.00
        };
        
        let currentTime = audioContext.currentTime + 0.1;
        
        melody.forEach(({ note, duration }) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(noteFrequencies[note], currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration);
            
            currentTime += duration;
        });
    }
    
    toggleMusic() {
        if (this.isMusicPlaying) {
            if (this.musicInterval) {
                clearInterval(this.musicInterval);
                this.musicInterval = null;
            }
            this.cakeBtn.style.animation = '';
        } else {
            this.playBirthdayMelodyLoop();
            this.cakeBtn.style.animation = 'bounce 1s infinite';
        }
        this.isMusicPlaying = !this.isMusicPlaying;
    }
    
    playBirthdayMelodyLoop() {
        if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
            return;
        }
        
        const playMelody = () => {
            if (!this.isMusicPlaying) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const melody = [
                { note: 'C', duration: 0.4 },
                { note: 'C', duration: 0.4 },
                { note: 'D', duration: 0.8 },
                { note: 'C', duration: 0.8 },
                { note: 'F', duration: 0.8 },
                { note: 'E', duration: 1.6 },
                { note: 'C', duration: 0.4 },
                { note: 'C', duration: 0.4 },
                { note: 'D', duration: 0.8 },
                { note: 'C', duration: 0.8 },
                { note: 'G', duration: 0.8 },
                { note: 'F', duration: 1.6 }
            ];
            
            const noteFrequencies = {
                'C': 261.63,
                'D': 293.66,
                'E': 329.63,
                'F': 349.23,
                'G': 392.00
            };
            
            let currentTime = audioContext.currentTime + 0.1;
            let totalDuration = 0;
            
            melody.forEach(({ note, duration }) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(noteFrequencies[note], currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + duration);
                
                currentTime += duration;
                totalDuration += duration;
            });
            
            // Schedule next iteration
            if (this.isMusicPlaying) {
                this.musicInterval = setTimeout(() => {
                    if (this.isMusicPlaying) {
                        playMelody();
                    }
                }, (totalDuration + 1) * 1000);
            }
        };
        
        playMelody();
    }
    
    startConfetti() {
        // Love-themed red confetti colors
        const colors = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#ff69b4'];
        
        this.confettiInterval = setInterval(() => {
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
                }, i * 50);
            }
        }, 150);
    }
    
    stopConfetti() {
        if (this.confettiInterval) {
            clearInterval(this.confettiInterval);
            this.confettiInterval = null;
        }
    }
    
    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = color;
        
        // Position confetti to spread across the entire page
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.position = 'fixed';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        
        // Add heart shapes for love theme
        if (Math.random() < 0.3) {
            confetti.innerHTML = '❤️';
            confetti.style.fontSize = '12px';
            confetti.style.background = 'transparent';
        }
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 4000);
    }
    
    startCountdown() {
        const updateCountdown = () => {
            const now = new Date();
            const diff = this.birthdayTarget - now;
            
            if (diff <= 0) {
                this.countdownHours.textContent = '0';
                this.countdownMinutes.textContent = '0';
                this.countdownSeconds.textContent = '0';
                this.countdownMessage.textContent = 'Happy 43rd Birthday! 🎉';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            this.countdownHours.textContent = hours;
            this.countdownMinutes.textContent = minutes;
            this.countdownSeconds.textContent = seconds;
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    createInitialBalloonAnimation() {
        const balloons = document.querySelectorAll('.balloon');
        balloons.forEach((balloon, index) => {
            setInterval(() => {
                const randomX = Math.random() * 20 - 10;
                const randomY = Math.random() * 20 - 10;
                balloon.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }, 2000 + index * 500);
        });
    }
}

// Initialize the birthday card when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayCard();
});

// Add sparkle effects on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.05) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#3b82f6';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
