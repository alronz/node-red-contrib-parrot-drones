module.exports = function (RED) {

    function ParrotDroneConfig(config) {
        RED.nodes.createNode(this, config);
        this.type = config.type;
        this.ip = config.ip;

        this.on('close', function () {
        });

    }

    RED.nodes.registerType("ParrotDroneConfig", ParrotDroneConfig);
};