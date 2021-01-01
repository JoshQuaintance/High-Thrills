
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
			alert(user.user.displayName + ' has signed in using facebook');
		})
		.catch(e => console.error(e));
};
