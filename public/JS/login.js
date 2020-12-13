function incorrectInput(element) {
	const Parent = $(`.textbox.${element}`);
	let elementIcon = Parent.find('.im');
	let elementUnderline = Parent.find('.underline');
	let elementInput = Parent.find('input');
  let inputLabel = Parent.find('label');
  let titleCased = element.toString().slice(0,1).toUpperCase() + element.toString().slice(1);

	if ($('#title-incorrect').length) {
		$('#title-incorrect').text(`${titleCased} Incorrect`);
	} else {
    
    let incorrectEl = $(`<h3> ${titleCased} Incorrect </h3>`).attr('id', 'title-incorrect')
    $(incorrectEl).insertAfter('.login-provider')
	}

	elementUnderline.addClass('incorrect');
	inputLabel.addClass('incorrect');
	elementIcon.addClass('incorrect');

	setTimeout(() => {
		elementUnderline.removeClass('incorrect');
		inputLabel.removeClass('incorrect');
		elementIcon.removeClass('incorrect');
		elementInput.removeClass('incorrect').removeAttr('style');
	}, 820);
	elementInput.css({
		borderColor : 'red',
		animation   : 'shake .82s'
	});
}

/* Firebase - Typically used here  for signing in using providers */
const firebaseConfig = {
  apiKey: "AIzaSyAw-zFeGnwfSiET2gZrZaVZebnZyajeR4Q",
  authDomain: "high-thrills.firebaseapp.com",
  projectId: "high-thrills",
  storageBucket: "high-thrills.appspot.com",
  messagingSenderId: "365192472687",
  appId: "1:365192472687:web:cea4c3c565845ce5ae459a",
  measurementId: "G-2DJXH2BFMT"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();
const facebookAuth = new firebase.auth.FacebookAuthProvider();

/* END */

// When an enter key is pressed in the password,
// it will click the sign in button
$('#user-pass').on('keypress', function(e) {
	if (e.key == 'Enter') {
		$('#signin-btn').click();
  }
  
});

$('#back-btn').click(() => {
  window.location.href = window.location.origin;
})

$('form').submit((e) => {
  e.preventDefault();
})