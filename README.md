# homebridge-mpc

### Configuration (config.json)
homebridge-mpc is a plugin that is configured as homebridge platform.
```json
{
  "bridge": {
    "name": "Homebridge",
    "username": "CC:22:3D:E3:CE:35",
    "port": 51826,
    "pin": "031-45-154"
  },
  "description": "This is an example configuration file with a configured MPC platform. You can use this as a template for creating your own configuration file containing devices you actually own.",
  "accessories": [],
  "platforms": [
    {
      "platform": "mpc",
      "name": "MPD",
      "host": "127.0.0.1",
      "port": 6600
    }
  ]
}
```
Fields:

* "platform" - Must be set to mpc
* "name" - Name of the control accessory to play, stop and set the volume of the MPD
* "host" - IP address of the MPD server
* "port" - Port of the MPD server

### Dependencies:
 * Homebridge: https://github.com/nfarina/homebridge
 * mpc: https://www.musicpd.org/clients/mpc/
