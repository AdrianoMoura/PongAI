import * as tf from '@tensorflow/tfjs';

import GameController from './gameController';
import Player from './sprites/player';
import Generations from '../machineLearning/Generations';
import UI from './sprites/UI';
import Enemy from './sprites/enemy';
import Ball from './sprites/ball';

const sketch = (p5) => {
    window.p5 = p5
    window.canvasWidth = 1080
    window.canvasHeight = 720

    p5.preload = () => {
        window.font = p5.loadFont('Hyperspace.otf')
    }

    // Setup function
    // ======================================
    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight)
        p5.textFont(font)

        // Prepare game
        window.gameController = new GameController()
        window.ui = new UI()

        window.slider = p5.createSlider(1, 100, 1)

        // Create a generation
        window.generation = new Generations(10)
        window.enemy = new Enemy()
        window.ball = new Ball()

        // Starts a generation
        generation.init(Player)
    }

    // Draw function
    // ======================================
    p5.draw = () => {
        p5.background(0)

        if (generation.isEvolving)
            return

        // get actual player to test
        
        let player

        for (let n = 0; n < slider.value(); n++) {
            player = generation.getActualSpecimen()

            if (generation.isEvolving)
                break

            player.think()
            player.update()

            enemy.think()
            enemy.update()

            ball.update()
        }

        if (generation.isEvolving)
            return

        player.render()
        enemy.render()
        ball.render()

        // Show actual score
        p5.textSize(48);
        p5.textAlign(p5.right);
        p5.text(player.score, canvasWidth / 2 - 30, 100);

        p5.textAlign(p5.left);
        p5.text(0, canvasWidth / 2 + 30, 100);


        // Show estatistics 
        p5.textSize(16);
        p5.textAlign(p5.LEFT);
        p5.text(
            `
            Generation:_____ ${generation.generation}
            Specimen:_______ ${generation.actualSpecimenBeeingTrained + 1}/${generation.population}
            HighScore:______ ${generation.highScore}\n
            Last Generation:
            HighScore:______ ${generation.generationHighscore}
            Avg. Score:_____ ${generation.avgScore} ${generation.avgScoreDiff ? `${(generation.avgScoreDiff < 0 ? "" : "+")}${generation.avgScoreDiff}` : ''}
            N. Tensors:_____ ${tf.memory().numTensors}
            `
            , canvasWidth / 2 + 100, canvasHeight / 2 + 100);

        p5.stroke(255)
        p5.line(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight)
        p5.line(10, 0, 10, canvasHeight)
        p5.line(canvasWidth - 10, 0, canvasWidth - 10, canvasHeight)
    }
}

export default sketch