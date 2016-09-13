# homebridge-mpc
Homebridge plugin to interface the popular mpc command line client [mpc](https://www.musicpd.org/clients/mpc/). The plugin is configured as a homebridge platform and provides accessories based on the connected music player daemon. The accessories are divided into two types. The first and main accessory type (a lightbulb) allows to control the general playback and volume control of the music player daemon. For each configured MPD output the second type (a switch) is used to control the corresponding state.
At this point I would like to suggest giving forked-daapd [forked-daapd](https://github.com/ejurgensen/forked-daapd) a try to build the needed audio and playlist/song management backend. It includes a great MPD implementation and is especially useful, if you want to setup a multi room audio system using AirPlay.

### ATTENTION
The code actually includes a static URI to my local radio stream m3u. Therefore it should not be functional without modifications. In future release, I will provide a corresponding configuration property. Feature requests, reported issues and pull requests are always welcome.

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
