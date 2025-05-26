class Ghost {
    constructor(
        x, // Posição horizontal (x) inicial do fantasma no canvas
        y, // Posição vertical (y) inicial do fantasma no canvas
        width, // Largura do fantasma (usada para renderização e colisões)
        height, // Altura do fantasma (idem acima)
        speed, // Velocidade de movimento do fantasma
        imageX, // Coordenada X da imagem do sprite (de onde cortar a imagem)
        imageY, // Coordenada Y da imagem do sprite
        imageWidth, // Largura do recorte da imagem do sprite
        imageHeight, // Altura do recorte da imagem do sprite
        range // Alcance de detecção do fantasma (usado na IA)
    ) {
        this.x = x; // Define a posição horizontal inicial
        this.y = y; // Define a posição vertical inicial
        this.width = width; // Define a largura usada para desenhar o fantasma
        this.height = height; // Define a altura usada para desenhar o fantasma
        this.speed = speed; // Define a velocidade de movimento do fantasma
        this.direction = RIGHT; // Define a direção inicial (por padrão, para a direita)

        // Informações para desenhar o sprite (fantasma) da imagem
        this.imageX = imageX; // Posição X de corte na imagem
        this.imageY = imageY; // Posição Y de corte na imagem
        this.imageWidth = imageWidth; // Largura do corte
        this.imageHeight = imageHeight; // Altura do corte

        this.range = range; // Define o alcance de "visão" do fantasma para perseguir o jogador

        // Escolhe aleatoriamente um ponto de destino inicial da lista de alvos aleatórios
        this.randomTargetIndex = parseInt(Math.random() * 4); // Índice aleatório entre 0 e 3
        this.target = randomTargetsForGhosts[this.randomTargetIndex]; // Define o alvo inicial do fantasma

        // Define um intervalo para atualizar a direção do fantasma a cada 1 segundo
        this.changeDirectionInterval = setInterval(() => {
            this.updateDirection(); // Chama a função para atualizar a direção com base na lógica de IA
        }, 1000);

        // Define outro intervalo que muda aleatoriamente o destino a cada 10 segundos
        setInterval(() => {
            this.changeRandomDirection(); // Chama a função que altera a direção aleatoriamente
        }, 10000);
    }


// Perseguição definida por range (Lógica utilizada para validar a perseguição do fantasma)
// Esta lógica foi a parte a qual eu mais tive dificuldades em aplicar, pois envolve um conceito avançado de IA para perseguição
// A lógica de movimentação do fantasma pode ser entendida por duas fases, movimento aleatório simples e perseguição ao pacman quando está próximo
// Para esta lógica envolveu bastante pesquisa e materiais de referência como os sites StackOverflow, JovemNerd e o canal no youtube Servet Gulnaroglu (Programador Web)
// O mais impressionante é que o Pacman se trata de um jogo simples e antigo, porém mesmo sendo antigo possuí sistemas complexos como automação de ideias utilizado nas IA's de hoje
    isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if(
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true;
        }
        return false;
    }

// Atualizar o movimento do fantasma
    updateDirection() {
    const directions = [UP, DOWN, LEFT, RIGHT];
    let bestDirection = this.direction;
    let minDistance = Infinity;

    for (let dir of directions) {
        // Simular movimento
        let testX = this.x;
        let testY = this.y;
        switch (dir) {
            case UP: testY -= this.speed; break;
            case DOWN: testY += this.speed; break;
            case LEFT: testX -= this.speed; break;
            case RIGHT: testX += this.speed; break;
        }

        // Verificar colisão
        const tempX = this.x;
        const tempY = this.y;
        this.x = testX;
        this.y = testY;
        const collides = this.checkCollisions();
        this.x = tempX;
        this.y = tempY;
        if (collides) continue;

        // Calcular distância até o Pac-Man
        const dx = pacman.x - testX;
        const dy = pacman.y - testY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            minDistance = distance;
            bestDirection = dir;
        }
    }

    this.direction = bestDirection;
}

// Lógica de movimento do fantasma
    move() {
        if (this.isInRange()) {
            this.target = pacman;;
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForward();
        if (this.checkCollisions()) {
            this.moveBackward();
            return;
        }
    }

// Mudar a direção para cada indice aleatório
    changeRandomDirection() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

// Adição à lógica de movimento (Movimentos dianteiros e traseiros para cada caso)
    moveBackward() {
        switch(this.direction) {
            case RIGHT: this.x -= this.speed; break;
            case LEFT: this.x += this.speed; break;
            case UP: this.y += this.speed; break;
            case DOWN: this.y -= this.speed; break;
        }
    }

    moveForward() {
        switch(this.direction) {
            case RIGHT: this.x += this.speed; break;
            case LEFT: this.x -= this.speed; break;
            case UP: this.y -= this.speed; break;
            case DOWN: this.y += this.speed; break;
        }
    }

// Check de colisões atribuídas através do elemento do mapa e condições matemáticas binárias
    checkCollisions() {
        return (
            map[Math.floor(this.y / blockSize)][Math.floor(this.x / blockSize)] === 1 ||
            map[Math.floor((this.y + this.height - 1) / blockSize)][Math.floor(this.x / blockSize)] === 1 ||
            map[Math.floor(this.y / blockSize)][Math.floor((this.x + this.width - 1) / blockSize)] === 1 ||
            map[Math.floor((this.y + this.height - 1) / blockSize)][Math.floor((this.x + this.width - 1) / blockSize)] === 1
        );
    }

// Conceito para tomar o fantasma realizar tomadas de decisão com uma estratégia de autonomia de direção
// Utilizado material de referência e IA para aplicação do conceito
    changeDirectionIfPossible() {
        let tempDirection = this.direction
            this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / blockSize),
            parseInt(this.target.y / blockSize)
        );
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.direction == LEFT ||
                this.direction == RIGHT)
        ) {
            this.direction = UP
        }
        if (
            this.getMapX() != this.getMapXRightSide() &&
            this.direction == UP
        ) {
            this.direction = LEFT
        }
        this.moveForward();
        if (this.checkCollisions()) {
            this.moveBackward();
            this.direction = tempDirection;
        } else {
            this.moveBackward();
        }
        console.log(this.direction); // Testar o valor da direção do fantasma caso necessário
    }

// Checa possibilidades de direcionamento do fantasma através da "neighborList"
    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // Direção
    }

// Lógica complexa e avançada que define direção e traz autonomia para o fantasma
    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DOWN);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

// Lógica do mapa e atualizando a mente do fantasma para condições de espaço
    getMapX() {
        return Math.floor((this.x + this.width / 2) / blockSize);
    }
    getMapY() {
        return Math.floor((this.y + this.height / 2) / blockSize);
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + blockSize) / blockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + blockSize) / blockSize);
        return mapY;
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

// Desenho do fantasma
    draw() {
        ctx.save();
        ctx.drawImage(
            ghostSprites,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        ctx.restore();
    }
}

// Atualização dos fantasmas
    let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].move();
    }
};

// Desenhar os fantasmas
    let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};