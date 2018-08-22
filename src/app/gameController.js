export default class GameController {

    startNew() {
        ball.reset()    
        enemy.reset()
    }

    makePoint() {
        generation.getActualSpecimen().score += 1
        enemy.accel += 0.1
    }
}