/**
 * @module MPC
 */

var mpc = require('./mpc.js');

var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerPlatform("hombridge-mpc", "mpc", MpcPlatform);
};

//
// MPC Accessory
//
function MpcPlatform(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"] || 'MPC';
    this.host = config["host"] || 'localhost';
    this.port = config["port"] || 6600;

    this.client = new mpc(this.host, this.port);
}

MpcPlatform.prototype.accessories = function (callback) {
    var self = this;

    self.log("Fetching MPD Outputs...");

    self.client.getOutputs(function (outputs) {

        var foundAccessories = [];
        for (var key in outputs) {

            if (!outputs.hasOwnProperty(key)) continue;

            var output = outputs[key];

            self.log("Found MPD Output: " + output.name);
            var accessory = new MpcAccessoryOutput(self.log, output, self.host, self.port);

            foundAccessories.push(accessory);
        }

        foundAccessories.push(new MpcAccessory(self.log, self.host, self.port, self.name))

        callback(foundAccessories);
    })
};


function MpcAccessory(log, host, port, name) {
    this.log = log;
    this.host = host;
    this.port = port;
    this.name = name;
    this.client = new mpc(this.host, this.port);
}

MpcAccessory.prototype.getServices = function () {
    var self = this;

    var lightbulbService = new Service.Lightbulb();

    lightbulbService
        .getCharacteristic(Characteristic.On)
        .on('get', self.getState.bind(self))
        .on('set', self.setState.bind(self));

    lightbulbService
        .addCharacteristic(Characteristic.Brightness)
        .on('get', self.getVolume.bind(self))
        .on('set', self.setVolume.bind(self));

    var informationService = new Service.AccessoryInformation();

    //TODO Add proper information characteristics
    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Test-Manufacturer")
        .setCharacteristic(Characteristic.Model, "Test-Model")
        .setCharacteristic(Characteristic.SerialNumber, "Test-Serial")
        .addCharacteristic(Characteristic.FirmwareRevision, "Test-FirmwareRevision");

    return [informationService, lightbulbService];
};

MpcAccessory.prototype.getVolume = function (callback) {
    var accessory = this;

    accessory.client.getStatus(function (status) {
        var volume = status.volume;
        accessory.log("volume is %s", volume);
        callback(null, Number(volume));
    })
};

MpcAccessory.prototype.setVolume = function (volume, callback) {
    var accessory = this;

    accessory.log("Setting volume to %s", volume);
    accessory.client.setVolume(volume, function () {
        callback(null);
    })
};

MpcAccessory.prototype.getState = function (callback) {
    var accessory = this;

    accessory.log("Getting status information...");
    accessory.client.getStatus(function (status) {

        callback(null, status.playing)
    })


};

MpcAccessory.prototype.setState = function (state, callback) {
    var accessory = this;

    accessory.log("Setting state to %s", state);

    accessory.client.getStatus(function (status) {

        if (status.playing != state) {
            if (state == true) {

                // TODO This is currently only for private use. We should make it configurable in next versions.
                accessory.client.play("file:/mnt/nas/srv/music/einslive", function (stdout) {
                    callback(null);
                })
            } else {
                accessory.client.stop(function (stdout) {
                    callback(null);
                })
            }
        } else {
            callback(null);
        }

    })
};


function MpcAccessoryOutput(log, output, host, port) {
    this.log = log;
    this.output = output;
    this.host = host;
    this.port = port;
    this.name = output.name;
    this.id = output.id;
    this.client = new mpc(this.host, this.port);
}

MpcAccessoryOutput.prototype.getServices = function () {

    var self = this;

    var lightbulbService = new Service.Switch();

    lightbulbService
        .getCharacteristic(Characteristic.On)
        .on('get', self.getOn.bind(self))
        .on('set', self.setOn.bind(self));

    var informationService = new Service.AccessoryInformation();

    //TODO Add proper information characteristics
    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Test-Manufacturer")
        .setCharacteristic(Characteristic.Model, "Test-Model")
        .setCharacteristic(Characteristic.SerialNumber, "Test-Serial")
        .addCharacteristic(Characteristic.FirmwareRevision, "Test-FirmwareRevision");

    return [informationService, lightbulbService];
};

MpcAccessoryOutput.prototype.getOn = function (callback) {
    var accessory = this;

    accessory.client.getOutputs(function (outputs) {
        var on = outputs[accessory.id].on;
        accessory.log("Output <%s> state: %s", accessory.name, on);
        callback(null, on);
    });
};

MpcAccessoryOutput.prototype.setOn = function (on, callback) {
    var accessory = this;

    accessory.log("Setting output <%s> state to: %s", accessory.name, on);
    accessory.client.setOutput(accessory.id, on, function (data) {
        callback(null);
    });
};