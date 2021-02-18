
var timerID = null;
var interval = 100;

self.onmessage = function (e) {
	if (e.data == "start") {
		//	console.log("starting", e.data);
		timerID = setInterval(function () { postMessage("tick"); }, interval)
	}
	else if (e.data.interval) {
		//	console.log("setting interval", e.data.interval);
		interval = e.data.interval;
		//	console.log("interval=" + interval);
		if (timerID) {
			clearInterval(timerID);
			timerID = setInterval(function () { postMessage("tick"); }, interval)
		}
	}
	else if (e.data == "stop") {
		//	console.log("stopping", timerID);
		clearInterval(timerID);
		timerID = null;
	}
};

