var jumpingDrone = require('node-sumo').createClient();


module.exports = function (RED) {


    function ParrotDroneData(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var jumpingDroneReady = false;
        var settings = RED.nodes.getNode(config.settings);
        if (!settings) {
            node.error("settings aren't defined");
        }
        switch (settings.type) {
            case 'JumpingDrone':
            {
                jumpingDrone.connect(function () {
                    handleJumpingDroneData();
                });
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

        function handleJumpingDroneData() {

            jumpingDrone.on("battery", function (battery) {
                node.send({"battery": battery});
            });

            jumpingDrone.on("batteryCritical", function () {
                node.send({"battery": "critical"});
            });

            jumpingDrone.on("batteryLow", function () {
                node.send({"battery": "low"});
            });


            jumpingDrone.on("ready", function () {
                node.send({"status": "ready"});
            });

            jumpingDrone.on("postureStanding", function () {
                node.send({"posture": "standing"});
            });

            jumpingDrone.on("postureJumper", function () {
                node.send({"posture": "jumper"});
            });

            jumpingDrone.on("postureKicker", function () {
                node.send({"posture": "kicker"});
            });

            jumpingDrone.on("postureStuck", function () {
                node.send({"posture": "stuck"});
            });

            jumpingDrone.on("postureUnknown", function () {
                node.send({"posture": "unknown"});
            });

            jumpingDrone.on("jumpLoadUnknown", function () {
                node.send({"jumpLoad": "unknown"});
            });

            jumpingDrone.on("jumpLoadUnloaded", function () {
                node.send({"jumpLoad": "unloaded"});
            });

            jumpingDrone.on("jumpLoadLoaded", function () {
                node.send({"jumpLoad": "loaded"});
            });

            jumpingDrone.on("jumpLoadBusy", function () {
                node.send({"jumpLoad": "busy"});
            });

            jumpingDrone.on("jumpLoadLowBatteryUnloaded", function () {
                node.send({"jumpLoad": "unloaded and no jump due to battery Low"});
            });

            jumpingDrone.on("jumpLoadLowBatteryLoaded", function () {
                node.send({"jumpLoad": "loaded and no jump due to battery Low"});
            });

            jumpingDrone.on("jumpMotorOK", function () {
                node.send({"jumpMotor": "ok"});
            });

            jumpingDrone.on("jumpMotorErrorBlocked", function () {
                node.send({"jumpMotor": "blocked"});
            });

            jumpingDrone.on("jumpMotorErrorOverheated", function () {
                node.send({"jumpMotor": "overheated"});
            });

            jumpingDrone.on("internalPicture", function () {
                node.send({"message": "image taken and stored internally"});
            });

            jumpingDrone.on("video", function (videoFrame) {
                node.send({"message": "video frame is: " + videoFrame});
            });
        }
    }


    RED.nodes.registerType("ParrotDroneData", ParrotDroneData);
};