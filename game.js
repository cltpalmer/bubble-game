let gameContainer = document.getElementById('gameContainer');
let playButton = document.getElementById('playButton');
let pauseButton = document.getElementById('pauseButton');
let resumeButton = document.getElementById('resumeButton');
let quitButton = document.getElementById('quitButton');
let playAgainButton = document.getElementById('playAgainButton');
let pauseOverlay = document.getElementById('pauseOverlay');
let timerElement = document.getElementById('timer');

let bubbles = [];
let timer;
let gameInterval;
let isPaused = false;

const bubbleColors = ['purple', 'green', 'white'];
const emotionLabels = ['happy', 'sad', 'angry']; // Sample emotion labels
let correctBubbleCount = 0;
let totalBubbleCount = 0;

function startGame() {
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    timerElement.style.display = 'block';
    correctBubbleCount = 0;
    totalBubbleCount = 0;
    timer = 60;
    timerElement.textContent = timer;
    gameInterval = setInterval(gameLoop, 1000);
    gameContainer.addEventListener('click', handleBubbleClick);
    generateBubbles();
}

function gameLoop() {
    if (!isPaused) {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }
}

function generateBubbles() {
    if (!isPaused) {
        let bubble = document.createElement('div');
        bubble.classList.add('bubble');
        let size = Math.random() * 50 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.backgroundColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        bubble.style.top = '-50px';
        bubble.style.left = `${Math.random() * (gameContainer.clientWidth - size)}px`;
        bubble.dataset.isCorrect = Math.random() < 0.5; // Randomly mark bubbles as correct or incorrect
        if (bubble.dataset.isCorrect === 'true') {
            bubble.textContent = emotionLabels[Math.floor(Math.random() * emotionLabels.length)];
        }
        gameContainer.appendChild(bubble);
        console.log(`Generated bubble at ${bubble.style.left} with color ${bubble.style.backgroundColor}`);
        animateBubble(bubble);
        bubbles.push(bubble);
        setTimeout(generateBubbles, Math.random() * 500 + 500);
    }
}

function animateBubble(bubble) {
    let fallDuration = 2000;
    bubble.style.transition = `top ${fallDuration}ms linear`;
    setTimeout(() => {
        bubble.style.top = `${gameContainer.clientHeight}px`;
    }, 0);
    setTimeout(() => {
        bubble.remove();
        bubbles = bubbles.filter(b => b !== bubble);
    }, fallDuration);
}

function handleBubbleClick(event) {
    if (event.target.classList.contains('bubble')) {
        let bubble = event.target;
        if (bubble.dataset.isCorrect === 'true') {
            gameContainer.style.backgroundColor = 'green';
            setTimeout(() => gameContainer.style.backgroundColor = 'black', 300);
            correctBubbleCount++;
        } else {
            gameContainer.style.backgroundColor = 'red';
            setTimeout(() => gameContainer.style.backgroundColor = 'black', 300);
        }
        bubble.remove();
        bubbles = bubbles.filter(b => b !== bubble);
        totalBubbleCount++;
    }
}

function pauseGame() {
    isPaused = true;
    clearInterval(gameInterval);
    bubbles.forEach(bubble => {
        let computedStyle = getComputedStyle(bubble);
        bubble.dataset.top = computedStyle.top;
        bubble.style.transition = 'none';
        bubble.style.top = computedStyle.top;
    });
    pauseOverlay.style.display = 'flex';
}

function resumeGame() {
    isPaused = false;
    bubbles.forEach(bubble => {
        bubble.style.transition = 'top 2000ms linear';
        bubble.style.top = `${gameContainer.clientHeight}px`;
    });
    pauseOverlay.style.display = 'none';
    gameInterval = setInterval(gameLoop, 1000);
    generateBubbles();
}

function quitGame() {
    clearInterval(gameInterval);
    resetGame();
}

function endGame() {
    clearInterval(gameInterval);
    gameContainer.removeEventListener('click', handleBubbleClick);
    pauseButton.style.display = 'none';
    timerElement.style.display = 'none';
    bubbles.forEach(bubble => bubble.remove());
    bubbles = [];
    playAgainButton.style.display = 'block';
    alert(`Game Over! Correct Bubbles: ${correctBubbleCount}, Total Bubbles: ${totalBubbleCount}`);
}

function resetGame() {
    bubbles.forEach(bubble => bubble.remove());
    bubbles = [];
    isPaused = false;
    pauseOverlay.style.display = 'none';
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';
    playAgainButton.style.display = 'none';
    timerElement.style.display = 'none';
    gameContainer.style.backgroundColor = 'black';
}

playButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
quitButton.addEventListener('click', quitGame);
playAgainButton.addEventListener('click', resetGame);
