// Foi utilizado modelos de IA para identações, criações da lógica do jogo e para atribuição de lógicas matemáticas

// Variáveis globais
const blockSize = 20; // Tamanho de cada bloco
const wallColor = "#342DCA"; // Cor das paredes
const wallWidth = blockSize / 1.4; // Largura das paredes
const wallOffset = (blockSize - wallWidth) / 2; // Offset das paredes
const FPS = 30; // Frames por segundo

let score = 0; // Pontuação inicial
let gameCompleted = false; // Atribuição para verificar se o jogo foi zerado.
let isGameOver = false; // Atribuição para verificar se as vidas foram zeradas
let lives = 3; // Vidas iniciais
let map = [ // Mapa do jogo definido através de sistemas de identificação binária (ideal para o jogo do pacman)
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,2,1,2,2,2,1,2,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,2,1,1,1,1,1,2,1,2,1,0,0,0,0],
    [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,2,2,1,1,1,1,1,2,2,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1],
    [1,1,2,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,2,1,1],
    [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Este mapa é padrão para jogos no estilo labirinto e a ideia foi referenciada através de uma comunidade do reddit
// 0: Nada
// 1: Parede
// 2: Comida

let ctx; // Contexto do canvas
let pacmanSprites; // Imagem dos sprites do Pacman
let ghostSprites; // Imagem dos sprites dos fantasmas
const originalMap = JSON.parse(JSON.stringify(map)); // Cópia original do mapa para reiniciar elementos


// Atribuição de presas aleatórias para os fantasmas
let randomTargetsForGhosts = [
    { x: 1 * blockSize, y: 1 * blockSize },
    { x: 1 * blockSize, y: (map.length - 2) * blockSize },
    { x: (map[0].length - 2) * blockSize, y: blockSize },
    {
        x: (map[0].length - 2) * blockSize,
        y: (map.length - 2) * blockSize,
    },
];

// Botão voltar
const btnHome = document.getElementById('btnHome');
btnHome.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Funções do jogo
function initializeCanvas() {
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    pacmanSprites = document.getElementById('pacmanSprites');
    ghostSprites = document.getElementById('ghostSprites');
}

// Chamando fantamas e o pacman
let pacman;
let ghosts = [];
const ghostCount = 4;


// Iniciando o canvas
function initializePacman() {
    pacman = new Pacman(blockSize * 10, blockSize * 13, blockSize, blockSize, blockSize / 4);
}

// Função para criar os fantasmas no meio do mapa
function createGhosts() {
    ghosts.length = 0;
    const startPositions = [
        { x: blockSize * 9, y: blockSize * 10 },
        { x: blockSize * 10, y: blockSize * 10 },
        { x: blockSize * 9, y: blockSize * 11 },
        { x: blockSize * 10, y: blockSize * 11 },
    ];
    const ghostImages = [
        { x: 0, y: 0 },
        { x: 176, y: 0 },
        { x: 0, y: 121 },
        { x: 176, y: 121 },
    ];
    for (let i = 0; i < ghostCount; i++) {
        const pos = startPositions[i];
        const img = ghostImages[i];
        ghosts.push(new Ghost(pos.x, pos.y, blockSize, blockSize, blockSize / 8, img.x, img.y, 124, 116, 8));
    }
}

// Lógica do jogo
function updateGame() {
    pacman.move();
    pacman.consume();
    ghosts.forEach(g => g.move());
    if (pacman.checkCollisionWithGhosts(ghosts)) {
        handleGhostCollision();
    }
}

// Reiniciar o jogo
function restartGame() {
    clearInterval(gameInterval);
    score = 0;
    lives = 3;
    gameCompleted = false;
    isGameOver = false;

    document.getElementById('GameOver').style.display = "none";
    document.getElementById('Passou').style.display = "none";

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (originalMap[i][j] === 2) {
                map[i][j] = 2;
            }
        }
    }

    updateScoreDisplay();
    updateLivesDisplay();
    startGame();
}


