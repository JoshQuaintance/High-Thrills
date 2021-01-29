const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const injectSocket = require('./hot-reload.js');
const glob = require('glob');

const rootDir = process.cwd(); // Get the root directory
const publicDir = path.join(rootDir, 'public'); // Get the public directory

app.use(express.static(publicDir)); // To Serve static files
app.use(cors()); // CORS (Cross Origin Resource Sharing) - Let any url be able to do http request to this server
app.use(cookieParser()); // Cookie Parser - Read Cookies from server
app.use(express.json()); // JSON Middleware - Parse JSON in server
app.listen(process.env.PORT || 3000); // Express to listen in port 3000
console.log('Route Listener Running || App Running!');

// Routing for database connection
require('./auth.js')(app);

// Checks if there is an extra argument given when running this file
// If there is and it has the word 'dev' in it then run the socket
// injection otherwise just run normally
if (process.argv.slice(2).indexOf('dev') > -1) {
    injectSocket(app);
} else {
    server(app);
    require('./db-handlers/createUsers.js')();
}

// Normal server app
function server(app) {
    console.log('Normal Routes Running');
    app.all('/', (req, res, next) => {
        // Anyone can access the API
        res.header('Access-Control-Allow-Origin', '*');

        // Let any Request Header into the API
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
    });

    app.get('/', (req, res, next) => {
        res.status(200).sendFile(path.join(publicDir, 'HTML', 'index.html'));
    });

    app.get('/:file', (req, res, next) => {
        glob(path.join(publicDir, 'HTML', req.params.file + '.html'), (e, f) => {
            if (f.length == 1) res.sendFile(path.join(publicDir, 'HTML', req.params.file + '.html'));
            else res.send('Cannot Find The Page You Asked For');
        });
    });
}
