import * as tf from '@tensorflow/tfjs';

export default class NeuralNetwork {
    constructor() {
        // Get nodes layers size
        this.layers = Array.from(arguments)

        // Initialize random weights for each layer
        this.layers_weights = this.layers.map((h, i) =>
            this.layers[i + 1] &&
            tf.randomNormal([
                this.layers[i],
                this.layers[i + 1]
            ])
        ).filter(f => f)
    }

    predict(input) {
        let output;
        tf.tidy(() => {
            // Makes an 1D array with inputs
            const input_layer = tf.tensor(input, [1, this.layers[0]]);
            
            // Multiply by input weights, hidden weights and finally output layer
            const output_layer = this.layers_weights.reduce((output_layer, actual_layer) => output_layer.matMul(actual_layer).sigmoid(), input_layer)

            output = output_layer.dataSync();
        });
        return output;
    }

    clone() {
        let clonie = new NeuralNetwork();
        clonie.dispose();
        clonie.layers_weights = this.layers_weights.map((layer) => tf.clone(layer))
        clonie.layers = this.layers
        return clonie;
    }

    dispose() {
        this.layers_weights.forEach(layer => layer.dispose())
    }
}