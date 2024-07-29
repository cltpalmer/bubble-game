const playButton = document.getElementById('playButton');
const gameScreen = document.getElementById('gameScreen');
const loadScreen = document.getElementById('loadScreen');
const timerDisplay = document.getElementById('timer');
const pauseButton = document.getElementById('pauseButton');
const pauseScreen = document.getElementById('pauseScreen');
const resumeButton = document.getElementById('resumeButton');
const quitButton = document.getElementById('quitButton');
const endScreen = document.getElementById('endScreen');
const playAgainButton = document.getElementById('playAgainButton');
const exitButton = document.getElementById('exitButton');
const scoreDisplay = document.getElementById('score');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bubbles = [];
let score = 0;
let timer = 60;
let gameInterval, bubbleInterval;
let paused = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

playButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
quitButton.addEventListener('click', quitGame);
playAgainButton.addEventListener('click', startGame);
exitButton.addEventListener('click', () => window.location.reload());

function startGame() {
    loadScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    timer = 60;
    timerDisplay.textContent = timer;
    bubbles = [];
    gameInterval = setInterval(updateGame, 1000 / 60);
    bubbleInterval = setInterval(generateBubble, 500);
    countdown();
}

function pauseGame() {
    paused = true;
    clearInterval(gameInterval);
    clearInterval(bubbleInterval);
    pauseScreen.classList.remove('hidden');
}

function resumeGame() {
    paused = false;
    gameInterval = setInterval(updateGame, 1000 / 60);
    bubbleInterval = setInterval(generateBubble, 500);
    pauseScreen.classList.add('hidden');
}

function quitGame() {
    paused = false;
    clearInterval(gameInterval);
    clearInterval(bubbleInterval);
    gameScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    loadScreen.classList.remove('hidden');
}

function countdown() {
    if (timer > 0) {
        timer--;
        timerDisplay.textContent = timer;
        setTimeout(countdown, 1000);
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(bubbleInterval);
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    scoreDisplay.textContent = `Score: ${score}`;
}

function generateBubble() {
    const bubble = {
        x: Math.random() * canvas.width,
        y: -50,
        radius: 30 + Math.random() * 20,
        color: getRandomColor(),
        speed: 2,
        label: Math.random() > 0.5 ? getRandomEmotion() : ''
    };
    bubbles.push(bubble);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach((bubble, index) => {
        bubble.y += bubble.speed;

        if (bubble.y > canvas.height - bubble.radius || bubble.y < bubble.radius) {
            bubble.speed = -bubble.speed * 0.5;
        }

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();

        if (bubble.label) {
            ctx.fillStyle = 'white';
            ctx.font = '16px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText(bubble.label, bubble.x, bubble.y);
        }
    });

    bubbles = bubbles.filter(bubble => Math.abs(bubble.speed) > 0.5);
}

canvas.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    bubbles.forEach((bubble, index) => {
        if (Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2) < bubble.radius) {
            if (bubble.label) {
                document.body.style.backgroundColor = 'green';
                setTimeout(() => {
                    document.body.style.backgroundColor = 'black';
                }, 200);
                score++;
            } else {
                document.body.style.backgroundColor = 'red';
                setTimeout(() => {
                    document.body.style.backgroundColor = 'black';
                }, 200);
            }
            bubbles.splice(index, 1);
        }
    });
});

function getRandomColor() {
    const colors = ['#8A2BE2', '#ADFF2F', '#FFFFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomEmotion() {
    const emotions = ['content', 'mourning', 'satisfied', 'angry', 'vibing', 'love', 'inspired'];
    return emotions[Math.floor(Math.random() * emotions.length)];
}
