import * as tf from '@tensorflow/tfjs';

export default class Generations {
    constructor(population) {
        this.population = population
        this.species = []
        this.generation = 1
        this.highScore = 0
        this.generationHighscore = 0
        this.avgScore = 0
        this.avgScoreDiff = 0
        this.actualSpecimenBeeingTrained = 0
        this.isEvolving = false
    }

    init(Creature) {
        this.species = Array.from({ length: this.population }, () => new Creature())
    }

    pickOne() {
        let index = 0
        let r = Math.random()
        while (r > 0) {
            r -= this.species[index].fitness
            index += 1
        }
        index -= 1

        let selected = this.species[index].clone()
        return selected
    }

    evolve() {

        this.isEvolving = true
        // Get and store the high score
        this.generation += 1
        this.generationHighscore = this.species.reduce((max, creature) => creature.score > max ? creature.score : max, 0)
        this.highScore = this.generationHighscore > this.highScore ? this.generationHighscore : this.highScore

        // Calculate Total Score of this Generation
        const totalScore = this.species.reduce((total, creature) => total += creature.score, 0)

        // Calculate average score of this Generation
        const avgScore = totalScore / this.population
        this.avgScoreDiff = avgScore - this.avgScore;
        this.avgScore = avgScore;

        // Make score exponentially better
        this.species.forEach(creature => creature.expScore = Math.pow(creature.score, 2))
        const totalScoreExponential = this.species.reduce((total, creature) => total += creature.expScore, 0)

        // Assign Fitness to each creature
        this.species.forEach((creature) => creature.fitness = creature.expScore / totalScoreExponential)

        // Preserve best Specimen
        const bestSpecimen = this.species.reduce((prev, current) => current.fitness > prev.fitness ? current : prev)
        this.bestSpecimen && this.bestSpecimen.brain.dispose()
        this.bestSpecimen = bestSpecimen.clone()
        bestSpecimen.brain.dispose()

        // Create a new generation
        const new_species = this.species.map(() => {
            const parentA = this.pickOne()
            const parentB = this.pickOne()
            const child = parentA.crossover(parentB)
            child.mutate()
            parentA.brain.dispose()
            parentB.brain.dispose()
            return child
        })
        
        this.species.forEach(s => s.brain.dispose())

        this.species = new_species
        this.actualSpecimenBeeingTrained = 0
        gameController.startNew()
        this.isEvolving = false

        // end the evolving
        return
    }

    getActualSpecimen() {
        return this.species[this.actualSpecimenBeeingTrained]
    }

    goToNextSpecimen() {
        // go to next specimen
        if (this.actualSpecimenBeeingTrained < this.species.length - 1) {
            this.actualSpecimenBeeingTrained++
            gameController.startNew()
            
            enemy.accel = 5
        } else {
            // If this training reaches the end of the specimen start the evolving
            this.evolve()
        }
    }

    getBetterSpecimen() {
        return this.bestSpecimen
    }

    runFromPlayerData(specimen_weights, Creature) {

        this.isEvolving = true
        const player = new Creature()

        const playerLayers = player.brain.layers_weights.map((el, i) => {
            const shape = el.shape
            const layer = specimen_weights[i]

            return tf.tensor(layer, shape)
        })

        player.brain.dispose()
        player.score = 0
        player.fitness = 0

        player.brain.layers_weights = playerLayers

        
        this.generation = 1
        this.population = 1
        this.highScore = 0
        this.generationHighscore = 0
        this.avgScore = 0
        this.avgScoreDiff = 0
        this.actualSpecimenBeeingTrained = 0

        this.species.forEach(s => s.brain.dispose())
        this.species = [player]
        
        gameController.startNew()
        this.isEvolving = false
    }

    runFromGenerationData(species_array, generationNumber, population, Creature) {
        const species = Array.from({ length: this.population }, (el, player_index) => {
            const player = new Creature()

            const playerLayers = player.brain.layers_weights.map((el, layer_index) => {
                const shape = el.shape
                const layer = species_array[player_index][layer_index]
    
                return tf.tensor(layer, shape)
            })
            player.brain.dispose()
            player.score = 0
            player.fitness = 0

            player.brain.layers_weights = playerLayers

            return player
        })

        this.generation = generationNumber
        this.population = population
        this.highScore = 0
        this.generationHighscore = 0
        this.avgScore = 0
        this.avgScoreDiff = 0
        this.actualSpecimenBeeingTrained = 0

        this.species.forEach(s => s.brain.dispose())
        this.species = species
        
        gameController.startNew()
        this.isEvolving = false
    }
}