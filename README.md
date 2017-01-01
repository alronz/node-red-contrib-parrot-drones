
<h3>Overview</h3>

<p>This project aims to provide a Node in Node-Red that can be used to control Parrot different drones based on Parrot <a href="http://developer.parrot.com/docs/SDK3">ARDroneSDK3</a> and by using <a href="https://github.com/alronz/node-sumo">existing nodejs library</a>. </p>

<p>This project contains two nodes as explained below:</p>
- ParrotDroneData: is an output node that can be used to read all the data received from the drone such as battery, status, etc ..
- ParrotDroneControl: is a node that can be used to perform many drone commands and might produce output in response to the commands.

Additionally a configuration node 'ParrotDroneConfig' has been created to have all the drone related settings and is accessible by the other nodes.
All the commands and events are tested with real drone to verify that it works as expected.

<h3>Supported Parrot Drones as of now</h3>
  - Parrot Jumping Mini Drones.
  
<h3> Install</h3>
  
  ```npm i node-red-contrib-parrot-drones```


<h3>Commands</h3>
   The command name is expected to be inside <b>msg.command</b> and the command parameters should be inside <b>msg.payload</b>. 
   Below are the supported commands categorized by drone type:

<h4>Jumping Mini Drones </h4>
- 'forward' - Move the drone forward at the specified speed (between 0 and 100). Required input <b>msg.payload.speed</b>
- 'backward' - Move the drone backward at the specified speed (between 0 and 100). Required input <b>msg.payload.speed</b>  
- 'right' - Turn the drone right at the specified speed (between 0 and 100).  Required input <b>msg.payload.speed</b>  
- 'left' - Turn the drone left at the specified speed (between 0 and 100).  Required input <b>msg.payload.speed</b>  
- 'stop' - Tell the drone to stop moving.  
- 'posture-kicker' - Move the drone into the kicker posture. The drone's jump mechanism is used to kick objects behind the drone. 
- 'posture-jumper' - Move the drone into the jumper posture. The drone's jump mechanism is used to propel the drone into the air.  
- 'posture-standing' - Move the drone into the standing (on head) posture.  
- 'animation-slalom' - Make the drone drive in a slalom pattern.  
- 'animation-spiral' - Make the drone drive in a spiral. 
- 'animation-spin-to-posture' - Spin and then change posture.  
- 'animation-spin-jump' - Spin and then jump the drone.  
- 'animation-ondulation' - Perform the ondulation animation.  
- 'animation-metronome' - Perform the metronome animation.  
- 'animation-slow-shake' - Shake the drone from side-to-side.  
- 'animation-tap' - Tap the drone's jump mechanism.  
- 'animation-spin' - Perform a spin.  
- 'animation-stop' - Stop the pre-programmed animation.  
- 'animation-long-jump-kicker' - Perform a long jump. The drone is in kicker posture before performing this animation.  
- 'animation-long-jump-jumper' - Perform a long jump. The drone is in jumper posture before performing this animation.   
- 'animation-high-jump' - Perform a high jump. The drone needs to be in the jumper posture to use this API.  
- 'take-picture' - Take picture and store it internally  
- 'get-video-stream' - Emits the MJPEG video stream. This will send the data representing the video as a stream of buffer data 
</ul>

<h3>Drone Data and Events</h3>
This node will listen to multiple events triggered by the drone and publish the data in the output <b>msg</b> object. 
Below are the publish events categorized by drone type: 

<h4> Jumping Mini Drones:</h4>
     
<b>batteryPercentage</b> 

A numeric value indicating the current battery level 

<b>batteryStatus</b> 

This can be two values based on the events received from the drone as explained below:

- 'critical' - Emitted when the battery is at a critically low level. 
- 'low' - Emitted when the battery is at a low level. 


<b>status</b> 
 
The status of the drone which can be 'ready'  

<b>posture</b> 

 The current posture of the drone, this can be 5 values based on the events received from the drone as explained below:
     
- 'standing' - Emitted when the drone changes to the standing posture. The event may be emitted slightly before the movement is complete so you may want to wait a short time before sending the drone further commands. 
- 'jumper' - Emitted when the drone changes to the jumper posture. The event may be emitted slightly before the movement is complete so you may want to wait a short time before sending the drone further commands. 
- 'kicker' - Emitted when the drone changes to the kicker posture. The event may be emitted slightly before the movement is complete so you may want to wait a short time before sending the drone further commands. 
- 'stuck' - Emitted when the drone is stuck. 
- 'unknown' - Emitted when the drone posture is unknown. 
     
<b> jumpLoad </b> 

The jump loading status of the drone, this can be 6 values based on the events received from the drone as explained below:

- 'busy' - Emitted when the jump mechanism is busy (for example, if you tell the drone to jump while a jump is already in progress). 
- 'unloaded' - Emitted when the jump mechanism is unloaded (for example, after a jump or kick). The event may be emitted slightly before the movement is complete so you may want to wait a short time before sending the drone further commands. 
- 'loaded' - Emitted when the jump mechanism is retracted (for example, after a long jump while in the kicker posture). The event may be emitted slightly before the movement is complete so you may want to wait a short time before sending the drone further commands. 
- 'unknown' - Emitted when the load state of the jump mechanism is unknown. 
- 'unloaded and no jump due to battery Low' - Emitted when the jump mechanism is unloaded and the drone cannot perform the jump requested because the battery is low. 
- 'loaded and no jump due to battery Low' - Emitted when the jump mechanism is unloaded and the drone cannot perform the jump requested because the battery is low. 
     

<b>jumpMotor</b> 

The status of the jump motor of the drone, this can be three values based on the events received from the drone as explained below:

- 'ok' - Emitted when the jump motor is OK (it may have previously been blocked or overheated). 
- 'blocked' - Emitted when the jump motor is blocked. 
- 'overheated' - Emitted when the jump motor has overheated. 

<b>message</b> 

A message sent from the drone, this can be two values based on the events received from the drone as explained below:

- 'image taken and stored internally' - Emitted when a photo is taken and stored internally (response to takePicture(opts)). 
- 'video frame is (the video frame)' - Emits single MJPEG video frame. 


<h3>Example flow and how it works</h3>

- to be added