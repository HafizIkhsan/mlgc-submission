const diagnoseClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');
const { Firestore } = require('@google-cloud/firestore');

async function predictCancerDiagnose(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await diagnoseClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data: data,
  });
  response.code(201);
  return response;
}

// optional 4 get histories
async function getDiagnoseHistories(request, h) {
  // Inisialisasi
  const db = new Firestore({
    projectId: process.env.PROJECT_ID,
  });

  const document = db.collection('predictions');
  const snapshot = await document.get();

  const data = snapshot.docs.map((doc) => {
    const { result, createdAt, suggestion } = doc.data();
    return {
      id: doc.id,
      history: {
        result,
        createdAt,
        suggestion,
        id: doc.id,
      },
    };
  });

  const response = h.response({
    status: 'success',
    data: data,
  });
  response.code(200);
  return response;
}

module.exports = { predictCancerDiagnose, getDiagnoseHistories };
