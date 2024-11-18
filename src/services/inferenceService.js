const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function diagnoseClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ['Cancer', 'Non-cancer'];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    let label = classes[classResult];

    let suggestion;

    if (confidenceScore > 50) {
      label = 'Cancer';
      suggestion = 'Segera periksa ke dokter!';
    } else {
      label = 'Non-cancer';
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    }

    return { label, suggestion };
  } catch (e) {
    throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
  }
}

module.exports = diagnoseClassification;
