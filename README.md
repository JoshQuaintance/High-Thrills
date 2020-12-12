# High Thrills Page - A BPA Contest Entry

> by: Ryan Strunk & Joshua Pelealu

A Web Application for High Thrills Entertainment.

## Install Necessary Software and Dependencies

If you want to run and check out the web application locally, you have to install some of these software and dependencies. Some of them are marked for development only, which means it will only be needed if you are changing something in the site.

The first thing you need is a Code Editor if you do not have one already. There are a lot of options out there, but what we recommend are [Visual Studio Code](https://code.visualstudio.com)(What we use) or [Atom Code Editor](https://atom.io). Either of these would work fine, but other code editor would work too.

If you have an updated Windows 10 Computer, you are in luck, a script that will set all these up (except, the code editor), all you have to do is run it using the command line. Check [the automatic setup](#automatic-setup-using-script---windows-10) for more details

| Software | Version | Additional Notes |
| - | - | - |
| Node.js | `14.x` | [Install Node.js here]([Node.js](https://nodejs.org/en/)). Software needed to run the server-side code. |
| NPM (Node Package Manager) | `6.x` | Come bundled with Node.js. Software needed to run scripts and install dependencies needed to run |

Here are the dependencies needed to run the web applications, you can install it one by one or just use the `npm i` command in the terminal and it will install all the dependencies for you.

| Dependency | Version | Additional Notes / Use in This Application |
| - | - | - |
| [express](https://npmjs.org/package/express) | `^4.17.x` | Express js is a javascript package that handles http requests as a server |
| [cors](https://www.npmjs.com/package/cors) | `^2.8.x` | Cross Origin Resource Sharing (CORS) an express middleware allowing specific url to be able to talk with the API. |
| [cookie-parser](https://www.npmjs.com/package/cookie-parser) | `^1.4.x` | Express middleware allowing the back-end server to parse the cookie string from the browser. |
| [glob](https://www.npmjs.com/package/glob) | `^7.1.x` | File matching package that allows the server to check if files/directory exist. |
| [concurrently](https://www.npmjs.com/package/concurrently) | `^5.3.x` | Script to run multiple commands concurrently. It's purpose is to run multiple commands that continuously runs until stopped. |
| *[cheerio](https://www.npmjs.com/package/cheerio)** | `^1.0.x` | A Markup DOM parser to inject Socket.io using a script tag into the html file. |
| *[nodemon](https://www.npmjs.com/package/nodemon)** | `^2.0.x` | Script that helps with the development of the server-side code that will automatically restart a node instance everytime a file change occurs. |
| *[SASS](https://www.npmjs.com/package/sass)** | `^1.30.x` | Syntatically Awesome Style Sheets (SASS) is a compiler for the CSS pre-processor SASS/SCSS. It is needed to compile SCSS files to style the website. |
| *[socket.io](https://www.npmjs.com/package/socket.io)** | `^3.0.x` | Package that allows real-time bidirectional (browser to server, and vice versa) event-based communication. It is need for the development environment that is used for hot reloading the web app. |

**Development Only (Not required to view the web app)*

## Automatic Setup Using Script - Windows 10

1. Install the repository by cloning it to your local drive or downloading the zip file, unzip it if you downloaded the zip file.
2. Open the folder
3. Find the file`script.bat` and run it either by clicking it, or by opening a command prompt in that folder and typing`script.bat` in the command prompt
4. If you do not have nodejs or npm installed, it will asks you if you want to install it, press`y` then`Enter`.
5. Let the script do the job and wait.
6. After it's done, you are set and ready to run the web app.

## Getting Started

You want to check out the web application? Here's how:

1. Install the repository by cloning it into your local drive, or downloading the zip file.
2. [Install necessary softwares and dependencies](#install-necessary-software-and-dependencies) (IMPORTANT)
   * If you have an updated Windows 10, check [the automatic setup](#automatic-setup-using-script---windows-10) to setup automatically.
3. After you're done, open your code editor to the root folder of the application.
4. Open the terminal
   * VSCode - Open Integrated Terminal using``Ctrl + ` ``
   * If your code editor does not have an Integrated Terminal, then open a Command Prompt/Terminal Instance in the folder.
5. Make sure you are in the`/server` directory. If you're not in it, just use`cd server`.
6. To check out the web app, type in`npm run start` in the terminal, and wait until a browser is open. Click refresh in the browser until it shows the page.
7. Congrats, you have configured your computer to open this web application!
