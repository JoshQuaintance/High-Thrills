/**
 * ! User Creation Into Database
 *
 * This is where a new user can be created to store into the database
 */

const admin = require('firebase-admin');

// Import firestore into the file
require('firebase/firestore');

// Create a global variable for firestore
const db = admin.firestore();

module.exports = async function getRides(rides) {
    // Return a promise so that error can be handled easily
    return new Promise(async (resolve, reject) => {
        if (rides == undefined || rides == null) reject({ message: 'Rides object not provided!' });

        db
            .collection('rides')
            .doc(rides)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    resolve(doc.data());
                }
            })
            .catch(e => reject(e));
    }).catch(err => {});
};
