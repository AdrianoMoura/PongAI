export default class Ball {
    constructor() {
        this.width = 20
        this.height = 20
        this.reset()
    }

    update() {
        this.checkWallCollision()
        this.checkPlayerCollision()
        this.checkEnemyCollision()

        this.pos.add(this.force)
    }

    render() {
        // Draw ship
        p5.push()
        p5.fill(255)
        p5.stroke(255)

        p5.rect(this.pos.x, this.pos.y, this.width, this.height)

        p5.pop()
    }

    checkWallCollision() {
        if (this.pos.y < 0) {
            this.bounce(0, 1)
        } else if (this.pos.y > canvasHeight - this.height) {
            this.bounce(0, -1)
        } else if (this.pos.x < 10) {
            generation.goToNextSpecimen()
        } else if (this.pos.x > canvasWidth - 10) {
            gameController.makePoint()
            gameController.startNew()
        }
    }

    checkPlayerCollision() {
        const player = generation.getActualSpecimen()

        if (this.pos.x <= player.pos.x + player.width && this.pos.y + this.height > player.pos.y && this.pos.y < player.pos.y + player.height && this.pos.x >= player.pos.x) {
            this.bounce(1, 0)
            this.force.y += player.vel.y / 5
        }
    }

    checkEnemyCollision() {
        const player = enemy

        if (this.pos.x + this.width >= player.pos.x && this.pos.y + this.height > player.pos.y && this.pos.y < player.pos.y + player.height && this.pos.x + this.width <= player.pos.x + player.width) {
            this.bounce(-1, 0)
            this.force.y += player.vel.y / 5
        }
    }

    bounce(multiplyX, multiplyY) {
        if (multiplyX) {
            this.force.x = Math.abs(this.force.x) * multiplyX
        }

        if (multiplyY) {
            this.force.y = Math.abs(this.force.y) * multiplyY
        }
    }

    reset() {
        this.pos = p5.createVector(canvasWidth / 2 - this.width / 2, canvasHeight / 2 - this.height / 2)
        this.heading = p5.random(0, p5.TWO_PI)
        this.force = p5.createVector(-1, Math.sin(this.heading))
        this.force.mult(10)
    }
}