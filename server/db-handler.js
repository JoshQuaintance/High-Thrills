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
		// Store username and password into a variable
		let username = req.body.username;
		let password = req.body.password;

		// Use try catch block
		try {
			// Create a user reference from the collection named 'users'
			const userRef = db.collection('users');

			// where username is equal to the request's username
			userRef
				.where('username', '==', username)
				.get() // Get documents
				.then(async snapshot => {
					if (!snapshot.size > 0) throw new Error(` ${req.body.username} already used`);
					else {
						const hashedPassword = await bcrypt.hash(password, 10);

						userRef
							.doc()
							.set({
								username : username,
								password : password
							})
							.then(() => {
								res.status(200).send('Account successfully made');
							})
							.catch(e => {
								throw new Error('Error creating account: ', e);
							});
					}
				})
				.catch(err => {
					throw new Error(err);
				});
		} catch (err) {
			// if there is an error while executing
			// Log it as an error
			console.error(err);
		}
	});

	app.post('/login', async (req, res) => {
		let loginEntry = JSON.parse(req.body);
	});
};
