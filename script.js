// Configurações do Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('highscore');
const startBtn = document.getElementById('startBtn');

// Configurações do Jogo
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Variáveis do Jogo
let snake = [
    {x: 10, y: 10}
];
let dx = 0;
let dy = 0;
let apple = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let gameRunning = false;

// Mostrar recorde salvo
highscoreElement.textContent = highscore;

// ⌨️ Controles do Teclado
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// 🎮 Função Principal do Jogo
function gameLoop() {
    if (!gameRunning) return;
    
    // Limpar tela
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Mover cobra
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    
    // Verificar colisão com paredes
    if (head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Verificar colisão com próprio corpo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // Adicionar nova cabeça
    snake.unshift(head);
    
    // 🍎 Verificar se comeu a maçã
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        scoreElement.textContent = score;
        
        // Gerar nova maçã
        apple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Som de comer (opcional)
        playSound();
    } else {
        // Remover cauda (se não comeu maçã)
        snake.pop();
    }
    
    // 🐍 Desenhar cobra
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snake.length; i++) {
        // Cabeça mais clara
        if (i === 0) {
            ctx.fillStyle = '#6FD86F';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        
        ctx.fillRect(
            snake[i].x * gridSize + 2,
            snake[i].y * gridSize + 2,
            gridSize - 4,
            gridSize - 4
        );
    }
    
    // 🍎 Desenhar maçã
    ctx.fillStyle = '#FF3030';
    ctx.beginPath();
    ctx.arc(
        apple.x * gridSize + gridSize/2,
        apple.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Continuar o jogo
    setTimeout(gameLoop, 100);
}

// 🎯 Iniciar Jogo
function startGame() {
    snake = [{x: 10, y: 10}];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    startBtn.textContent = '🔄 REINICIAR';
    gameLoop();
}

// 💀 Game Over
function gameOver() {
    gameRunning = false;
    
    // Salvar recorde
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
        highscoreElement.textContent = highscore;
        alert(`🏆 NOVO RECORDE! ${score} maçãs!`);
    } else {
        alert(`💀 Game Over! Você comeu ${score} maçãs!`);
    }
    
    startBtn.textContent = '🎮 JOGAR NOVAMENTE';
}

// 🔊 Som (opcional)
function playSound() {
    // Criar som simples com Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Botão iniciar
startBtn.addEventListener('click', startGame);
