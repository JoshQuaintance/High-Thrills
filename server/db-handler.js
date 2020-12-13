const firebase = require('firebase/app');
const admin = require('firebase-admin');
const serviceAccount = require('./database/high-thrills-firebase-adminsdk.json');
// Add Firebase products individually
require('firebase/auth');

const firebaseConfig = {
	apiKey            : 'AIzaSyAw-zFeGnwfSiET2gZrZaVZebnZyajeR4Q',
	authDomain        : 'high-thrills.firebaseapp.com',
	projectId         : 'high-thrills',
	storageBucket     : 'high-thrills.appspot.com',
	messagingSenderId : '365192472687',
	appId             : '1:365192472687:web:cea4c3c565845ce5ae459a',
	measurementId     : 'G-2DJXH2BFMT',
	credential        : admin.credential.applicationDefault(),
	databaseURL       : 'https://high-thrills.firebaseio.com'
};

firebase.initializeApp(firebaseConfig);

module.exports = function dbConnection(app) {};
