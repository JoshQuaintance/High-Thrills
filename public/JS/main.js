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

// Checks if there is a user signed in, if there is, then remove the login/signup
// Change it into a dashboard button
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        let registrations = document.querySelector('ul.navbar-registration');
        let cloned = registrations.children.item(1).cloneNode(true);

        Array.from(registrations.children).forEach(child => child.classList.add('hidden'));

        let imgEl;

        if (firebase.auth().currentUser.photoURL) {
            imgEl = document.createElement('img');
            imgEl.setAttribute('src', firebase.auth().currentUser.photoURL);
        } else {
            imgEl = document.createElement('i');
            imgEl.classList.add('im', 'im-user-circle');
        }

        cloned.prepend(imgEl);
        cloned.setAttribute('id', 'dashboard-link');
        cloned.lastChild.setAttribute('href', '/dashboard');
        cloned.lastChild.textContent = 'Dashboard';
        registrations.appendChild(cloned);
    } else {
        // window.location.reload();
    }
});

/* Intersection Observer */
function intersectionObs(callback, options, selector1) {
    const elem1 = document.querySelector(selector1);

    const intersectionObs = new IntersectionObserver(callback, options);

    intersectionObs.observe(elem1);
}

intersectionObs(
    function(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                document.querySelector('.menu').classList.add('scrolled');
            } else {
                document.querySelector('.menu').classList.remove('scrolled');
            }
        });
    },
    {
        rootMargin : '-90% 0px 0px 0px'
    },
    '#backimg'
);

document.addEventListener(
    'DOMContentLoaded',
    () => {
        document.querySelector('#main-action').onclick = () => {
            window.location.href = window.location.origin + '/reservations';
        };
    },
    false
);
