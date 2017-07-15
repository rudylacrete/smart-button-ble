var controls = require("ble_hid_controls");
NRF.setServices(undefined, { hid : controls.report });

var angle = null;
Puck.magOn();
Puck.on('mag', function(xyz) {
  var newAngle = 180 * Math.atan2(xyz.x, xyz.y) / Math.PI;
  if(angle !== null && Math.abs(angle - newAngle) > 1) {
  	if(angle < newAngle) {
  		console.log("Volume UP");
  		controls.volumeUp();
  	} else {
  		console.log("Volume DOWN");
  		controls.volumeDown();
  	}
  }
  angle = newAngle;
});

save();