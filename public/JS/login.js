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
    let userPassEl = document.querySelector('#user-pass');

    // Creates an instance
    tippy(userPassEl, {
        content   : 'Repeated Password has to be the same as the Password provided!',
        theme     : 'danger',
        placement : 'bottom',
        distance  : 25
    });
    let userPassWrong = userPassEl._tippy;
    userPassWrong.popper.style.textAlign = 'center';
    popovers.userPassWrong = userPassWrong;
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
        triggerPopover('passwordWrong');

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

document.addEventListener('DOMContentLoaded', () => {
    initializePopovers();

    document.querySelectorAll('[class^="im im-eye"]').forEach(el => {
        el.onclick = function() {
            // prettier-ignore
            let type = this.parentElement.querySelector('input').getAttribute('type') == 'password' ? 'text' : 'password';
            this.parentElement.querySelector('input').setAttribute('type', type);

            this.classList.toggle('im-eye-off');
            this.classList.toggle('im-eye');
        };
    });

    document.querySelector('form').onsubmit = e => {
        e.preventDefault();
        let username = document.querySelector('#user-email').value;
        let password = document.querySelector('#user-pass').value;

        let loginEntry = {
            username : username,
            password : password
        };

        let http = new XMLHttpRequest();
        let url = window.location.origin + '/login';

        http.open('POST', url);

        http.setRequestHeader('Content-Type', 'application/json');

        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                alert('Successfully Signed in');
            }
        };

        http.send(JSON.stringify(loginEntry));
    };

    // Google Sign-in
    document.querySelector('[data-auth-provider=google]').onclick = () => {
        auth
            .signInWithPopup(googleAuth)
            .then(async user => {
                alert(user.user.displayName + ' has signed in using google');
            })
            .catch(err => console.error(err));
    };

    // Facebook Sign-in
    document.querySelector('[data-auth-provider=facebook]').onclick = () => {
        auth
            .signInWithPopup(facebookAuth)
            .then(user => {
                console.log(user.user);
                alert(user + ' has signed in using facebook');
            })
            .catch(err => console.error(err));
    };

    // When the home button is clicked, it will
    // redirect to origin url
    document.querySelector('#back-btn').onclick = () => (window.location.href = window.location.origin);
});

auth.onAuthStateChanged(user => {
    if (user) {
        // if (user.emailVerified == false) {
        //     // send the current user an email verification
        //     // firebase.default
        //     //     .auth()
        //     //     .currentUser.sendEmailVerification({ url: window.location.origin })
        //     //     .then(() => {
        //     new duDialog(
        //         'Verify Email Ownership',
        //         `A verification email to prove your ownership of the email was sent to the email address provided. \nPlease verify the ownership of the email address`,
        //         {
        //             buttons   : duDialog.DEFAULT,
        //             callbacks : {
        //                 okClick : function() {
        //                     window.location.href = window.location.origin;
        //                 }
        //             }
        //         }
        //     );
        // })
        // .catch(err => {
        //     throw `Error Sending Email Verification: ${err}`;
        // });
        // when the email is successfully sent,
        // Using the dialog library, inform the user that an email to verify the ownership of the email is sent
        // } else

        window.location.href = window.location.origin;
    } else {
    }
});
