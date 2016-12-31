module.exports = function (RED) {
    function Constructor(n) {
        RED.nodes.createNode(this, n);
        this.droneType = n.droneType;
        this.ip = n.ip;
    }

    RED.nodes.registerType('drone-config', Constructor)
};
