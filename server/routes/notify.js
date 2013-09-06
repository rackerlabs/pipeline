'use strict';

var email = require('./../../server/utils/email'), 
	user = require('./../../server/routes/user'),
	pipeline = require('./../../server/routes/pipeline'),
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
	var opts = ( req.body.options ) ? req.body.options : options;

	user.findUsersByIds(usersIds)
		.then( function(users) {
			var ids = _.pluck(users, 'email');
			opts.to = ids.toString();
			return email.sendMail(opts);
		}).then( function (message) {
			return res.json(200, message);
		}).catch( function (error) {
			return res.json(409, error);
		});
};

exports.pipelineEmail = function (buildId) {
	pipeline.findByBuildIdAndNotificationType(buildId, "email").then( function (pipe) {
		var notification = _.find(pipe.notifications, function (notify) {
			return notify.notification_type == "email";
		});

		var mail = {
			from: "Chris Cantu <christopher.cantu@gmail.com>",
			to: notification.contacts.toString(),
			text: notification.body,
			html: notification.body,
			subject: notification.subject
		};

		return email.sendMail(mail);
	});
}