module.exports = function (RED) {

    function ParrotDroneControl(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var settings = RED.nodes.getNode(config.settings);
        if (!settings) {
            node.error("settings aren't defined");
        }

        var JumpingDroneClient = require('../DroneClients/JumpingDroneClient');
        var jumpingDroneClient = new JumpingDroneClient(settings, node);

        switch (settings.type) {
            case 'JumpingDrone':
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

            switch (settings.type) {
                case 'JumpingDrone':
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

    RED.nodes.registerType("ParrotDroneControl", ParrotDroneControl);
};