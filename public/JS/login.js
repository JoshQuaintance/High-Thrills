function incorrectInput(element) {
	const Parent = document.querySelector(`.textbox.${element}`);
	let elementIcon = Parent.querySelector('.im');
	let elementUnderline = Parent.querySelector('.underline');
	let elementInput = Parent.querySelector('input');
	let inputLabel = Parent.querySelector('label');
	let titleCased = element.toString().slice(0, 1).toUpperCase() + element.toString().slice(1);

	if (!document.querySelector('#title-incorrect')) {
		document.querySelector('#title-incorrect').textContent(`${titleCased} Incorrect`);
	} else {
		let incorrectEl = document.createElement('h3');
		incorrectEl.textContent(`${titleCased} Incorrect`);
		incorrectEl.setAttribute('id', 'title-incorrect');
		document.querySelector('.login-provider').insertAdjacentElement('afterend');
	}

	elementUnderline.classList.add('incorrect');
	inputLabel.classList.add('incorrect');
	elementIcon.classList.add('incorrect');

	setTimeout(() => {
		elementUnderline.classList.remove('incorrect');
		inputLabel.classList.remove('incorrect');
		elementIcon.classList.remove('incorrect');
    elementInput.classList.remove('incorrect');
    elementInput.setAttribute('style', '');
  }, 820);
  elementInput.style.borderColor = 'red';
  elementInput.style.animation = 'shake';
}

/* Firebase - Typically used here  for signing in using providers */
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

const auth = firebase.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();
const facebookAuth = new firebase.auth.FacebookAuthProvider();

/* END */

// When an enter key is pressed in the password,
// it will click the sign in button
document.querySelector('#user-pass').addEventListener('keypress', function(e) {
  if (e.key == 'Enter') document.querySelector('#signin-btn').click();
});

// When the home button is clicked, it will
// redirect to origin url
document.querySelector('#back-btn').onclick = () => window.location.href = window.location.origin;

// When the form is submitted, it prevents the default action
// which runs the action given to it, instead runs a specific function
// that will connect to the DB
document.querySelector('form').onsubmit = e => e.preventDefault();
