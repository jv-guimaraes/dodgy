class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(vec) {
        return Math.hypot(Math.abs(this.x - vec.x), Math.abs(this.y - vec.y));
    }

    rotate(angle) {
        this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    }
}

function vec(x, y) {
    return new Vector(x, y);
}

function getCenter(element) {
    let x = element.pos.x + (element.width / 2);
    let y = element.pos.y + (element.height / 2);
    return new Vector(x, y);
}

function collides(player, enemy) {
    let distance = getCenter(player).distance(getCenter(enemy));
    return distance < (player.width + enemy.width)/2;
}

function rand(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
