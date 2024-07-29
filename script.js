document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");
    const resumeButton = document.getElementById("resumeButton");
    const quitButton = document.getElementById("quitButton");
    const pauseButton = document.getElementById("pauseButton");
    const loadScreen = document.getElementById("loadScreen");
    const gameScreen = document.getElementById("gameScreen");
    const pauseScreen = document.getElementById("pauseScreen");
    const gameArea = document.getElementById("gameArea");
    const instructions = document.getElementById("instructions");
    const timer = document.getElementById("timer");
    let gameInterval, timerInterval;
    let timeLeft = 60;

    playButton.addEventListener("click", startGame);
    resumeButton.addEventListener("click", resumeGame);
    quitButton.addEventListener("click", quitGame);
    pauseButton.addEventListener("click", pauseGame);

    function startGame() {
        loadScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        instructions.style.opacity = 1;
        setTimeout(() => {
            instructions.style.opacity = 0;
            startTimer();
            startBubbles();
        }, 3000);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timer.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function startBubbles() {
        gameInterval = setInterval(() => {
            createBubble();
        }, Math.random() * 500 + 500);
    }

    function createBubble() {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.style.width = bubble.style.height = Math.random() * 50 + 30 + "px";
        bubble.style.left = Math.random() * (gameArea.offsetWidth - 50) + "px";
        bubble.style.top = "0px";
        bubble.style.backgroundColor = getRandomColor();
        if (Math.random() > 0.5) {
            bubble.textContent = getEmotion();
        }
        gameArea.appendChild(bubble);
        animateBubble(bubble);
    }

    function animateBubble(bubble) {
        let top = 0;
        const bubbleFall = setInterval(() => {
            if (top < gameArea.offsetHeight) {
                top += 5;
                bubble.style.top = top + "px";
            } else {
                clearInterval(bubbleFall);
                gameArea.removeChild(bubble);
            }
        }, 50);

        bubble.addEventListener("click", () => {
            clearInterval(bubbleFall);
            if (bubble.textContent) {
                document.body.style.backgroundColor = "green";
                setTimeout(() => {
                    document.body.style.backgroundColor = "black";
                }, 300);
            } else {
                document.body.style.backgroundColor = "red";
                setTimeout(() => {
                    document.body.style.backgroundColor = "black";
                }, 300);
            }
            gameArea.removeChild(bubble);
        });
    }

    function getRandomColor() {
        const colors = ["purple", "green", "white"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function getEmotion() {
        const emotions = ["content", "mourning", "satisfied", "angry", "vibing", "love", "inspired"];
        return emotions[Math.floor(Math.random() * emotions.length)];
    }

    function pauseGame() {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        gameScreen.classList.add("hidden");
        pauseScreen.classList.remove("hidden");
    }

    function resumeGame() {
        gameScreen.classList.remove("hidden");
        pauseScreen.classList.add("hidden");
        startTimer();
        startBubbles();
    }

    function quitGame() {
        pauseScreen.classList.add("hidden");
        loadScreen.classList.remove("hidden");
        timeLeft = 60;
        timer.textContent = timeLeft;
        gameArea.innerHTML = "";
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert("Game over! Score: " + calculateScore());
        quitGame();
    }

    function calculateScore() {
        // Logic to calculate score based on correct and incorrect taps
        return Math.floor(Math.random() * 100); // Temporary random score
    }
});
