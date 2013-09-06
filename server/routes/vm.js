'use strict';

var Vm        = require('./../../server/db/schemas').Vm,
    _         = require('lodash'),
    Q         = require('q'),
    appConfig = require('../../app-config.json'),
    client    = require('pkgcloud').compute.createClient(appConfig.vm.cloudCredentials);

exports.create = function(req, res) {
    var pipelineId = (req.body.pipelineId) ? req.body.pipelineId : null;

    if(!pipelineId) {
        return res.json(404, {msg: 'pipelineId is required for VM creation'});
    }

    var serverOptions = appConfig.vm.cloudServer.defaults;
    serverOptions.name = 'Pipeline_' + Math.floor(Math.random()*1000);

    Q.fcall(function() {
        var defer = Q.defer();

        client.createServer(serverOptions, function(err, server) {
            return (err) ? defer.reject(err) : defer.resolve(server);
        });

        return defer.promise;
    }).
    then(function(server) {
        var defer = Q.defer(), count = 0, inProgress = false;

        var intervalId = setInterval( function() {

            if (!inProgress) {
                inProgress = true;

                client.getServer(server, function(err, srv) {
                    inProgress = false;
                    count++;

                    (err) ? defer.reject(err) : '';

                    if(!_.isEmpty(srv.addresses)) {
                        clearInterval(intervalId);
                        return defer.resolve(srv);
                    } else if (count >= 40) {
                        return defer.reject({status: 'Timed Out'});
                    }
                });
            }
        }, 5000);

        return defer.promise;
    }).
    then(function(server) {
        var defer = Q.defer();
        var ipAddress = _.find(server.addresses.public, { 'version': 4 });

        var newInstance = new Vm({
            instanceId: server.id,
            ipAddress: ipAddress.addr,
            pipelineId: pipelineId
        });

        newInstance.save( function (err, newInstance) {
            return (err) ? defer.reject(err) : defer.resolve(server);
        });

        return defer.promise;
    }).
    catch(function(err) {
        return res.json(400, {msg: err});
    }).
    done(function(server) {
        return res.json(200, server.id);
    });
};

exports.get = function(req, res) {
    var pipelineId = req.params.pipelineId;

    Vm.findOne({pipelineId: pipelineId}, function (err, vm) {
        return (err || !vm) ? res.json(404, {msg: 'Unable to find vm for pipeline id: ' + pipelineId}) : res.json(200, vm);
    });
};


exports.delete = function(req, res) {
    var pipelineId = (req.params.pipelineId) ? req.params.pipelineId : null;

    if(!pipelineId) {
        return res.json(404, {msg: 'pipelineId is required for VM removal'});
    }

    Q.fcall(function() {
        var defer = Q.defer();

        Vm.findOne({pipelineId: pipelineId}, function (err, vm) {
            return (err || !vm) ? defer.reject('Unable to find vm for pipeline id: ' + pipelineId) : defer.resolve(vm);
        });

        return defer.promise;
    }).
    then(function(vm) {
        var defer = Q.defer(), count = 0, inProgress = false;

        client.destroyServer(vm.instanceId, function(err, server) {
            return (err) ? defer.reject(err) : defer.resolve(vm);
        });

        return defer.promise;
    }).
    then(function(vm) {
        var defer = Q.defer();

        vm.remove( function (err) {
            return (err) ? defer.reject(err) : defer.resolve();
        });

        return defer.promise;
    }).
    catch(function(err) {
        return res.json(400, {msg: err});
    }).
    done(function(server) {
        return res.json(200, { msg: 'Server deleted'});
    });
};