var instance;

JumpingDroneClient.getInstance = function (settings, node) {
    if (!instance) {
        instance = new JumpingDroneClient(settings, node);
    }

    return instance;
};

function JumpingDroneClient(settings) {
    var opts = {};
    var self = this;
    opts.ip = settings.ip;
    var jumpingDrone = require('node-sumo').createClient(opts);

    var jumpingDroneReady = false;
    var connectionInProgress = false;


    this.connect = function (callback) {
        connectionInProgress = true;
        jumpingDrone.connect(function (err) {
            if (err) {
                if (typeof callback === "function") {
                    callback(err);
                }
                connectionInProgress = false;
            } else {
                jumpingDrone.on("ready", function () {
                    jumpingDroneReady = true;
                    connectionInProgress = false;

                    if (typeof callback === "function") {
                        callback();
                    }
                });
            }
        });
    };

    this.disconnect = function () {
        jumpingDroneReady = false;
        connectionInProgress = false;
        jumpingDrone.disconnect();
    };

    this.isReady = function () {
        return jumpingDroneReady;
    };

    this.isConnectionInProgress = function () {
        return connectionInProgress;
    };

    this.handleDroneCommands = function (msg, node) {
        var command = msg.command;

        if (command) {
            if (self.isReady()) {
                switch (command) {
                    case 'forward':
                    {
                        if (msg.payload.speed && !isNaN(msg.payload.speed)) {
                            jumpingDrone.forward(msg.payload.speed);
                        } else {
                            node.error("msg.payload.speed isn't defined");
                        }

                        break;
                    }
                    case 'backward':
                    {
                        if (msg.payload.speed && !isNaN(msg.payload.speed)) {
                            jumpingDrone.backward(msg.payload.speed);
                        } else {
                            node.error("msg.payload.speed isn't defined");
                        }

                        break;
                    }
                    case 'right':
                    {
                        if (msg.payload.speed && !isNaN(msg.payload.speed)) {
                            jumpingDrone.right(msg.payload.speed);
                        } else {
                            node.error("msg.payload.speed isn't defined");
                        }

                        break;
                    }
                    case 'left':
                    {
                        if (msg.payload.speed && !isNaN(msg.payload.speed)) {
                            jumpingDrone.left(msg.payload.speed);
                        } else {
                            node.error("msg.payload.speed isn't defined");
                        }

                        break;
                    }
                    case 'stop':
                    {
                        jumpingDrone.stop();
                        break;
                    }
                    case 'posture-kicker':
                    {
                        jumpingDrone.postureKicker();
                        break;
                    }
                    case 'posture-jumper':
                    {
                        jumpingDrone.postureJumper();
                        break;
                    }
                    case 'posture-standing':
                    {
                        jumpingDrone.postureStanding();
                        break;
                    }
                    case 'animation-slalom':
                    {
                        jumpingDrone.animationsSlalom();
                        break;
                    }
                    case 'animation-spiral':
                    {
                        jumpingDrone.animationsSpiral();
                        break;
                    }
                    case 'animation-spin-to-posture':
                    {
                        jumpingDrone.animationsSpinToPosture();
                        break;
                    }
                    case 'animation-spin-jump':
                    {
                        jumpingDrone.animationsSpinJump();
                        break;
                    }
                    case 'animation-ondulation':
                    {
                        jumpingDrone.animationsOndulation();
                        break;
                    }
                    case 'animation-metronome':
                    {
                        jumpingDrone.animationsMetronome();
                        break;
                    }
                    case 'animation-slow-shake':
                    {
                        jumpingDrone.animationsSlowShake();
                        break;
                    }
                    case 'animation-tap':
                    {
                        jumpingDrone.animationsTap();
                        break;
                    }
                    case 'animation-spin':
                    {
                        jumpingDrone.animationsSpin();
                        break;
                    }
                    case 'animation-stop':
                    {
                        jumpingDrone.animationsStop();
                        break;
                    }
                    case 'animation-long-jump-kicker':
                    {
                        jumpingDrone.postureKicker();
                        jumpingDrone.on("postureKicker", function () {
                            setTimeout(function () {
                                jumpingDrone.stop();
                                jumpingDrone.animationsLongJump();
                            }, 5000);
                        });

                        break;
                    }
                    case 'animation-long-jump-jumper':
                    {
                        jumpingDrone.postureJumper();
                        jumpingDrone.on("postureJumper", function () {
                            setTimeout(function () {
                                jumpingDrone.stop();
                                jumpingDrone.animationsLongJump();
                            }, 5000);
                        });
                        break;
                    }
                    case 'animation-high-jump':
                    {
                        jumpingDrone.postureJumper();
                        jumpingDrone.on("postureJumper", function () {
                            setTimeout(function () {
                                jumpingDrone.stop();
                                jumpingDrone.animationsHighJump();
                            }, 5000);
                        });
                        break;
                    }
                    case 'take-picture':
                    {
                        jumpingDrone.takePicture();
                        break;
                    }
                    case 'get-video-stream':
                    {
                        var video = jumpingDrone.getVideoStream();
                        video.on("data", function (data) {
                            node.send(data);
                        });
                        break;
                    }
                    default:
                    {
                        node.error("command isn't recognized");
                        break;
                    }
                }
            } else {
                node.error("Jumping drone still not connected");
            }
        } else {
            node.error("msg.command isn't defined");
        }
    };

    this.handleDroneData = function (node) {

        jumpingDrone.on("battery", function (battery) {
            var object = {};
            object.topic = "batteryPercentage";
            object.payload = {};
            object.payload.batteryPercentage = battery;
            node.send(object);
        });

        jumpingDrone.on("batteryCritical", function () {
            var object = {};
            object.topic = "batteryStatus";
            object.payload = {};
            object.payload.batteryStatus = "critical";
            node.send(object);
        });

        jumpingDrone.on("batteryLow", function () {
            var object = {};
            object.topic = "batteryStatus";
            object.payload = {};
            object.payload.batteryStatus = "low";
            node.send(object);
        });


        jumpingDrone.on("ready", function () {
            var object = {};
            object.topic = "status";
            object.payload = {};
            object.payload.status = "ready";
            node.send(object);
        });

        jumpingDrone.on("postureStanding", function () {
            var object = {};
            object.topic = "posture";
            object.payload = {};
            object.payload.posture = "standing";
            node.send(object);
        });

        jumpingDrone.on("postureJumper", function () {
            var object = {};
            object.topic = "posture";
            object.payload = {};
            object.payload.posture = "jumper";
            node.send(object);
        });

        jumpingDrone.on("postureKicker", function () {
            var object = {};
            object.topic = "posture";
            object.payload = {};
            object.payload.posture = "kicker";
            node.send(object);
        });

        jumpingDrone.on("postureStuck", function () {
            var object = {};
            object.topic = "posture";
            object.payload = {};
            object.payload.posture = "stuck";
            node.send(object);
        });

        jumpingDrone.on("postureUnknown", function () {
            var object = {};
            object.topic = "posture";
            object.payload = {};
            object.payload.posture = "unknown";
            node.send(object);
        });

        jumpingDrone.on("jumpLoadUnknown", function () {
            var object = {};
            object.topic = "jumpLoad";
            object.payload = {};
            object.payload.jumpLoad = "unknown";
            node.send(object);
        });

        jumpingDrone.on("jumpLoadUnloaded", function () {
            var object = {};
            object.topic = "jumpLoad";
            object.payload = {};
            object.payload.jumpLoad = "unloaded";
            node.send(object);
        });

        jumpingDrone.on("jumpLoadLoaded", function () {
            var object = {};
            object.topic = "jumpLoad";
            object.payload = {};
            object.payload.jumpLoad = "loaded";
            node.send(object);
        });

        jumpingDrone.on("jumpLoadBusy", function () {
            var object = {};
            object.topic = "jumpLoad";
            object.payload = {};
            object.payload.jumpLoad = "busy";
            node.send(object);
        });

        jumpingDrone.on("jumpLoadLowBatteryUnloaded", function () {
            var object = {};
            object.topic = "jumpLoad";
            object.payload = {};
            object.payload.jumpLoad = "unloaded and no jump due to battery Low";
            node.send(object);
        });

        jumpingDrone.on("jumpLoadLowBatteryLoaded", function () {
            var object = {};
            object.topic = "jumpLoad";
            object.payload = {};
            object.payload.jumpLoad = "loaded and no jump due to battery Low";
            node.send(object);
        });

        jumpingDrone.on("jumpMotorOK", function () {
            var object = {};
            object.topic = "jumpMotor";
            object.payload = {};
            object.payload.jumpMotor = "ok";
            node.send(object);
        });

        jumpingDrone.on("jumpMotorErrorBlocked", function () {
            var object = {};
            object.topic = "jumpMotor";
            object.payload = {};
            object.payload.jumpMotor = "blocked";
            node.send(object);
        });

        jumpingDrone.on("jumpMotorErrorOverheated", function () {
            var object = {};
            object.topic = "jumpMotor";
            object.payload = {};
            object.payload.jumpMotor = "overheated";
            node.send(object);
        });

        jumpingDrone.on("internalPicture", function () {
            var object = {};
            object.topic = "message";
            object.payload = {};
            object.payload.message = "image taken and stored internally";
            node.send(object);
        });

        jumpingDrone.on("video", function (videoFrame) {
            var object = {};
            object.topic = "message";
            object.payload = {};
            object.payload.message = "video frame is: " + videoFrame;
            node.send(object);
        });
    }
}

module.exports = JumpingDroneClient;
