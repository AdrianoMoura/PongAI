export default class Enemy {
    constructor() {
        this.width = 20
        this.height = 100
        this.reset()
        this.accel = 6
        this.vel;
    }

    think() {
        if (ball.pos.y <= this.pos.y) {
            this.move(-1)
            return
        }

        if (ball.pos.y >= this.pos.y + this.height) {
            this.move(1)
            return
        }

        this.move()
    }

    move(direction = 0) {
        this.vel = p5.createVector(0, direction * this.accel)
    }

    update() {
        if (this.vel.y > 0 && this.pos.y > canvasHeight - this.height) {
            return
        } else if (this.vel.y < 0 && this.pos.y < 0) {
            return
        } else {
            this.pos.add(this.vel)
        }
    }

    render() {
        // Draw ship
        p5.push()
        p5.fill(255)
        p5.stroke(255)

        p5.rect(this.pos.x, this.pos.y, this.width, this.height);

        p5.pop()
    }

    reset() {
        this.pos = p5.createVector(canvasWidth - this.width - 20, canvasHeight / 2 - this.height / 2)
        this.vel = p5.createVector(0, 0)
    }
}