let gameContainer = document.getElementById('gameContainer');
let playButton = document.getElementById('playButton');
let pauseButton = document.getElementById('pauseButton');
let resumeButton = document.getElementById('resumeButton');
let quitButton = document.getElementById('quitButton');
let playAgainButton = document.getElementById('playAgainButton');
let pauseOverlay = document.getElementById('pauseOverlay');
let timerElement = document.getElementById('timer');
let pointsElement = document.getElementById('points');

let bubbles = [];
let timer;
let gameInterval;
let speedInterval;
let isPaused = false;

const bubbleColors = ['#800080', '#008000', '#FFFFFF']; // Using hex codes for colors
const emotionLabels = ['happy', 'sad', 'angry']; // Sample emotion labels
let correctBubbleCount = 0;
let totalBubbleCount = 0;
let points = 0;
let bubbleSpeed = 8000; // Initial speed in milliseconds (8 seconds)

function startGame() {
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    timerElement.style.display = 'block';
    pointsElement.style.display = 'block';
    correctBubbleCount = 0;
    totalBubbleCount = 0;
    points = 0;
    bubbleSpeed = 8000;
    timer = 60;
    timerElement.textContent = timer;
    pointsElement.textContent = `Points: ${points}`;
    gameInterval = setInterval(gameLoop, 1000);
    speedInterval = setInterval(increaseSpeed, 10000);
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

function increaseSpeed() {
    if (bubbleSpeed > 2000) {
        bubbleSpeed -= 1000; // Increase speed by reducing the duration by 1 second
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
        bubble.style.left = '-50px';
        bubble.style.top = `${Math.random() * (gameContainer.clientHeight - size)}px`;
        bubble.dataset.isCorrect = Math.random() < 0.5; // Randomly mark bubbles as correct or incorrect
        if (bubble.dataset.isCorrect === 'true') {
            bubble.textContent = emotionLabels[Math.floor(Math.random() * emotionLabels.length)];
        }
        gameContainer.appendChild(bubble);
        animateBubble(bubble);
        bubbles.push(bubble);
        setTimeout(generateBubbles, Math.random() * 500 + 500);
    }
}

function animateBubble(bubble) {
    bubble.style.transition = `left ${bubbleSpeed}ms linear`;
    setTimeout(() => {
        bubble.style.left = `${gameContainer.clientWidth}px`;
    }, 0);
    setTimeout(() => {
        bubble.remove();
        bubbles = bubbles.filter(b => b !== bubble);
    }, bubbleSpeed);
}

function handleBubbleClick(event) {
    if (event.target.classList.contains('bubble')) {
        let bubble = event.target;
        if (bubble.dataset.isCorrect === 'true') {
            gameContainer.style.backgroundColor = 'green';
            setTimeout(() => gameContainer.style.backgroundColor = 'black', 300);
            correctBubbleCount++;
            points += 10; // Add points for correct bubble
        } else {
            gameContainer.style.backgroundColor = 'red';
            setTimeout(() => gameContainer.style.backgroundColor = 'black', 300);
            points -= 5; // Deduct points for incorrect bubble
        }
        pointsElement.textContent = `Points: ${points}`;
        bubble.remove();
        bubbles = bubbles.filter(b => b !== bubble);
        totalBubbleCount++;
    }
}

function pauseGame() {
    isPaused = true;
    clearInterval(gameInterval);
    clearInterval(speedInterval);
    bubbles.forEach(bubble => {
        let computedStyle = getComputedStyle(bubble);
        bubble.dataset.left = computedStyle.left;
        bubble.style.transition = 'none';
        bubble.style.left = computedStyle.left;
    });
    pauseOverlay.style.display = 'flex';
}

function resumeGame() {
    isPaused = false;
    bubbles.forEach(bubble => {
        bubble.style.transition = `left ${bubbleSpeed}ms linear`;
        bubble.style.left = `${gameContainer.clientWidth}px`;
    });
    pauseOverlay.style.display = 'none';
    gameInterval = setInterval(gameLoop, 1000);
    speedInterval = setInterval(increaseSpeed, 10000);
    generateBubbles();
}

function quitGame() {
    clearInterval(gameInterval);
    clearInterval(speedInterval);
    resetGame();
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(speedInterval);
    gameContainer.removeEventListener('click', handleBubbleClick);
    pauseButton.style.display = 'none';
    timerElement.style.display = 'none';
    bubbles.forEach(bubble => bubble.remove());
    bubbles = [];
    playAgainButton.style.display = 'block';
    alert(`Game Over! Correct Bubbles: ${correctBubbleCount}, Total Bubbles: ${totalBubbleCount}, Points: ${points}`);
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
    pointsElement.style.display = 'none';
    gameContainer.style.backgroundColor = 'black';
}

playButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
quitButton.addEventListener('click', quitGame);
playAgainButton.addEventListener('click', resetGame);
