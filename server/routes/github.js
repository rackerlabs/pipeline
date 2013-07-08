'use strict';

var rest 	= require('restler'), 
	Q 		= require('q'), 
	Repo 	= require('./../../server/db/schemas').Repo,
	GITHUB_URL = "https://api.github.com/repos/";

var fetchRepo = function(id) {
	var defer = Q.defer();

	Repo.findOne({_id:id}, function (err, repo) {
		(repo) ? defer.resolve(repo) : defer.reject(err);
	});

	return defer.promise();
}

exports.createBranch = function (req, res) {

};

exports.listBranches = function (req, res) {

};

exports.listPulls = function (req, res) {

};

exports.createPull = function(req, res) {
	var body = req.body, id = req.params.id;
	var data = {
		"title" : body.branchName,
		"head"  : body.branchName,
		"base"	: "master"
	}, json = JSON.stringify(data);

	fetchRepo(id).then(function (repo) {
		rest.post(GITHUB_URL + repo.owner + "/" + REPO.repoName + "/pulls", 
			{
				data: json,
				headers: {
					"Authorization"	: "token " + repo.apiToken,
					"Accept" 		: "application/json"
				}
			}
		).on('complete', function (data, response) {
			res.json(response.statusCode, data);
		});
	});
};

exports.isPullMergeable = function (req, res) {

};

exports.mergePull = function (req, res) {

};

exports.createTag = function (req, res) {

};