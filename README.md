# jquery.imagecursorzoom
Image Cursor Zoom - jQuery Plugin

```javascript
// Install - HEAD
<script src="sourceurl/jquery.imagecursorzoom.js"></script>

// Install - requirejs
requirejs(['sourceurl/jquery.imagecursorzoom'], function(imageCursorZoom){ });

// Use case 1 - jQuery Plugin onClick event binding
$('IMG.zoom').imageCursorZoom();

// Use case 2 - direct call
$.imageCursorZoom( document.getElementById('ImageZoom') );

// Use case 3 - jQuery event delegate
$('BODY').on('click', 'IMG.zoom', function(){
  $.imageCursorZoom( this );
});

```
