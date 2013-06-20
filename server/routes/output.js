var exec = require('child_process').exec;

exports.find = function (req, res) {
    exec('find / -name foo', function(err, stdout, stderr) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end(stderr);
        } else {
            res.writeHead(200,{"Content-Type": "text/plain"});
            res.end(stdout);
        }
    });  
};