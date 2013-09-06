# Pipeline 

Simple and opinionated build server designed to work with our version of a CICD process.  

### Why?

We looked at what was available and tried a few out. Unfortunately, none of the existing projects had the right combination of features and realiability.  

### Technologies

* NodeJS
* HTML5 Boilerplate
* AngularJS
* Karma
* UI-Bootstrap
* Font-Awesome
* Modernizr
* lodash
* ExpressJS
* Socket.io
* MongoDB

### Setting Up the Application

## Install NodeJS
* Follow the steps on http://nodejs.org

## Install MongoDB, Git, NodeJS and NPM
* `git clone git@github.com:christophercantu/pipeline.git`
* `npm install`
* `bower install`

### Running the application
The application can be run with front-end code only or also run the server code.  To run both the front-end and server code, use the following command:

* Ensure mongodb is running locally ie: `mongod`
* `node server/server.js`
