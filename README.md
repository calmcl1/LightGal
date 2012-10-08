LightGal
========

A minimal, CSS-3 based image rotator with optional thumbnails and fading.

### What is LightGal?
LightGal is a lightweight image gallery, based on CSS3 image transitions. It can snap between images or fade in/out. It is fully customizable, yet unobtrusive.

### Which browsers support LightGal?
All the modern ones, with the exception of IE 9 and below (well, what did you expect?)
The core functionality behind this is the CSS3 transition property, so if your browser falls into [this compatibility table](https://developer.mozilla.org/en-US/docs/CSS/Using_CSS_transitions#Browser_compatibility), then LightGal should work.

### How do I implement LightGal?

Download LightGal [from GitHub](https://github.com/calmcl1/LightGal).

Add the following line to your HEAD tag:
`<script src="path/to/lightgal.min.js"></script>`

And add this to the BODY tag:
```
<div id="gallery">
    <img src="img/pic_1.png" />
    <img src="img/pic_2.png" />
    <img src="img/pic_3.png" />
    <img src="img/pic_4.png" />
</div>

<script type="text/javascript">
var lg = new LightGal();
lg.begin(document.getElementById("gallery"));
</script>
```

With this method, you can have multiple galleries on the same page, should you wish.

### How do I customize LightGal?
All of the options for a given gallery can be passed like so:
```
var lg = new LightGal({
    main_width: 640,
    main_height: 480
});
```

The acceptable options are:
* `fade` *(true/false)*: If true, then fade between images. If false, no transition. Default: `true`.
* `fade_time` *(number)*: The time (in milliseconds) it takes to fade between images. Ignored if `fade` is false. Default: `1000`.
* `display_time` *(number)*: The time (in milliseconds) to show an image for before moving on. Default: `2000`.
* `display_thumbs` *(true/false)*: If true, displays a 'filmstrip' style row of thumbnails that the user can navigate through the gallery with. Default: `false`.
* `main_width` *(number)*: The width of the gallery image. Default: `400` px.
* `main_height` *(number)*: The height of the gallery image. Default: `300` px.
* `thumb_width` *(number)*: The width of the thumbnails, if used. Default: `165` px.
* `thumb_height` *(number)*: The height of the thumbnails, if used. Default: `110` px.