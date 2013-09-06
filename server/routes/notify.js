'use strict';

var email = require('./../../server/utils/email'), 
	user = require('./../../server/routes/user'),
	Q = require('q'),
	_ = require('lodash');

var options = {
    from: "Roger's Mom ✔ <christopher.cantu@gmail.com>", // sender address
    subject: "Open 24/7", // Subject line
    text: "99% DISCOUNT for all customers", // plaintext body
    html: "<b>99% Discount</b> for all customers!" // html body
};

exports.emailUser = function (req, res) {
	var opts = ( req.body.options ) ? req.body.options : options;

	user.findById(req.params.id)
		.then( function(user) {
			opts.to = user.email;
			return email.sendMail(options);
		})
		.then( function (message) {
			return res.json(200, message);
		}).catch( function (error) {
        	res.json(409, error);
    	});
};

exports.emailUsers = function (req, res) {
	var usersIds = req.body.ids;

	user.findUsersByIds(usersIds)
		.then( function(users) {
			var ids = _.pluck(users, 'email');
			options.to = ids.toString();
			return email.sendMail(options);
		}).then( function (message) {
			return res.json(200, message);
		}).catch( function (error) {
			return res.json(409, error);
		});
};

