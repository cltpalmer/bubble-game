document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const gameScreen = document.getElementById('game-screen');
    const loadScreen = document.getElementById('load-screen');
    const pauseButton = document.getElementById('pause-button');
    const pauseScreen = document.getElementById('pause-screen');
    const resumeButton = document.getElementById('resume-button');
    const quitButton = document.getElementById('quit-button');
    const endScreen = document.getElementById('end-screen');
    const playAgainButton = document.getElementById('play-again-button');
    const exitButton = document.getElementById('exit-button');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    let bubbles = [];
    let score = 0;
    let gameInterval;
    let timerInterval;
    let timer = 60;
    let gamePaused = false;

    function startGame() {
        loadScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        bubbles = [];
        score = 0;
        timer = 60;
        gamePaused = false;
        startTimer();
        gameInterval = setInterval(generateBubble, 500 + Math.random() * 500);
        requestAnimationFrame(updateGame);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (!gamePaused) {
                timer--;
                timerDisplay.textContent = timer;
                if (timer === 0) {
                    endGame();
                }
            }
        }, 1000);
    }

    function pauseGame() {
        gamePaused = true;
        pauseScreen.classList.remove('hidden');
        clearInterval(gameInterval);
    }

    function resumeGame() {
        gamePaused = false;
        pauseScreen.classList.add('hidden');
        gameInterval = setInterval(generateBubble, 500 + Math.random() * 500);
        requestAnimationFrame(updateGame);
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        scoreDisplay.textContent = `Your score: ${score}`;
    }

    function generateBubble() {
        const bubble = {
            x: Math.random() * canvas.width,
            y: -20,
            radius: 20,
            color: getRandomColor(),
            emotion: Math.random() > 0.5,
        };
        bubbles.push(bubble);
    }

    function updateGame() {
        if (!gamePaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach((bubble, index) => {
                bubble.y += 2;
                if (bubble.y - bubble.radius > canvas.height) {
                    bubbles.splice(index, 1);
                }
                drawBubble(bubble);
            });
            requestAnimationFrame(updateGame);
        }
    }

    function drawBubble(bubble) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
    }

    function getRandomColor() {
        const colors = ['purple', 'green', 'white'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        bubbles.forEach((bubble, index) => {
            const distance = Math.hypot(x - bubble.x, y - bubble.y);
            if (distance < bubble.radius) {
                bubbles.splice(index, 1);
                playPopSound();
                showFeedback(bubble.emotion);
                if (bubble.emotion) {
                    score++;
                }
            }
        });
    });

    function playPopSound() {
        const popSound = new Audio('pop.mp3');
        popSound.play();
    }

    function showFeedback(correct) {
        const background = document.body;
        if (correct) {
            background.style.backgroundColor = 'green';
            setTimeout(() => {
                background.style.backgroundColor = 'black';
            }, 300);
        } else {
            background.style.backgroundColor = 'red';
            setTimeout(() => {
                background.style.backgroundColor = 'black';
            }, 300);
        }
    }

    playButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', pauseGame);
    resumeButton.addEventListener('click', resumeGame);
    quitButton.addEventListener('click', () => {
        pauseScreen.classList.add('hidden');
        loadScreen.classList.re
