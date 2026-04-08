const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("currentScore");
const highEl = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const pauseMenu = document.getElementById("pauseMenu");
const muteBtn = document.getElementById("muteBtn");
const finalStats = document.getElementById("finalStats");

let gameActive = true;
let isPaused = false;
let isMuted = false;
let score = 0;
let frames = 0;
let highScore = localStorage.getItem("pumpkinHighScore") || 0;
highEl.innerText = highScore;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgOscillator = null;
let bgGain = null;


function playEffect(freq, type, duration, vol) {
    if (isMuted) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

function startBackgroundMusic() {
    if (bgOscillator) return;
    bgOscillator = audioCtx.createOscillator();
    bgGain = audioCtx.createGain();
    bgOscillator.type = 'triangle';
    bgOscillator.frequency.setValueAtTime(60, audioCtx.currentTime); 
    
    bgGain.gain.setValueAtTime(isMuted ? 0 : 0.05, audioCtx.currentTime);
    bgOscillator.connect(bgGain);
    bgGain.connect(audioCtx.destination);
    bgOscillator.start();
}

function toggleMute() {
    isMuted = !isMuted;
    muteBtn.innerText = isMuted ? "🔇" : "🔊";
    
    muteBtn.blur(); 

    if (bgGain) {
        bgGain.gain.setTargetAtTime(isMuted ? 0 : 0.05, audioCtx.currentTime, 0.1);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const pumpkin = {
    x: 100, y: 300, w: 45, h: 40,
    gravity: 0.22, jump: 6.5, velocity: 0,
    draw() {
        ctx.fillStyle = "#ff7518";
        ctx.beginPath();
        ctx.ellipse(this.x + 22, this.y + 20, 22, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2d5a27";
        ctx.fillRect(this.x + 20, this.y - 10, 6, 12);
        ctx.fillStyle = "black";
        ctx.beginPath(); ctx.moveTo(this.x + 12, this.y + 18); ctx.lineTo(this.x + 20, this.y + 18); ctx.lineTo(this.x + 16, this.y + 10); ctx.fill();
        ctx.beginPath(); ctx.moveTo(this.x + 28, this.y + 18); ctx.lineTo(this.x + 36, this.y + 18); ctx.lineTo(this.x + 32, this.y + 10); ctx.fill();
    },
    update() {
        if (isPaused) return;
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.h >= canvas.height || this.y <= 0) gameOver();
    }
};

const pipes = {
    position: [],
    width: 85,
    update() {
        if (isPaused) return;
        if (frames % 100 === 0) {
            let gap = Math.max(170, 280 - (score * 4));
            this.position.push({ x: canvas.width, y: Math.random() * (canvas.height - gap - 150) + 75, gap: gap });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= (4 + Math.min(score * 0.1, 4));
            
            if (pumpkin.x + pumpkin.w > p.x && pumpkin.x < p.x + this.width && (pumpkin.y < p.y || pumpkin.y + pumpkin.h > p.y + p.gap)) {
                gameOver();
            }
            
            if (p.x + 5 > pumpkin.x && p.x <= pumpkin.x) {
                score++; 
                scoreEl.innerText = score;
                playEffect(800, 'sine', 0.1, 0.03);
            }
            if (p.x + this.width <= 0) this.position.shift();
        }
    },
    draw() {
        for (let p of this.position) {
            ctx.fillStyle = "#333";
            ctx.fillRect(p.x, 0, this.width, p.y);
            ctx.fillRect(p.x, p.y + p.gap, this.width, canvas.height);
            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.font = "bold 20px Arial";
            ctx.fillText("R.I.P.", p.x + 15, p.y - 15);
        }
    }
};

function gameOver() {
    if (!gameActive) return;
    gameActive = false;
    playEffect(100, 'sawtooth', 0.6, 0.2); 
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("pumpkinHighScore", highScore);
        highEl.innerText = highScore;
    }
    finalStats.innerText = `Skóre: ${score} | Nejlepší: ${highScore}`;
    gameOverScreen.style.display = "block";
}

function togglePause() {
    if (!gameActive) return;
    isPaused = !isPaused;
    pauseMenu.style.display = isPaused ? "block" : "none";
    if (!isPaused) requestAnimationFrame(loop);
}

function reset() {
    score = 0; scoreEl.innerText = "0";
    frames = 0; pumpkin.y = 300; pumpkin.velocity = 0;
    pipes.position = [];
    gameActive = true; isPaused = false;
    gameOverScreen.style.display = "none";
    pauseMenu.style.display = "none";
    startBackgroundMusic();
    requestAnimationFrame(loop);
}

function loop() {
    if (!gameActive || isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#0d0d1a"; ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(canvas.width*0.8, 100, 40, 0, Math.PI*2); ctx.fill();

    pipes.update(); pipes.draw();
    pumpkin.update(); pumpkin.draw();
    
    frames++;
    requestAnimationFrame(loop);
}

// OVLÁDÁNÍ
window.addEventListener("keydown", (e) => {
    if (audioCtx.state === 'suspended') audioCtx.resume().then(() => startBackgroundMusic());
    
    if (e.code === "Escape") {
        togglePause();
        return;
    }

    if (isPaused) return;

    if (e.code === "Space") {
        e.preventDefault(); 
        if (!gameActive) reset();
        else { 
            pumpkin.velocity = -pumpkin.jump; 
            playEffect(200, 'triangle', 0.2, 0.05); 
        }
    }
});

canvas.addEventListener("mousedown", (e) => {
    if (audioCtx.state === 'suspended') audioCtx.resume().then(() => startBackgroundMusic());
    if (isPaused || e.button !== 0) return;
    if (!gameActive) reset();
    else { 
        pumpkin.velocity = -pumpkin.jump; 
        playEffect(200, 'triangle', 0.2, 0.05); 
    }
});

loop();