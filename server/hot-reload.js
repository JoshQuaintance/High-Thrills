const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

// Function that creates the script tags
function makeNode(file) {
    // Get the html file of the requested file
    let html = fs.readFileSync(path.join(publicDir, 'HTML', file + '.html'));
    let $ = cheerio.load(html); // load it into cheerio

    // Create the comment and script tag for the socket.io cdn
    let socketComment = `<!-- Javascript Socket.io injected from server -->`;
    let socketNode = $('<script>').attr('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.4/socket.io.js');

    // Create the comment and script tag for talking to server using socket.io cdn
    let comment = `<!-- Javascript file to talk to server with Socket.io -->`;
    let scriptNode = $('<script>').append(`
  let listen = \`ws://\${window.location.hostname}:5050\`;
  const socket = io(listen);
  socket.on('connection', () => {
    console.log('Connection with Server Established');
  })
  socket.on('update-page', () => {
    window.location.reload();
  })
  `);

    // Append all the script tags an comments
    $('body').append(socketComment);
    $('body').append(socketNode);
    $('body').append(comment);
    $('body').append(scriptNode);

    // Return the whole html
    return $.html();
}

/**
 * Injects socket.io into HTML
 * @param {Express.Application} app Express app instance
 */
const injectSocket = app => {
    // Creates an http server instance using the app (express app)
    const http = require('http').createServer(app);

    // Create a socket that uses the http server, and let any origin uses it.
    // TODO: Change CORS to only allow same origin
    const socket = require('socket.io')(http, { cors: { origin: '*' } });

    app.get('/', (req, res) => {
        res.send(makeNode('index'));
    });

    // If the user enters a url with parameters, it checks if there is a
    // file with the name from the url, if there is then create a
    // node with a socket.io instance and send it otherwise just 404
    app.get('/:file', (req, res) => {
        glob(path.join(publicDir, 'HTML', req.params.file + '.html'), (e, f) => {
            if (f.length == 1) res.send(makeNode(req.params.file));
            else res.send('Cannot Find the Page Requested');
        });
    });

    // When a connection is established, log it
    let connectedTimes = 0;

    // When the socket connects with the client socket
    socket.on('connection', () => {
        // if it has connected with it before, log a different thing
        if (connectedTimes == 1) console.log('Reconnection after Reload Successful');
        else {
            connectedTimes = 1;
            console.log('Connection with Browser Established');
        }
    });

    // Time countdown - 2s
    let time = 0;

    // This ensures that the browser reload won't be called way to much
    // It adds a 3 seconds delay after a change. If there is a change
    // before the 3 seconds end, then it will restart back at 3
    function executeAfterCountdown(callback) {
        // Set the time into 3 (3 seconds)
        time = 3;
        // Start an interval, every 1 second, it will decrement time
        let interval = setInterval(() => {
            time--;
            // if time is smaller than 0
            if (time < 0) {
                // stop the interval
                clearInterval(interval);
                // run the callback
                callback();
            }
        }, 1000);
    }

    const timeouts = {};

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

    // Watch for the public directory and the subdirectories inside it if there is any changes
    fs.watch(path.join(publicDir), { recursive: true }, (e, filename) => {
        // If it's not a change in the file, don't do anything
        if (e != 'change') return;
        // Log if there is a change in the file
        console.log(`Restarting due to changes in ${filename}`);
        // If there is changes, do a countdown, then emit to socket to update the page by reloading.
        executeAfterTimeout(
            () => {
                // Emmit an event to the client to update the page
                socket.emit('update-page');
            },
            1800,
            'refresh-countdown'
        );
    });

    // Socket Listener
    http.listen(5050);
};

// Export the function so the main index file can use it.
module.exports = injectSocket;
