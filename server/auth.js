/**
 * ! Authentication Handler
 *
 * This is where all the authentication
 * of a user is being done.
 * Logins, Registers, and Password Resets
 * all done here using firebase.
 *
 */

const firebase = require('firebase/app');
const admin = require('firebase-admin');

// Load in dotenv so it can parse the environment variables / secrets
require('dotenv').config();

// Get the service account by getting it from the '.env' file and then decoding it from
// base64 and converting it to string. Then parse it into json.
const serviceAccount = JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('ascii'));

// Add Firebase products individually
require('firebase/auth');

// Firebase Emulators
// process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
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

// initialize admin
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
});

// Export the createUser handler so it won't interfere with the
// admin SDK's initialize app function.
const createUserDB = require('./db-handlers/createUsers');

// Export the function so it can be run in the main index file
/**
 * Function takes the express app object
 * @param {Express.Application} app Express app instance
 */
module.exports = function dbConnection(app) {
    app.post('/availability', async (req, res) => {
        let email = req.body.email;

        try {
            let user = await admin.auth().getUserByEmail(email);
            console.log(user);
            res.status(409).send('User exist');
        } catch (err) {
            res.status(200).send();
        }
    });

    app.post('/login', async (req, res) => {
        // Store username and password into a variable
        let email = req.body.email;
        let password = req.body.password;

        try {
            // Try to get the user from the authentication database by using the email
            // if the user doesn't exist it will raise an error that the catch block will catch
            let user = await admin.auth().getUserByEmail(email);
            let userEmailLogin = user.providerData.some(provider => provider.providerId == 'password');

            if (userEmailLogin) {
                res.status(200).send({
                    message : 'User Exist',
                    action  : 'login'
                });
            } else if (!userEmailLogin) {
                let providers = user.providerData.map(provider => provider.providerId);
                res.status(409).send({
                    message : 'User Exist But No Email Login',
                    action  : 'setup-email-login',
                    data    : providers
                });
            }
        } catch (err) {
            // if there is an error while executing
            // Log it as an error
            console.error(err);

            // Check if the error is an object, if it is then send a status and message accordingly
            // otherwise respond back to the client with a server error
            if (typeof err == 'object') res.status(err.httpStatus || 500).send(err || 'Server Error!');
            else res.status(500).send('Server Error!');
        }
    });

    app.post('/join', async (req, res) => {
        // Store username and password into a variable
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.fullName;
        let address = req.body.address;

        try {
            try {
                // Try to get the user from the authentication database by using the email
                // if the user doesn't exist it will raise an error that the catch block will catch
                let user = await admin.auth().getUserByEmail(email);

                // Checks if the email provided has been used
                if (user.providerData.some(provider => provider.providerId == 'password')) {
                    // if it has throw an error to the catch block
                    throw {
                        httpStatus : 409,
                        code       : 'user-already-exist',
                        message    : new Error(`The user email '${req.body.email}' already used!`)
                    };
                }

                // Checks if the user used google sign-in as a provider
                if (user.providerData.some(provider => provider.providerId == 'google.com')) {
                    /**
                     *? If they do use google, then update their authentication details so that it will merge with
                     *? google's authentication provider because if the user signed in using google previously, that means
                     *? the user knows the password to the email used in the google sign in
                     */

                    admin
                        .auth()
                        .updateUser(user.uid, {
                            // update the user
                            emailVerified : true,
                            password      : password
                        })
                        .then(() => {
                            // if it's successful, then respond back to login the user
                            res.status(201).send({ message: 'User created!', action: 'login' });
                        })
                        .catch(err => {
                            throw {
                                httpStatus : err.httpStatus || 500,
                                code       : err.code || 'error-updating-user',
                                message    :
                                    err.message || new Error('Error while trying to update user authentication')
                            };
                        });
                }
            } catch (err) {
                // If the error is caused by a user not found, then create a new user
                if (err.code == 'auth/user-not-found') {
                    admin
                        .auth()
                        .createUser({
                            // Create a new user with the information given
                            email,
                            displayName : name,
                            password
                        })
                        .then(userRecord => {
                            let record = userRecord;
                            record.name = name;

                            record.address = address;
                            createUserDB(userRecord).catch(err => {
                                console.log(err);
                                throw {
                                    code    : 'error-storing-user',
                                    message : err.message || new Error('Error while trying to store user info in db')
                                };
                            });
                            // When it's created, respond back so the user can be logged in
                            res.status(201).send({ message: 'User Created!', action: 'login-and-verify-email' });
                        })
                        .catch(err => {
                            throw {
                                httpStatus : 500,
                                code       : err.code || 'error-creating-user',
                                message    : err.message || new Error('Error while trying to create the user')
                            };
                        });
                } else {
                    // otherwise throw an error to the main try block
                    throw {
                        httpStatus : err.httpStatus || 500,
                        code       : err.code || 'error-retrieving-user-info',
                        message    : err.message || new Error(`There was an error!`)
                    };
                }
            }
        } catch (err) {
            // if there is an error while executing
            // Log it as an error
            console.error(err);

            // Check if the error is an object, if it is then send a status and message accordingly
            // otherwise respond back to the client with a server error
            if (typeof err == 'object') res.status(err.httpStatus || 500).send(err || 'Server Error!');
            else res.status(500).send('Server Error!');
        }
    });
};
