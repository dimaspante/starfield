window.onload = function(){
	var canvas   = document.getElementById("enterprise"),
			context  = canvas.getContext("2d"),
			width    = canvas.width,
			height   = canvas.height,
			romulans = width * height / 1000 * 4,
			dirX     = width / 2,
			dirY     = height / 2,
			speed		 = 60,
			factor   = 0.03,
			ships    = [];

	/* populates radar */
	for(var x = 0; x < romulans; x++) {
		ships[x] = {
			x: range(0, width),
			y: range(0, height),
			size: range(0, 1)
		};
	}

	/* "Mr. Sulu" */
	canvas.onmousemove = function(event) {
		var rect = canvas.getBoundingClientRect(),
      	scaleX = canvas.width / rect.width,
      	scaleY = canvas.height / rect.height;
		
		dirX = (event.clientX - rect.left) * scaleX,
		dirY = (event.clientY - rect.top) * scaleY;
	}
	
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(e) {
			if (e.absolute) {
				var write;
				write = 'Alpha: '+ Math.floor(e.alpha);
				write += ', Beta: '+ Math.floor(e.beta);
				write += ', Gamma: '+ Math.floor(e.gamma);
				document.getElementById("tilt").innerHTML = write;
				
				dirX = Math.floor((e.alpha*e.gamma)/15);
				dirY = Math.floor(e.beta*2);
			}
		});
	}
	
	/* detect acceleration */
	function MouseWheelHandler(e){
    var e = window.event || e,
    		delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		
		factor = (delta == 1) ? 0.06 : 0.009;
	}
	
	if(window.addEventListener){
  	window.addEventListener("mousewheel", MouseWheelHandler, false);
  	window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	
	/* enter warp speed */
	function fly(){
		var origX,
				origY;
		
		context.clearRect(0, 0, width, height);
		
		for(var x = 0; x < romulans; x++) {
			origX = ships[x].x;
			origY = ships[x].y;
			
			ships[x].x += (ships[x].x - dirX) * ships[x].size * factor;
			ships[x].y += (ships[x].y - dirY) * ships[x].size * factor;
			ships[x].size += factor;
			
			if(ships[x].x < 0 || ships[x].x > width || ships[x].y < 0 || ships[x].y > height) {
				ships[x] = {
					x: range(0, width),
					y: range(0, height),
					size: 0
				};
			}
			
			context.strokeStyle = "rgba(255, 255, 255, " + Math.min(ships[x].size, 1) + ")";
			context.lineWidth = ships[x].size;
			context.beginPath();
			context.moveTo(origX, origY);
			context.lineTo(ships[x].x, ships[x].y);
			context.stroke();
			
			document.getElementById("pos").innerHTML = 'Mouse: '+dirX+' , '+dirY;
		}
	}
	
	/* calculate the total */
	function range(start, end) {
		return Math.random() * (end - start) + start;
	}
	
	/* refresh canvas */
	window.setInterval(fly, Math.floor(1000 / speed));
};
