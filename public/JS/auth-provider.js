/* Setup Firebase */
const firebaseConfig = {
	apiKey            : 'AIzaSyAw-zFeGnwfSiET2gZrZaVZebnZyajeR4Q',
	authDomain        : 'high-thrills.firebaseapp.com',
	projectId         : 'high-thrills',
	storageBucket     : 'high-thrills.appspot.com',
	messagingSenderId : '365192472687',
	appId             : '1:365192472687:web:cea4c3c565845ce5ae459a',
	measurementId     : 'G-2DJXH2BFMT'
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();
const facebookAuth = new firebase.auth.FacebookAuthProvider();

// Google Sign-in
document.querySelector('[data-auth-provider=google]').onclick = () => {
	auth
		.signInWithPopup(googleAuth)
		.then(user => {
			alert(user.user.displayName + ' has signed in using Google');
		})
		.catch(e => console.error(e));
};

// Facebook Sign-in
document.querySelector('[data-auth-provider=facebook]').onclick = () => {
	auth
		.signInWithPopup(facebookAuth)
		.then(user => {
			console.log(user.user);
			alert(user.user + ' has signed in using facebook');
		})
		.catch(e => console.error(e));
};
