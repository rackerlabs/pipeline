'use strict';

var rest    = require('restler'),
    _       = require('lodash'),
    Q       = require('q'),
    Repo    = require('./../../server/db/schemas').Repo,
    GITHUB_URL = 'https://api.github.com/repos/';

var fetchRepo = function (id) {
    var defer = Q.defer();

    Repo.findOne({_id:id}, function (err, repo) {
        return (repo) ? defer.resolve(repo) : defer.reject(err);
    });

    return defer.promise;
};

var createHeaders = function (apiToken) {
    return {
                'Authorization' : 'token ' + apiToken,
                'Accept'        : 'application/json'
            };
};

var fetchCommits = function(repo) {
    var defer = Q.defer();

    rest.get(GITHUB_URL + repo.owner + '/' + repo.repoName + '/commits', 
        { headers: createHeaders(repo.apiToken) }
    ).on('complete', function (data, response) {
        defer.resolve(data);
    });

    return defer.promise;
};

var createTagObject = function(lastCommit, repo, tagName) {
    var defer = Q.defer();
    var date = new Date();
    var body = { 
        tag: tagName, 
        message: 'Automatically Created Tag', 
        object: lastCommit.sha,
        type: 'commit', 
        tagger: { name: repo.owner, date: date }
    };

    var data = JSON.stringify(body);

    rest.post(GITHUB_URL + repo.owner + '/' + repo.repoName + '/git/tags', {
        headers: createHeaders(repo.apiToken), data: data
    }).on('success', function(data) { defer.resolve(data) 
    }).on('fail', function(error) { defer.reject(error) });

    return defer.promise;
};

exports.createBranch = function (req, res) {
    var repoId = req.params.repoId, branchName = req.body.branchName, repo = {};

    fetchRepo(repoId).then( function (data) {
        repo = data;
        return fetchCommits(repo);
    }).then( function (commits) {
        var lastCommit = _.first(commits);
        var ref = 'refs/heads/' + branchName;
        var data = JSON.stringify({ ref: ref, sha: lastCommit.sha });

        rest.post(GITHUB_URL + repo.owner + '/' + repo.repoName + '/git/refs', { 
                headers: createHeaders(repo.apiToken),
                data: data
            }
        ).on('complete', function(data, response) {
            res.json(response.statusCode, data);
        });
    });
};

exports.listBranches = function (req, res) {
    var repoId = req.params.repoId;

    fetchRepo(repoId).then( function (repo) {
        rest.get(GITHUB_URL + repo.owner + '/' + repo.repoName + '/branches', 
            { headers: createHeaders(repo.apiToken) }
        ).on('complete', function (data, response) {
            res.json(response.statusCode, data);
        });
    });
};

exports.listPulls = function (req, res) {
    var id = req.params.repoId

    fetchRepo(id).then( function (repo) {
        rest.get(GITHUB_URL + repo.owner + '/' + repo.repoName + '/pulls', 
            { headers: createHeaders(repo.apiToken) }
        ).on('complete', function (data, response) {
            res.json(response.statusCode, data);
        })
    });
};

exports.createPull = function(req, res) {
    var body = req.body, id = req.params.repoId, headers = {};
    var data = {
        'title' : body.branchName,
        'head'  : body.branchName,
        'base'  : 'master'
    }, json = JSON.stringify(data);

    fetchRepo(id).then(function (repo) {
        headers = createHeaders(repo.apiToken);
        rest.post(GITHUB_URL + repo.owner + '/' + repo.repoName + '/pulls', 
            { data: json, headers: headers }
        ).on('complete', function (data, response) {
            return res.json(response.statusCode, data);
        });
    });
};

exports.isPullMergeable = function (req, res) {
    var repoId = req.params.repoId, pullId = req.params.pullId;

    fetchRepo(repoId).then(function (repo) {
        rest.get(GITHUB_URL + repo.owner + '/' + repo.repoName + '/pulls/' + pullId, 
            { headers: createHeaders(repo.apiToken) }
        ).on('complete', function (data, response) {
            res.json(200, { mergeable: data.mergeable });
        });
    });
};

exports.mergePull = function (req, res) {
    var repoId = req.params.repoId, pullId = req.params.pullId, msg = req.body.message;

    fetchRepo(repoId).then( function (repo) {
        rest.put(GITHUB_URL + repo.owner + '/' + repo.repoName + '/pulls/' + pullId + '/merge', 
            { 
                headers : createHeaders(repo.apiToken),
                data: JSON.stringify( { 'commit_message' : msg })
            }
        ).on('complete', function (data, response) {
            return res.json(response.statusCode, data);
        })
    })
};

exports.createTag = function (req, res) {
    var repoId = req.params.repoId, repo = {};
    var tagName = ( req.body.tagName ) ? req.body.tagName : new Date();

    fetchRepo(repoId).then( function (data) {
        repo = data;
        return fetchCommits(repo);
    }).then( function (commits) {
        var lastCommit = _.first(commits);
        return createTagObject(lastCommit, repo, tagName);
    }).then( function (tagObject) {
        var body = JSON.stringify({ ref: 'refs/tags/' + tagName, sha: tagObject.sha });

        rest.post(GITHUB_URL + repo.owner + '/' + repo.repoName + '/git/refs', {
            headers: createHeaders(repo.apiToken),
            data: body
        }).on('complete', function(data, response) {
            return res.json(response.statusCode, data);
        });
    });
};