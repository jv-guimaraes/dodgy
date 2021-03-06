class Player {
    constructor() {
        this.element = document.querySelector(".player");
        this.pos = vec(0 ,0);
        this.rect = this.element.getBoundingClientRect();
        this.width = this.rect.width;
        this.height = this.rect.height;
        this.colliding = false;
        this.hp = 100;
    }

    updatePos(x, y) {
        if (player.dead) return;
        this.pos.x = x - this.width / 2;
        this.pos.y = y - this.height / 2;
        this.element.style.left = this.pos.x + "px";
        this.element.style.top = this.pos.y + "px";
    }

    update() {
        if (player.dead) return;

        if (this.colliding) {
            this.element.style.backgroundColor = "red";
            this.hp -= 3;
            if (this.hp <= 0) {
                player.dead = true;
                player.colliding = false;
                player.hp = 0;
                endGame();
            }
        } else {
            this.element.style.backgroundColor = "royalblue";
        }
    }
}

class Enemy {
    constructor(pos, direction, speed){
        this.pos = pos;
        this.speed = speed;
        this.dir = direction;
        this.element = document.createElement("div");
        this.element.className = "enemy";
        document.body.appendChild(this.element);
        this.element.style.left = this.pos.x + "px";
        this.element.style.top = this.pos.y + "px";
        this.width = this.element.getBoundingClientRect().width;
        this.height = this.element.getBoundingClientRect().height;
        this.dead = false;
    }

    update() {
        //this.dir.rotate(0.013);
        this.pos.x += this.speed * this.dir.x;
        this.pos.y += this.speed * this.dir.y;
        
        if (this.pos.x >= window.innerWidth - this.width || this.pos.x <= 0) {
            this.dead = true;
            return;
        }
        if (this.pos.y >= window.innerHeight - this.height || this.pos.y <= 0) {
            this.dead = true;
            return;
        }
        
        this.element.style.left = this.pos.x + "px";
        this.element.style.top = this.pos.y + "px";
    }
}

function spawnEnemy(pos, dir, speed) {
    enemies.push(new Enemy(pos, dir, speed));
}

function spawnEnemies() {
    if (player.dead) return;

    let pos = vec( rand(0, window.innerWidth), 0 );
    let dir = vec(0, 1);
    spawnEnemy(pos, dir, 12);

    pos = vec( 0, rand(0, window.innerHeight) );
    dir = vec(1, 0);
    spawnEnemy(pos, dir, 12);

    pos = vec( window.innerWidth - 30, rand(0, window.innerHeight) );
    dir = vec(-1, 0);
    spawnEnemy(pos, dir, 11);
    
}

function updateEnemies() {
    if (player.dead) return;

    player.colliding = false;
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (enemy.dead) {
            enemy.element.remove(); enemies.splice(i, 1);
        }
        else {
            enemy.update();
            if ( collides(enemy, player) ) {
                player.colliding = true;
            }
        }
    }
}

function updateHpElement() {
    if (player.dead) {
        hp.style.color = "grey";
        hp.innerHTML = "HP: " + player.hp;
    }
    else if (player.colliding) {
        hp.style.color = "red";
        hp.innerHTML = "HP: " + player.hp + "!!!";
    } else {
        hp.style.color = "green";
        hp.innerHTML = "HP: " + player.hp;
    }
}

function updateTimer() {
    if (player.dead) return;
    timer.time++;
    timer.element.innerHTML = timer.time;
}

function killEnemies() {
    enemies.forEach(enemy => {
        enemy.element.remove()
    });
    enemies = [];
}

function endGame() {
    player.element.hidden = true;
    killEnemies();
    playAgainButton.hidden = false;
    document.querySelector("html").style.cursor = "pointer";
}

function restartGame() {
    player.dead = false;
    player.element.hidden = false;
    player.hp = 100;
    playAgainButton.hidden = true;
    timer.time = 0; timer.element.innerHTML = timer.time;
    document.querySelector("html").style.cursor = "none";
}

function gameLoop() {
    player.update();
    updateEnemies();
    updateHpElement();
}

/* GLOBAL VARIABLES */
let player = new Player();
let enemies = [];
let hp = document.querySelector(".hp");
let timer = {element: document.querySelector(".timer"), time: 0}; timer.element.innerHTML = 0;
let playAgainButton = document.querySelector(".playAgainButton");
/*-----------------------------------------*/

window.addEventListener("mousemove", (event)=>{player.updatePos(event.clientX, event.clientY)});
playAgainButton.addEventListener("click", restartGame);
setInterval(gameLoop, 16);
setInterval(spawnEnemies, 225);
setInterval(updateTimer, 1000);
