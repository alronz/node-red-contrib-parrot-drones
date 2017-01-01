module.exports = function (RED) {


    function DroneData(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var settings = RED.nodes.getNode(config.settings);
        if (!settings) {
            node.error("settings aren't defined");
        }

        node.status({fill: "red", shape: "ring", text: "disconnected"});
        settings.register(node);

        settings.eventEmitter.on('isReady', function () {
            node.status({fill: "green", shape: "dot", text: "connected"});
            settings.handleDroneData(node);
        });

        node.on('close', function () {
            settings.deregister(node);
        });

    }

    RED.nodes.registerType("drone-data", DroneData);
};