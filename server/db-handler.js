const firebase = require('firebase/app');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase/high-thrills-firebase-adminsdk.json');
const bcrypt = require('bcrypt');
const { auth } = require('firebase-admin');

// Add Firebase products individually
require('firebase/auth');
require('firebase/firestore');

// Firebase Emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
// process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9090';

// Firebase config object given by Firebase
const firebaseConfig = {
	apiKey            : 'AIzaSyAw-zFeGnwfSiET2gZrZaVZebnZyajeR4Q',
	authDomain        : 'high-thrills.firebaseapp.com',
	projectId         : 'high-thrills',
	storageBucket     : 'high-thrills.appspot.com',
	messagingSenderId : '365192472687',
	appId             : '1:365192472687:web:cea4c3c565845ce5ae459a',
	measurementId     : 'G-2DJXH2BFMT'
};

// initialize app
firebase.initializeApp(firebaseConfig);

const googleAuth = new firebase.auth.GoogleAuthProvider();

// initialize admin
admin.initializeApp({
	credential : admin.credential.cert(serviceAccount)
});

// Create a firestore variable
const db = admin.firestore();

// Export the function so it can be run in the main index file
// Function takes the express app object
module.exports = function dbConnection(app) {
	app.post('/join', async (req, res) => {
		// Store username and password into a variable
		let email = req.body.email;
		let username = req.body.username;
		let password = req.body.password;

		// Use try catch block
		try {
			// Create a user reference from the collection named 'users'
			const userRef = db.collection('users');

			await userRef // Using the reference
				.where('username', '==', username) // Use a filter where username is equal to username given in req
				.get() // Get documents
				.then(async snapshot => {
					// Check if the snapshot has a size, if it has then it means
					// that there is a user using that username, throw an error
					if (snapshot.size > 0) {
						res.status(400).send(`The username '${req.body.username}' is already used`);
						throw `The username '${req.body.username}' is already used`;
					} else {
						// Create a hashed password using bcrypt
						const hashedPassword = await bcrypt.hash(password, 10);

						// Get serverTimestamp from firebase for logging timestamps
						const { serverTimestamp } = admin.firestore.FieldValue;

						// Create the user data
						const userData = {
							// Set the email, username, password, and the time it was created at
							email,
							username,
							password  : hashedPassword,
							createdAt : serverTimestamp()
						};

						// Use the reference
						userRef
							.add(userData) // Add a new document with the user data
							.then(() => {
								res.status(200).send('Account successfully made');
							})
							.catch(e => {
								throw 'Error creating account: ' + e;
							});

						firebase.default.auth().signInWithEmailAndPassword(email, password).catch(err => {
							throw `Error while trying to sign in: ` + err.message;
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
		let username = req.body.username;
		let password = req.body.password;
		let emailRgx = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

		if (emailRgx.test(username)) {
			// let userProviders = await firebase.default.auth().fetchSignInMethodsForEmail(username);
			// let user = await auth().getUserByEmail(username);
			console.log(firebase.auth().currentUser);

			// let credential = firebase.auth.GoogleAuthProvider.credential(user.email, password)
			// console.log(credential)

			// firebase.default.auth().signInWithCredential(credential).then(user => {
			//     console.log(user.user)
			// }).catch(err => console.error(err));
		}
	});
};
