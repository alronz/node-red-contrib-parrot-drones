module.exports = function (RED) {

    function Constructor(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var settings = RED.nodes.getNode(config.settings);
        if (!settings) {
            node.error("settings aren't defined");
        }

        var JumpingDroneClient = require('../drone-clients/JumpingDroneClient');
        var jumpingDroneClient = new JumpingDroneClient(settings, node);

        switch (settings.droneType) {
            case 'Jumping Drone':
            {
                jumpingDroneClient.connect();
                break;
            }
            default:
            {
                node.error("settings.type isn't defined");
                break;
            }
        }


        node.on('input', function (msg) {

            switch (settings.droneType) {
                case 'Jumping Drone':
                {
                    jumpingDroneClient.handleDroneCommands(msg);
                    break;
                }
                default:
                {
                    node.error("settings.type isn't defined");
                    break;
                }
            }
        });

        node.on('close', function () {
        });

    }

    RED.nodes.registerType("drone-control", Constructor);
};