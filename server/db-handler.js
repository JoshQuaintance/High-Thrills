const firebase = require('firebase/app');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase/high-thrills-firebase-adminsdk.json');
// Add Firebase products individually
require('firebase/auth');
require('firebase/firestore');
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const firebaseConfig = {
	apiKey            : 'AIzaSyAw-zFeGnwfSiET2gZrZaVZebnZyajeR4Q',
	authDomain        : 'high-thrills.firebaseapp.com',
	projectId         : 'high-thrills',
	storageBucket     : 'high-thrills.appspot.com',
	messagingSenderId : '365192472687',
	appId             : '1:365192472687:web:cea4c3c565845ce5ae459a',
	measurementId     : 'G-2DJXH2BFMT'
};

admin.initializeApp({
	credential  : admin.credential.cert(serviceAccount)
});

// firebase.initializeApp();

const db = admin.firestore();
if (process.argv.slice(2).indexOf('emulator') > -1) 
  // db.useEmulator("localhost", 8080)

module.exports = function dbConnection(app) {
  app.post('/login', async (req, res) => {
    console.log(req.body, db);
    const userRef = db.collection('users');
    const user = await userRef.get();
    user.forEach(doc => {
      console.log(doc.id, '=> ', doc.data());
      res.send(doc.data())
    })



  })
};
