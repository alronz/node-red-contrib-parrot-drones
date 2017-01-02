
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
- 'get-video-stream' - Emits the MJPEG video stream. This will send the data representing the video as a stream of buffer data in <b>object.payload.video</b>
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

The example flow below will show how to use all the supported commands in this node to control a parrot jumping mini drone.

    [{"id":"2225687d.0c5988","type":"drone-control","z":"128fc2a1.2fc64d","name":"Drone Control","settings":"c1e2cbff.a51ca8","x":619.5,"y":255,"wires":[["34fe3d0d.3a46a2"]]},{"id":"7747f1b8.aadc6","type":"function","z":"128fc2a1.2fc64d","name":"","func":"msg.command = msg.payload;\nmsg.payload = {};\n\nvar speed = flow.get('speed') || 0;\n\nmsg.payload.speed = speed;\nreturn msg;","outputs":1,"noerr":0,"x":413.5,"y":258,"wires":[["2225687d.0c5988"]]},{"id":"34fe3d0d.3a46a2","type":"debug","z":"128fc2a1.2fc64d","name":"","active":true,"console":"false","complete":"true","x":878.5,"y":260,"wires":[]},{"id":"34469adb.cdf3a6","type":"ui_text_input","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","mode":"text","delay":300,"name":"Speed","topic":"speed","group":"Movement","order":1,"x":76.5,"y":146,"wires":[["98cd5977.c430c8"]]},{"id":"98cd5977.c430c8","type":"function","z":"128fc2a1.2fc64d","name":"","func":"\nflow.set('speed',msg.payload);\n\nreturn msg;","outputs":"1","noerr":0,"x":219,"y":145,"wires":[[]]},{"id":"ef8de3aa.e35a9","type":"ui_button_row","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Up-Right","topic":"","group":"Movement","order":1,"toggle":false,"buttons":[{"payload":"forward","icon":"keyboard_arrow_up","color":"Blue","on_icon":"alarm_on","on_color":"red"},{"payload":"right","icon":"keyboard_arrow_right","color":"Blue","on_icon":"keyboard_arrow_down","on_color":"Blue"}],"inputs":0,"x":81.5,"y":204,"wires":[["7747f1b8.aadc6"]]},{"id":"457c0395.e4103c","type":"ui_button_row","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Down-Left","topic":"","group":"Movement","order":1,"toggle":false,"buttons":[{"payload":"backward","icon":"keyboard_arrow_down","color":"Blue","on_icon":"alarm_on","on_color":"red"},{"payload":"left","icon":"keyboard_arrow_left","color":"Blue","on_icon":"keyboard_arrow_down","on_color":"Blue"}],"inputs":0,"x":81,"y":259,"wires":[["7747f1b8.aadc6"]]},{"id":"3c81b436.8cff3c","type":"ui_button_row","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Stop","topic":"","group":"Movement","order":1,"toggle":false,"buttons":[{"payload":"stop","icon":"clear","color":"Blue","on_icon":"alarm_on","on_color":"red"}],"inputs":0,"x":71,"y":311,"wires":[["7747f1b8.aadc6"]]},{"id":"c0378e04.5fddd","type":"ui_template","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Animations","group":"Animations","order":1,"format":"<md-button ng-click=\"send({payload: 'animation-stop'})\">\n  Animation Stop\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-slalom'})\">\n  Slalom\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-spiral'})\">\n  Spiral\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-spin-to-posture'})\">\n  Spin Posture\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-spin-jump'})\">\n  Spin Jump\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-ondulation'})\">\n  Ondulation\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-metronome'})\">\n  Metronome\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-slow-shake'})\">\n  Slow Shake\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-tap'})\">\n  Tap\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-spin'})\">\n  Spin\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-long-jump-kicker'})\">\n  Long Jump Kicker\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-long-jump-jumper'})\">\n  Long Jump Jumper\n</md-button>\n\n<md-button ng-click=\"send({payload: 'animation-high-jump'})\">\n  High Jump\n</md-button>","storeOutMessages":true,"fwdInMessages":true,"x":81.5,"y":453,"wires":[["7747f1b8.aadc6"]]},{"id":"e17316ed.020258","type":"ui_template","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Postures","group":"Posture","order":1,"format":"<md-button ng-click=\"send({payload: 'posture-kicker'})\">\n Kicker\n</md-button>\n\n<md-button ng-click=\"send({payload: 'posture-jumper'})\">\n  Jumper\n</md-button>\n\n<md-button ng-click=\"send({payload: 'posture-standing'})\">\n  Standing\n</md-button>","storeOutMessages":true,"fwdInMessages":true,"x":68.5,"y":379,"wires":[["7747f1b8.aadc6"]]},{"id":"c4c919df.d8cc08","type":"ui_template","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Media","group":"Media","order":1,"format":"<md-button ng-click=\"send({payload: 'take-picture'})\">\n  Take Picture\n</md-button>\n\n<md-button ng-click=\"send({payload: 'get-video-stream'})\">\n  Get Video Stream\n</md-button>\n\n","storeOutMessages":true,"fwdInMessages":true,"x":87,"y":529,"wires":[["7747f1b8.aadc6"]]},{"id":"a002ad6b.096c9","type":"drone-data","z":"128fc2a1.2fc64d","name":"Drone Data","settings":"c1e2cbff.a51ca8","x":93.5,"y":675,"wires":[["415994af.4398cc","560161a6.418e4"]]},{"id":"415994af.4398cc","type":"debug","z":"128fc2a1.2fc64d","name":"","active":true,"console":"false","complete":"true","x":196,"y":826,"wires":[]},{"id":"47490fa1.301d5","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Posture Status","group":"Data","order":1,"format":"{{msg.payload.posture}}","x":716.5,"y":659,"wires":[]},{"id":"67c2705f.4de0c","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Drone Status","group":"Data","order":1,"format":"{{msg.payload.status}}","x":704,"y":710,"wires":[]},{"id":"9c35c6f8.72d868","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Jump Load Status","group":"Data","order":1,"format":"{{msg.payload.jumpLoad}}","x":729,"y":764,"wires":[]},{"id":"a01129b1.3c7188","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Jump Motor Status","group":"Data","order":1,"format":"{{msg.payload.jumpMotor}}","x":722,"y":823,"wires":[]},{"id":"671801b0.ac0df","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Messages","group":"Data","order":1,"format":"{{msg.payload.message}}","x":700,"y":879,"wires":[]},{"id":"d0b42a26.07d518","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Battery Status","group":"Data","order":1,"format":"{{msg.payload.batteryStatus}}","x":710,"y":606,"wires":[]},{"id":"79a90e39.7b73e","type":"ui_text","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"Battery Percentage","group":"Data","order":1,"format":"{{msg.payload.batteryPercentage}}","x":712,"y":547,"wires":[]},{"id":"560161a6.418e4","type":"switch","z":"128fc2a1.2fc64d","name":"","property":"topic","propertyType":"msg","rules":[{"t":"eq","v":"batteryPercentage","vt":"str"},{"t":"eq","v":"batteryStatus","vt":"str"},{"t":"eq","v":"posture","vt":"str"},{"t":"eq","v":"status","vt":"str"},{"t":"eq","v":"jumpLoad","vt":"str"},{"t":"eq","v":"jumpMotor","vt":"str"},{"t":"eq","v":"message","vt":"str"}],"checkall":"true","outputs":7,"x":313.5,"y":676,"wires":[["79a90e39.7b73e"],["d0b42a26.07d518"],["47490fa1.301d5"],["67c2705f.4de0c"],["9c35c6f8.72d868"],["a01129b1.3c7188"],["671801b0.ac0df","89d04758.58ad38","2f49b02c.ac6e2"]]},{"id":"89d04758.58ad38","type":"switch","z":"128fc2a1.2fc64d","name":"","property":"payload.buf","propertyType":"msg","rules":[{"t":"nnull"}],"checkall":"true","outputs":1,"x":337.5,"y":934,"wires":[["9c33d338.792f6"]]},{"id":"d0835a2e.b8e878","type":"debug","z":"128fc2a1.2fc64d","name":"","active":true,"console":"false","complete":"true","x":689,"y":1081,"wires":[]},{"id":"9c33d338.792f6","type":"function","z":"128fc2a1.2fc64d","name":"","func":"var originalBuf = msg.payload.buf;\nvar buf = new Buffer(originalBuf);\nmsg.payload = buf;\nmsg.payload.image = true;\nreturn msg;\n","outputs":1,"noerr":0,"x":484.5,"y":942,"wires":[["7c3999cc.152cb8","d0835a2e.b8e878"]]},{"id":"b4bc0fa8.428e1","type":"ui_template","z":"128fc2a1.2fc64d","tab":"aec1e0f8.c48b4","name":"","group":"Image","order":1,"format":"<img width=\"250\" height=\"250\" alt=\"image\" src=\"data:image/jpg;base64,{{msg.payload}}\"/>","storeOutMessages":true,"fwdInMessages":true,"x":971.5,"y":1037,"wires":[[]]},{"id":"7c3999cc.152cb8","type":"switch","z":"128fc2a1.2fc64d","name":"","property":"payload.image","propertyType":"msg","rules":[{"t":"true"}],"checkall":"true","outputs":1,"x":640.5,"y":942,"wires":[["659fcfdd.d3f4e"]]},{"id":"2f49b02c.ac6e2","type":"debug","z":"128fc2a1.2fc64d","name":"","active":true,"console":"false","complete":"true","x":147,"y":1000,"wires":[]},{"id":"659fcfdd.d3f4e","type":"base64","z":"128fc2a1.2fc64d","name":"","x":830.5,"y":963,"wires":[["b4bc0fa8.428e1"]]},{"id":"c1e2cbff.a51ca8","type":"drone-config","z":"","ip":"192.168.2.1","droneType":"Jumping Drone"},{"id":"aec1e0f8.c48b4","type":"ui_tab","z":"","name":"Drone","icon":"dashboard","order":"1"}]


The flow will generate a UI that can be accessed using http://127.0.0.1:1880/ui which shown in the screen shot below:

![Example Control Dashboard](images/Example-Control-DashBoard.png "Example Control DashBoard")