// Caso o usuário conclua a fase
function updateScore(points) {
    score += points; // Atualiza o score
    updateScoreDisplay();

    if (score >= 219) {
        gameCompleted = true;
        clearInterval(gameInterval); // Para o jogo
        document.getElementById('Passou').style.display = "flex"; // Exibe tela de vitória
        return;
    }
}

// Caso o usuário perca a fase
function handleGhostCollision() {
    lives--;
    updateLivesDisplay();
    if (lives <= 0) {
        isGameOver = true;
        clearInterval(gameInterval); // para o jogo
        document.getElementById('GameOver').style.display = "flex"; // Exibe a tela de derrota
        return;
    }
    resetPositions();
}

// Resetar a posição do pacman e dos fantasmas
function resetPositions() {
    initializePacman();
    createGhosts();
}

// Função utilitária para desenhar retângulos no canvas
function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}


// Toda complexidade das paredes
function renderWalls() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 1) {
                drawRectangle(j * blockSize, i * blockSize, blockSize, blockSize, wallColor);
                if (j > 0 && map[i][j - 1] === 1) {
                    drawRectangle(j * blockSize, i * blockSize + wallOffset, wallWidth + wallOffset, wallWidth, "black");
                }
                if (j < map[0].length - 1 && map[i][j + 1] === 1) {
                    drawRectangle(j * blockSize + wallOffset, i * blockSize + wallOffset, wallWidth + wallOffset, wallWidth, "black");
                }
                if (i < map.length - 1 && map[i + 1][j] === 1) {
                    drawRectangle(j * blockSize + wallOffset, i * blockSize + wallOffset, wallWidth, wallWidth + wallOffset, "black");
                }
                if (i > 0 && map[i - 1][j] === 1) {
                    drawRectangle(j * blockSize + wallOffset, i * blockSize, wallWidth, wallWidth + wallOffset, "black");
                }
            }
        }
    }
}

// Criação das comidas do mapa
function renderFood() {
    for (let i=0; i<map.length; i++) {
        for (let j=0; j<map[i].length; j++) {
            if (map[i][j] === 2) {
                drawRectangle(j * blockSize + blockSize/3, i * blockSize + blockSize/3, blockSize/3, blockSize/3, "#FEB897");
            }
        }
    }
}

// Score do usuário
function renderScore() {
    document.getElementById('score').innerText = 'Pontos: ' + score;
}

// Vida do usuário
function renderLives() {
    document.getElementById('lives').innerText = 'Vidas: ' + lives;
}

// Renderizar os fantasmas
function renderGhosts() {
    ghosts.forEach(g => g.draw());
}

// Fechar o canvas, (utilizado para casos especificos)
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Renderizar todo o jogo e sua lógica
function renderGame() {
    clearCanvas();
    drawRectangle(0, 0, canvas.width, canvas.height, "black");
    renderWalls();
    renderFood();
    renderGhosts();
    pacman.draw();
}

// Intervalo entre telas
let gameInterval;
function startGame() {
    initializeCanvas();

    // Aguarda carregamento dos sprites
    if (!pacmanSprites.complete || !ghostSprites.complete) {
        setTimeout(startGame, 100);
        return;
    }

    // PARA intervalo anterior se existir
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    resetPositions();
    updateScoreDisplay();
    updateLivesDisplay();

    gameInterval = setInterval(() => {
        updateGame();
        renderGame();
    }, 1000 / FPS);
}

// Lógica da movimentação do pacman
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            pacman.nextDirection = LEFT;
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            pacman.nextDirection = UP;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            pacman.nextDirection = RIGHT;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            pacman.nextDirection = DOWN;
            break;
    }
});

// Atualizar o score/pontos do usuário
function updateScoreDisplay() {
    document.getElementById('score').innerText = 'Pontos: ' + score;
}

// Atualizar a vida do usuário
function updateLivesDisplay() {
    document.getElementById('lives').innerText = 'Vidas: ' + lives;
}

startGame();