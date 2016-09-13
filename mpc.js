var exec = require('child_process').exec;

module.exports = MpcClient;

function MpcClient(host, port) {
    this.host = host;
    this.port = port;
}

MpcClient.prototype.getCmd = function () {
    return "mpc -h " + this.host + " -p " + this.port + " ";
};

MpcClient.prototype.getOutputs = function (callback) {
    var cmd = this.getCmd() + 'outputs';

    exec(cmd, function (error, stdout, stderr) {

        var outputs = {};
        var regex = /Output.([0-9]*).\((.*)\).is.(enabled|disabled)/;
        var lines = stdout.split('\n');

        for (var i = 0; i < lines.length; i++) {

            var result = lines[i].match(regex);

            if (result != null) {
                outputs[result[1]] = {
                    id: +result[1],
                    name: result[2],
                    on: (result[3] === "enabled")
                };
            }
        }
        callback(outputs)
    });
};

MpcClient.prototype.play = function (file, callback) {
    var cmdload = this.getCmd() + 'load ' + file;
    var cmdplay = this.getCmd() + 'play';

    exec(cmdload, function (error, stdout, stderr) {
        exec(cmdplay, function (error, stdout, stderr) {
            callback(stdout)
        });
    });
};

MpcClient.prototype.stop = function (callback) {
    var cmd = this.getCmd() + 'stop';

    exec(cmd, function (error, stdout, stderr) {
        callback(stdout)
    });
};

MpcClient.prototype.setOutput = function (number, state, callback) {
    var tmp = (state == true) ? "enable" : "disable";
    var cmd = this.getCmd() + tmp + ' ' + number;

    exec(cmd, function (error, stdout, stderr) {
        callback(stdout)
    });
};

MpcClient.prototype.getStatus = function (callback) {
    var cmd = this.getCmd() + 'status';

    exec(cmd, function (error, stdout, stderr) {

        var status = {
            volume: 0,
            playing: false
        };

        var regex = /volume:\s*(\d*)\%/;
        var result = stdout.match(regex);
        if (result === null) {
            status.volume = 0;
        } else {
            status.volume = Number(result[1]);
        }

        regex = /\[(playing)\]/;
        result = stdout.match(regex);
        status.playing = (result != null);

        callback(status)
    });
};

MpcClient.prototype.setVolume = function (value, callback) {

    var cmd = this.getCmd() + "volume" + ' ' + value;

    exec(cmd, function (error, stdout, stderr) {
        callback(stdout)
    });
};