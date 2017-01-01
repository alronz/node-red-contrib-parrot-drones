module.exports = function (RED) {
    function DroneConfig(n) {
        RED.nodes.createNode(this, n);
        this.droneType = n.droneType;
        this.ip = n.ip;
        var node = this;
        var clientMap =
        {
            'Jumping Drone': 'JumpingDroneClient'
        };
        var registeredNodes = [];

        var events = require('events');
        this.eventEmitter = new events.EventEmitter();


        var Client = require('../drone-clients/' + clientMap[this.droneType]);
        var client = Client.getInstance(this);

        this.connect = function () {
            if (this.droneType) {
                if (!client.isReady()) {
                    if (!client.isConnectionInProgress()) {
                        client.connect(function (err) {
                            if (err) {
                                node.error("Error connecting to drone, try again.");
                            } else {
                                node.log("connected to drone client");
                                node.eventEmitter.emit('isReady');
                            }
                        });
                    } else {
                        node.warn("Connection to drone still in progress, try again later");
                    }
                } else {
                    node.log("connected to drone client");
                }
            } else {
                node.error("settings.droneType isn't defined");
            }
        };

        node.on('close', function () {
            client.disconnect();
            console.log("close config node");
        });


        this.handleDroneCommands = function (msg, node) {
            client.handleDroneCommands(msg, node);
        };


        this.handleDroneData = function (node) {
            client.handleDroneData(node);
        };

        this.register = function (node) {
            registeredNodes.push(node);
        };

        this.deregister = function (node) {
            for (var i = 0; i < registeredNodes.length; i++) {
                if (registeredNodes[i] === node)
                    delete registeredNodes[i];
            }
        };

        // connect to drone client
        this.connect();
    }


    RED.nodes.registerType('drone-config', DroneConfig)
};
