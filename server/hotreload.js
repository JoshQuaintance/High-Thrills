const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { connect } = require('http2');

const rootDir = path.join(path.dirname(__dirname));
const publicDir = path.join(rootDir, 'public');

function makeNode(file) {
	let html = fs.readFileSync(path.join(publicDir, 'HTML', file + '.html'));
	let $ = cheerio.load(html);

	let socketComment = `<!-- Javascript Socket.io injected from server -->`;
	let socketNode = $('<script>').attr('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.4/socket.io.js');

	let comment = `<!-- Javascript file to talk to server with Socket.io -->`;
	let scriptNode = $('<script>').append(`
  let listen = \`ws://\${window.location.hostname}:5050\`;
  console.log(listen)
  const socket = io(listen);
  socket.on('connection', () => {
    console.log('Connection with Server Established');
  })
  socket.on('update-page', () => {
    window.location.reload();
  })
  `);

	$('body').append(socketComment);
	$('body').append(socketNode);
	$('body').append(comment);
	$('body').append(scriptNode);

	return $.html();
}

// https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.4/socket.io.js
const injectSocket = app => {
	const http = require('http').createServer(app);
	const socket = require('socket.io')(http, { cors: { origin: '*' } });

	app.get('/', (req, res) => {
		res.send(makeNode('index'));
	});

	app.get('/:file', (req, res) => {
		glob(path.join(publicDir, 'HTML', req.params.file + '.html'), (e, f) => {
			if (f.length == 1) res.send(makeNode(req.params.file));
			else res.send('Cannot Find the Page Requested');
		});
	});

	// When a connection is established, log it
	let connectedTimes = 0;
	socket.on('connection', () => {
		if (connectedTimes == 1) console.log('Reconnection after Reload Successful');
		else {
			connectedTimes = 1;
			console.log('Connection with Browser Established');
		}
	});

	// Time countdown - 2s
	let time = 0;
	function executeAfterCountdown(callback) {
		// Set the time into 2 (2 seconds)
		time = 2;
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

	// Watch for the public directory and the subdirectories inside it if there is any changes
	fs.watch(path.join(publicDir), { recursive: true }, (e, filename) => {
    if (e != 'change') return;
		console.log(`Restarting due to changes in ${filename}`);
		// If there is changes, do a countdown, then emit to socket to update the page by reloading.
		executeAfterCountdown(() => {
			socket.emit('update-page');
		});
	});

	// Socket Listener
	http.listen(5050);
};

module.exports = injectSocket;
