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
	if (!typeof e.target === HTMLImageElement) return; // Just to be sure
	
	this.doLoop = false;
	
	/* Fade out the image by adding the 'lg_hidden' class */
	this.curr_img.className = "lg_hidden";
	
	/* Change the source and fade back in */
	setTimeout(function(){
		var next_src = this.srcs[this.getNextSrc()];
		this.curr_img.setAttribute('src', e.target.getAttribute('src'));
		this.curr_img.className = "";
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
	
	/* Different browsers implement the CSS3 transition style differently, so get the
	 * relevant property name. Then, create an inline style for the curr_img element. */
	
	var cssTransform=getSupportedProp(['transition', 'MozTransition', 'WebkitTransition', 'msTransition', 'OTransition']);
	this.curr_img.style[cssTransform] = "opacity " + this.opts.fade_time/2 + "ms linear";
	
	el.appendChild(this.curr_img);
	
	/* And create the thumbnails in a child element */
	
	if (this.opts.display_thumbs){
		this.thumb_el = document.createElement('div');
		this.thumb_el.setAttribute('id', 'lg_thumbs');
		this.thumb_el.style.width = this.opts.main_width + "px";
		this.thumb_el.style.height = this.opts.thumb_height + "px";
		
		this.thumb_nav_l = document.createElement('a');
		this.thumb_nav_r = document.createElement('a');
		this.thumb_nav_l.appendChild(document.createTextNode('<'));
		this.thumb_nav_r.appendChild(document.createTextNode('>'));
		
		this.thumb_el.appendChild(this.thumb_nav_l);
		
		for (i=0; i<this.srcs.length;i++){
			var thumb = document.createElement('img');
			thumb.setAttribute('width', this.opts.thumb_width);
			thumb.setAttribute('height', this.opts.thumb_height);
			thumb.setAttribute('src', this.srcs[i]);
			this.thumb_el.appendChild(thumb);
			thumb.addEventListener('click', this.userSelectImage.bind(this), false);
		}
		this.thumb_el.appendChild(this.thumb_nav_r);
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
			this.curr_img.className = "lg_hidden";
			
			/* Change the source and fade back in */
			setTimeout(function(){
				if (this.doLoop){
					var next_src = this.srcs[this.getNextSrc()];
					this.curr_img.setAttribute('src', next_src);
					this.curr_img.className = "";
				}
			}.bind(this), this.opts.fade_time);
		}
		
	}.bind(this), this.opts.display_time + this.opts.fade_time*2);
}

function getSupportedProp(propArray){
/* For browsers that implement CSS3 styles in different ways, when a
 * list of potential properties is supplied, return the correct one */

    var root=document.documentElement;
    for (var i=0; i<propArray.length; i++){
        if (typeof root.style[propArray[i]]=="string"){
            return propArray[i];
        }
    }
}
