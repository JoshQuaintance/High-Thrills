const firebase = require('firebase/app');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase/high-thrills-firebase-adminsdk.json');
const bcrypt = require('bcrypt');

// Add Firebase products individually
require('firebase/auth');
require('firebase/firestore');

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
	credential : admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = function dbConnection(app) {
	app.post('/join', async (req, res) => {
		let signUpEntry = JSON.parse(req.body);
		console.log(signUpEntry);

		// try {
		//     const hashedPassword = await bcrypt.hash(signUpEntry.password)
		// }
	});

	app.post('/login', async (req, res) => {
		let loginEntry = JSON.parse(req.body);
	});
};
