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


    this.connect = function (callback) {
        jumpingDrone.connect(function () {
            jumpingDrone.on("ready", function () {
                jumpingDroneReady = true;

                if (typeof callback === "function") {
                    callback();
                }
            });
        });
    };

    this.isReady = function () {
        return jumpingDroneReady;
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

module.exports = JumpingDroneClient;
