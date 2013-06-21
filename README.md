# Pipeline 

Simple and opinionated build server designed to work with our version of a CICD process.  

### Why?

We looked at what was available and tried a few out. Unfortunately, none of the existing projects had the right combination of features and realiability.  

### Technologies

* HTML5 Boilerplate
* AngularJS
* Karma
* jQuery
* UI-Bootstrap
* Font-Awesome
* Modernizr
* lodash
* Express
* Hogan
* Socket.io
* MongoDB

### Setting Up the Application

* Install MongoDB
* `git clone git@github.com:christophercantu/pipeline.git`
* `npm install`
* `bower install`

### Running the application
The application can be run with front-end code only or also run the server code.  To run both the front-end and server code, use the following command:

* Ensure mongodb is running locally ie: `mongod`
* `grunt server --use-server`

> Note: Because of how NodeJS works, the browser may open before server has finished starting up. Therefore, you may see a 404 page when you run the command initially.  Just refresh the page if you see this error.
