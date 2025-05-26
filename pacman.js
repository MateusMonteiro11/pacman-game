const RIGHT = 4, UP = 3, LEFT = 2, DOWN = 1; // Somente dando valores para cada direção

class Pacman {
    constructor(
        x, // Posição inicial horizontal (x) de pacman no canvas
        y, // Posição inicial vertical (y)
        width, // Largura do sprite de pacman
        height, // Altura do sprite de pacman
        speed // Velocidade com que pacman se move
    ) {
        this.x = x; // Define a posição horizontal inicial
        this.y = y; // Define a posição vertical inicial
        this.width = width; // Define a largura de pacman para renderização/colisão
        this.height = height; // Define a altura de pacman

        this.speed = speed; // Velocidade de movimento de pacman

        this.direction = RIGHT; // Direção atual em que pacman está se movendo (por padrão: direita)
        this.nextDirection = RIGHT; // Direção que pacman tentará seguir a seguir (para suavizar controle do jogador)

        this.currentFrame = 1; // Quadro atual da animação do sprite de pacman
        this.frameCount = 7; // Número total de quadros da animação (por exemplo, para a "boca abrindo e fechando")

        // Cria um intervalo que atualiza a animação de pacman a cada 100 milissegundos
        this.animationInterval = setInterval(() => this.updateAnimation(), 100);
    }


// Lógica do movimento
    move() {
        this.updateDirectionIfPossible();
        this.moveForward();
        if (this.checkCollisions()) this.moveBackward();
    }

// Atribuíndo existência para ação de comer do pacman com "row"(linha) e "col"(coluna)
    consume() {
    const row = Math.floor(this.y / blockSize);
    const col = Math.floor(this.x / blockSize);

    if (map[row][col] === 2) {
        map[row][col] = 0;
        updateScore(1); // <- aqui está a chave
    }
}

// Lógica do movimento traseiro
    moveBackward() {
        switch(this.direction) {
            case RIGHT: this.x -= this.speed; break;
            case LEFT: this.x += this.speed; break;
            case UP: this.y += this.speed; break;
            case DOWN: this.y -= this.speed; break;
        }
    }

// Lógica do movimento dianteiro
    moveForward() {
        switch(this.direction) {
            case RIGHT: this.x += this.speed; break;
            case LEFT: this.x -= this.speed; break;
            case UP: this.y -= this.speed; break;
            case DOWN: this.y += this.speed; break;
        }
    }

// Checador de colisões com atribuições matemáticas de acordo com o mapa
    checkCollisions() {
        return (
            map[Math.floor(this.y / blockSize)][Math.floor(this.x / blockSize)] === 1 ||
            map[Math.floor((this.y + this.height - 1) / blockSize)][Math.floor(this.x / blockSize)] === 1 ||
            map[Math.floor(this.y / blockSize)][Math.floor((this.x + this.width - 1) / blockSize)] === 1 ||
            map[Math.floor((this.y + this.height - 1) / blockSize)][Math.floor((this.x + this.width - 1) / blockSize)] === 1
        );
    }

// Checador de colisões com o fantasma
    checkCollisionWithGhosts(ghosts) {
        return ghosts.some(g => g.getMapX() === this.getMapX() && g.getMapY() === this.getMapY());
    }

// Lógica de aplicar movimento caso não haja uma barreira, e mesmo se tiver o movimento será armazenado até o movimento ser possível
    updateDirectionIfPossible() {
        if (this.direction === this.nextDirection) return;
        const previousDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForward();
        if (this.checkCollisions()) {
            this.moveBackward();
            this.direction = previousDirection;
        } else {
            this.moveBackward();
        }
    }

// Aplicando conceito de espaço para o pacman
    getMapX() {
        return Math.floor((this.x + this.width/2) / blockSize);
    }
    getMapY() {
        return Math.floor((this.y + this.height/2) / blockSize);
    }
    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + blockSize) / blockSize);
        return mapX;
    }
    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + blockSize) / blockSize);
        return mapY;
    }

// Atualizar a animação do pacman para abrir e fechar a boca de acordo com o sprite
    updateAnimation() {
        this.currentFrame = this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
    }

// Desenho do pacman
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        let rotation = 0;
        if (this.direction === RIGHT) rotation = 0;
        else if (this.direction === DOWN) rotation = Math.PI / 2;
        else if (this.direction === LEFT) rotation = Math.PI;
        else if (this.direction === UP) rotation = 3 * Math.PI / 2;
        ctx.rotate(rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        const frameWidth = blockSize;
        const frameHeight = blockSize;
        const sx = (this.currentFrame - 1) * frameWidth;
        const sy = 0;
        ctx.drawImage(pacmanSprites, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        ctx.restore();
    }
}