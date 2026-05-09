const tf = require("@tensorflow/tfjs-node");

console.log("Backend:", tf.getBackend());

const x = tf.tensor([1, 2, 3]);

x.print();