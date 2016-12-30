var jumpingDrone = require('node-sumo').createClient();

module.exports = function (RED) {

    function ParrotDroneControl(config) {
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
                    jumpingDroneReady = true;
                });
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
                    handleJumpingDroneCommands(msg);
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

        function handleJumpingDroneCommands(msg) {
            var command = msg.command;

            if (command) {
                if (jumpingDroneReady) {
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
                            jumpingDrone.animationsLongJump();
                            break;
                        }
                        case 'animation-long-jump-jumper':
                        {
                            jumpingDrone.postureJumper();
                            jumpingDrone.animationsLongJump();
                            break;
                        }
                        case 'animation-high-jump':
                        {
                            jumpingDrone.postureJumper();
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
                            video.on("data", function(data) {
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
                    jumpingDrone.connect(function () {
                        jumpingDroneReady = true;
                    });
                }
            } else {
                node.error("msg.command isn't defined");
            }
        }
    }

    RED.nodes.registerType("ParrotDroneControl", ParrotDroneControl);
};