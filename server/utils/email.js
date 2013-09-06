'use strict';

var mail = require('nodemailer'), Q = require('q'),
	credentials = require('./../../email-credentials.json');

var smtp = mail.createTransport("SMTP", credentials);

exports.sendMail = function (options) {
	var defer = Q.defer();

	smtp.sendMail(options, function(error, response){
		return ( error ) ?  defer.reject(error) : defer.resolve({msg: response.message});
	});

	return defer.promise;
}; 