module.exports = function (RED) {

    function Constructor(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var settings = RED.nodes.getNode(config.settings);
        if (!settings) {
            node.error("settings aren't defined");
        }

        var JumpingDroneClient = require('../drone-clients/JumpingDroneClient');
        var jumpingDroneClient = JumpingDroneClient.getInstance(settings);

        switch (settings.droneType) {
            case 'Jumping Drone':
            {
                node.status({fill: "red", shape: "ring", text: "disconnected"});

                if (!jumpingDroneClient.isReady()) {
                    jumpingDroneClient.connect(function () {
                        node.on('input', function (msg) {
                            jumpingDroneClient.handleDroneCommands(msg, node);
                        });
                        node.status({fill: "green", shape: "dot", text: "connected"});
                    });
                } else {
                    node.status({fill: "green", shape: "dot", text: "connected"});
                    node.on('input', function (msg) {
                        jumpingDroneClient.handleDroneCommands(msg, node);
                    });
                }


                break;
            }
            default:
            {
                node.error("settings.type isn't defined");
                break;
            }
        }

        node.on('close', function () {
        });

    }

    RED.nodes.registerType("drone-control", Constructor);
};