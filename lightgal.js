function LightGal(options) {
	// Set default options
	this.opts = {
		fade: true,
		fade_time: 1000,
		display_time: 2000,
		display_thumbs: false,
		main_width: 400,
		main_height: 300,
		thumb_width: 165,
		thumb_height: 110
	};
	
	// And update to user-specified values
	for (opt in options){
		if (opt in this.opts){
			this.opts[opt] = options[opt];
		}
	}
	
	if (!this.opts.fade) this.opts.fade_time = 0;
};

LightGal.prototype.userSelectImage = function (e){	
	if (!typeof e.target === HTMLImageElement) return false; // Just to be sure
	
	this.doLoop = false;
	
	/* Fade out the image by adding the 'lg_hidden' class */
	this.curr_img.className = "lg_hide lg_hidden";
	
	/* Change the source and fade back in */
	setTimeout(function(){
		var next_src = this.srcs[this.getNextSrc()];
		this.curr_img.setAttribute('src', e.target.getAttribute('src'));
		this.curr_img.className = "lg_hide";
	}.bind(this), this.opts.fade_time);
	
	setTimeout(function(){
		this.doLoop = true;
	}.bind(this), this.opts.display_time);
}

LightGal.prototype.begin = function (el){
	/* The images to be LightGal'd are contained in an element, which
	 * is passed to this function.*/
	
	/* We need to create a style for the CSS3 fade-in/out and insert it
	 * into the DOM. However, this only needs to be done once, so check
	 * for existing entries. */
	
	if (document.getElementsByName("lg_style").length === 0 && this.opts.fade){
		var style_el = document.createElement('style');
		style_el.setAttribute("name", "lg_style")
		
		style_el.appendChild(document.createTextNode(".lg_hide{"));
		style_el.appendChild(document.createTextNode("transition: opacity " + this.opts.fade_time/2 + "ms linear;"));
		style_el.appendChild(document.createTextNode("-webkit-transition: opacity " + this.opts.fade_time/2 + "ms linear;"));
		style_el.appendChild(document.createTextNode("-moz-transition: opacity " + this.opts.fade_time/2 + "ms linear;"));
		style_el.appendChild(document.createTextNode("-o-transition: opacity " + this.opts.fade_time/2 + "ms linear;"));
		style_el.appendChild(document.createTextNode("}"));
		
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(style_el);
	}
	
	/* Gather the sources of the images to be LightGal'd. */
	
	images = el.getElementsByTagName('img');
	this.srcs = [];
	for (i=0; i<images.length; i++){
		this.srcs.push(images[i].getAttribute('src'));
	}
	
	/* And remove the original images. */
	
	el.innerHTML = "";
	
	/* Replace them with our own element, which we can more easily control */
	
	this.curr_img = document.createElement('img');
	
	this.curr_img.setAttribute('src', this.srcs[0]);
	this.curr_img.setAttribute('width', this.opts.main_width);
	this.curr_img.setAttribute('height', this.opts.main_height);
	this.curr_img.className = "lg_hide";
	
	el.appendChild(this.curr_img);
	
	/* And create the thumbnails in a child element */
	
	if (this.opts.display_thumbs){
		this.thumb_el = document.createElement('div');
		this.thumb_el.setAttribute('id', 'lg_thumbs');
		for (i=0; i<this.srcs.length;i++){
			var thumb = document.createElement('img');
			thumb.setAttribute('width', this.opts.thumb_width);
			thumb.setAttribute('height', this.opts.thumb_height);
			thumb.setAttribute('src', this.srcs[i]);
			this.thumb_el.appendChild(thumb);
			thumb.addEventListener('click', this.userSelectImage.bind(this), false);
		}
		el.appendChild(this.thumb_el);
	}
	
	/* Begin transition loop */
	this.doLoop = true;
	this.transition();
	
}

LightGal.prototype.getNextSrc = function (){
	/* Does what it says on the tin - returns the index of the
	 * next source in the array. */
	
	var currentIndex = this.srcs.indexOf(this.curr_img.getAttribute('src'));
	return (currentIndex === this.srcs.length -1) ? 0 : currentIndex + 1;
}

LightGal.prototype.transition = function(){	
	/* And begin the loop. */
	
	/* By default, setInterval changes the 'this' keyword to the Window object
	 * in the called function, which messes things up. However, by using the
	 * 'bind' function, we can retain the value of 'this', rather than messing
	 * around with scopes and closures.
	 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
	 */
	
	setInterval(function(){
		
		if (this.doLoop){
		
			/* Fade out the image by adding the 'lg_hidden' class */
			this.curr_img.className = "lg_hide lg_hidden";
			
			/* Change the source and fade back in */
			setTimeout(function(){
				var next_src = this.srcs[this.getNextSrc()];
				this.curr_img.setAttribute('src', next_src);
				this.curr_img.className = "lg_hide";
			}.bind(this), this.opts.fade_time);
		}
		
	}.bind(this), this.opts.display_time + this.opts.fade_time*2);
}