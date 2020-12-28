// Global variable that contains all timeouts
const timeouts = {};
// Global variable that contains all the popover references.
const popovers = {};

/**
 * Executes function after a timeout
 * @param {function} callback The callback run after the timeout
 * @param {number} time The timeout amount in `ms`
 * @param {string} identifier The identifier used to store, and clear the timeout.
 */
function executeAfterTimeout(callback, time, identifier) {
	if (!callback) return console.error(new ReferenceError('The callback is not provided'));
	if (!time) return console.error(new ReferenceError('The timeout amount in ms is not provided'));
	if (!identifier) return console.error(new ReferenceError('The name of the timeout is not provided'));

	// Clears the timeout if it exists
	if (timeouts[identifier]) clearTimeout(timeouts[identifier]);

	let newTimeout = setTimeout(() => {
        callback();
		// Automatically clears the timeout and deletes it from the 'timeouts' object after it's run
        clearTimeout(timeouts[identifier]);
        delete timeouts[identifier]
	}, time);
	timeouts[identifier] = newTimeout;
}

// Create instances for all popovers
function createPopoverInstances() {
	// Sets default props
	tippy.setDefaultProps({
		trigger   : 'manual',
		animation : 'scale',
		duration  : 200
	});

	/* When repeated password is wrong */
	// Reference element to target
	let repeatPassElmnt = document.querySelector('#repeat-pass');

	// Creates an instance
	tippy(repeatPassElmnt, {
		content   : 'Repeated Password has to be the same as the Password provided!',
		theme     : 'danger',
		placement : 'bottom',
		distance  : 25
	});
	let repeatPassWrong = repeatPassElmnt._tippy;
	repeatPassWrong.popper.style.textAlign = 'center';
	popovers.repeatPassWrong = repeatPassWrong;
	/* - - - */
}

createPopoverInstances();

/**
 * Triggers a popup 
 * @param {String} name Name of the popover to trigger. It will check the 'POPOVER' variable if the popover exists.
 */
function triggerPopover(name) {
	// If a name is not provided
	if (name == undefined) return console.error(new ReferenceError('Popover name is not provided'));

	// Checks if the popover exists
	if (popovers[name]) {
		popovers[name].show();
		executeAfterTimeout(() => popovers[name].hide(), 5000, 'hideResetPassPopover');
	} else {
		console.error(
			new ReferenceError("Cannot find a popover named '" + name + "'\n") +
				'Here is a list of all the popovers:\n',
			Object.keys(popovers)
		);
	}
}

/**
 * Labels an input incorrect giving it animations and styles
 * @param {HTMLElement} el Element to label incorrect
 */
function incorrect(el) {
	const Parent = el.parentElement;
	let elementIcon = Parent.querySelector('.im');
	let elementUnderline = Parent.querySelector('.underline');
	let elementInput = Parent.querySelector('input');
	let inputLabel = Parent.querySelector('label');

	/* Reset any applied value before */
	Parent.style.animation = '';
	Parent.style.borderColor = 'black';
	inputLabel.classList.remove('incorrect');
	elementIcon.classList.remove('incorrect');
	elementUnderline.classList.remove('incorrect');
	elementInput.classList.remove('incorrect');

	/* Add the effects */
	inputLabel.classList.add('incorrect');
	elementIcon.classList.add('incorrect');
	elementUnderline.classList.add('incorrect');
	elementInput.classList.add('incorrect');
	Parent.style.borderColor = 'red';
	Parent.style.animation = '.82s shake ease-in-out';

	// Show the popover about incorrect repeated password.
    triggerPopover('repeatPassWrong');
    
    // Clears the styles after 6 seconds
	executeAfterTimeout(
		() => {
			Parent.style.animation = '';
			Parent.style.borderColor = 'black';
			inputLabel.classList.remove('incorrect');
			elementIcon.classList.remove('incorrect');
			elementUnderline.classList.remove('incorrect');
			elementInput.classList.remove('incorrect');
		},
		5000,
		'resetInputStyles'
    );
}

/* Repeat Password Validation */
document.querySelector('#repeat-pass').oninput = function() {
	const givenPass = document.querySelector('#user-pass').value;
	if (this.value !== givenPass.substr(0, this.value.length)) {
		incorrect(this);
	}
};

/* Register Form Handler */
document.querySelector('form').onsubmit = e => {
	e.preventDefault();
	const username = document.querySelector('#user-name').value;
	const password = document.querySelector('#user-pass').value;

	let loginEntry = {
		username : username,
		password : password
	};

	let http = new XMLHttpRequest();
	let url = window.location.origin + '/login';

	http.open('POST', url, true);

	http.setRequestHeader('Content-Type', 'application/json');

	http.onreadystatechange = () => {
		if (http.readyState == 4 && http.status == 200) {
			alert('Successfully Signed in');
		}
	};

	http.send(JSON.stringify(loginEntry));
};
