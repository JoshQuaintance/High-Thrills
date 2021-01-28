// Global variable that contains all timeouts
const timeouts = {};
// Global variable that contains all the popover references.
const popovers = {};

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

const auth = firebase.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();
const facebookAuth = new firebase.auth.FacebookAuthProvider();

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
        delete timeouts[identifier];
    }, time);
    timeouts[identifier] = newTimeout;
}

// Create instances for all popovers
function initializePopovers() {
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
 * @param {Boolean} clear To clear the incorrect one or not || false
 */
function incorrect(el, clear = false) {
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

    if (!clear) {
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
}

async function checkAvailability() {
    const email = document.querySelector('#user-email').value;

    const http = new XMLHttpRequest();
    const url = window.location.origin + '/availability';

    http.open('POST', url, false);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify({ email: email }));

    return http.status;
}

function signUp() {
    const email = document.querySelector('#user-email').value;
    const password = document.querySelector('#user-pass').value;
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const state = document.querySelector('#state').value;
    const city = document.querySelector('#city').value;
    const address = `${city}, ${state}`;
    const fullName = `${firstName} ${lastName}`;

    let loginEntry = {
        email,
        password,
        fullName,
        address
    };

    let http = new XMLHttpRequest();
    let url = window.location.origin + '/join';

    http.open('POST', url, true);

    http.setRequestHeader('Content-Type', 'application/json');

    http.onreadystatechange = async () => {
        if (http.readyState == 4) {
            if (http.status == 409) {
                console.log(http.response);
            }
            if (http.status == 201) {
                try {
                    // Automatically signs user in
                    let user = await firebase.default.auth().signInWithEmailAndPassword(email, password);

                    // // If the response type is an object and the action is to login and verify email
                    // if (JSON.parse(http.response) && JSON.parse(http.response).action == 'login-and-verify-email') {

                    // }
                } catch (err) {
                    console.error(err);
                } // try catch block
            } // http status if statement
        } // readyState if statement
    };

    http.send(JSON.stringify(loginEntry));
}

/**
 * Gets user location using GeolocationDB API and change location inputs
 */
function getUserLocation() {
    let http = new XMLHttpRequest();
    let stateInput = document.querySelector('input#state');
    let cityInput = document.querySelector('input#city');

    http.open('GET', 'https://geolocation-db.com/json/09068b10-55fe-11eb-8939-299a0c3ab5e5');

    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                let parsed = JSON.parse(http.response);
                stateInput.value = parsed.state;
                cityInput.value = parsed.city;
            } else {
                console.error('Error getting user location');
            }
        }
    };

    http.send();
}

// Run when the document loads
document.addEventListener(
    'DOMContentLoaded',
    () => {
        // Initialize all popovers
        initializePopovers();

        /* Repeat Password Validation */
        document.querySelector('#repeat-pass').oninput = function() {
            const givenPass = document.querySelector('#user-pass').value;
            if (this.value !== givenPass.substr(0, this.value.length)) {
                incorrect(this);
            } else {
                incorrect(this, true);
                popovers['repeatPassWrong'] == undefined ? null : popovers['repeatPassWrong'].hide();
            }
        };

        document.querySelectorAll('[class^="im im-eye"]').forEach(el => {
            el.onclick = function() {
                // prettier-ignore
                let type = this.parentElement.querySelector('input').getAttribute('type') == 'password' ? 'text' : 'password';
                this.parentElement.querySelector('input').setAttribute('type', type);

                this.classList.toggle('im-eye-off');
                this.classList.toggle('im-eye');
            };
        });

        /* Register Form Handler */
        document.querySelector('#login-wrapper').onsubmit = function(e) {
            e.preventDefault();

            if (checkAvailability() == 409) return alert('Account Used');

            let _this = this;
            _this.classList.add('transition-off');

            executeAfterTimeout(
                () => {
                    _this.classList.remove('transition-off');
                    document.querySelector('.user-details-container').classList.add('transition-on');
                    executeAfterTimeout(
                        () => {
                            document.querySelector('.user-details-container').classList.remove('transition-on');
                            new duDialog(
                                'Allow Location',
                                'We will automatically check the location and fill the form, but in order to do so, we have to ask your permission. If you choose to not give permission, you will have to enter in your location manually...',
                                {
                                    buttons    : duDialog.OK_CANCEL,
                                    okText     : 'Allow',
                                    cancelText : 'Do not Allow',
                                    callbacks: {
                                        okClick    : function() {
                                            getUserLocation();
                                            this.hide();
                                        }
                                    }
                                }
                            );
                        },
                        500,
                        'clear-transition-on-class'
                    );
                    _this.parentElement.setAttribute('data-page', '2');
                },
                500,
                'transition-second-page'
            );
        };

        document.querySelector('.user-details-container').onsubmit = function(e) {
            e.preventDefault();

            signUp();
        };

        // Back button on 2nd page
        document.querySelector('#back-btn').onclick = function() {
            let _this = this;
            _this.parentElement.parentElement.classList.add('transition-off');
            executeAfterTimeout(
                () => {
                    _this.parentElement.parentElement.classList.remove('transition-off');
                    document.querySelector('form#login-wrapper').classList.add('transition-on');
                    executeAfterTimeout(
                        () => {
                            document.querySelector('form#login-wrapper').classList.remove('transition-on');
                        },
                        500,
                        'clear-transition-on-class-1'
                    );
                    _this.parentElement.parentElement.parentElement.setAttribute('data-page', '1');
                },
                500,
                'transition-back-to-first'
            );
        };

        // Google Sign-in
        document.querySelector('[data-auth-provider=google]').onclick = () => {
            auth
                .signInWithPopup(googleAuth)
                .then(user => {
                    alert(user.user.displayName + ' has signed in using Google');
                })
                .catch(e => {
                    if (e.code == 'auth/account-exists-with-different-credential') {
                    }
                });
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
    },
    false
);

auth.onAuthStateChanged(user => {
    if (user) {
        if (user.emailVerified == false) {
            // send the current user an email verification
            firebase.default
                .auth()
                .currentUser.sendEmailVerification({ url: window.location.origin })
                .then(() => {
            new duDialog(
                'Verify Email Ownership',
                `A verification email to prove your ownership of the email was sent to the email address provided. \nPlease verify the ownership of the email address`,
                {
                    buttons   : duDialog.DEFAULT,
                    callbacks : {
                        okClick : function() {
                            window.location.href = window.location.origin;
                        }
                    }
                }
            );
            })
            .catch(err => {
                throw `Error Sending Email Verification: ${err}`;
            });
            // when the email is successfully sent,
            // Using the dialog library, inform the user that an email to verify the ownership of the email is sent
        } else window.location.href = window.location.origin;
    } else {
    }
});
