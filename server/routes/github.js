'use strict';

var rest = require('restler'), Q = require('q');
var GITHUB_URL = "https://api.github.com/repos/"

exports.createBranch = function (req, res) {

};

exports.listBranches = function (req, res) {

};

exports.listPulls = function (req, res) {

};

exports.createPull = function(req, res) {
	var REPO = { 
		"owner"		: "SOME_OWNER",
		"repoName"	: "SOME_REPO",
		"headers": {
			"Authorization"	: "token GITHUB API TOKEN",
			"Accept"		: "application/json"
		}
	};

	var data = {
		"title" : req.branchName,
		"head"  : req.branchName,
		"base"	: "master"
	}, json = JSON.stringify(data);

	return rest.post(GITHUB_URL + REPO.owner + "/" + REPO.repoName + "/pulls", 
		{ headers : REPO.headers, data : json }
	).on('complete', function (data, response) {
		res.json(response.statusCode, data);
	});
};

exports.isPullMergeable = function (req, res) {

};

exports.mergePull = function (req, res) {

};

exports.createTag = function (req, res) {

};