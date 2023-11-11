const admin = require('firebase-admin');

const serviceAccount = require('./car-showroom-3bed9-firebase-adminsdk-asa3m-0bb07ddf02.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'car-showroom-3bed9.appspot.com'
});

const storage = admin.storage();

module.exports = {
  storage
};