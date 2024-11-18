const {
  predictCancerDiagnose,
  getDiagnoseHistories,
} = require('../handler/handler.js');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: predictCancerDiagnose,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000,
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getDiagnoseHistories,
  },
];

module.exports = routes;
