/**
 * jquery.imageCursorZoom
 * jQuery Plugin
 *
 * @author bitofsky@neowiz.com
 * @since 2015.09.10
 * @see https://github.com/bitofsky/jquery.imagecursorzoom
 * @license MIT
 * @version 1.0
 */

"use strict";

(function( window, $ ){

  $.imageCursorZoom = imageCursorZoom;

  $.fn.imageCursorZoom = function( option ){
    return this.on('click.imageCursorZoom', function(){
      imageCursorZoom(this, option);
    });
  };

  /**
   * @param {ImgElement} elm
   * @param {Object} option
   */
  function imageCursorZoom( elm, option ){

    var opt = $.extend(true, {parent: 'BODY'/*,transition: 'transform 0.05s ease-out'*/}, option),
        $parent = $( typeof opt.parent == 'function' ? opt.parent.call(elm) : opt.parent ),
        $wrapper = $('<div/>'),
        $clone = $(elm).clone().css({width : 'auto', height : 'auto', transition : opt.transition}),
        parentWidth = 0,
        parentHeight = 0;

    ($parent[0] === $('BODY')[0] ? $(window) : $parent).on('resize', onResize).trigger('resize');

    $wrapper.on('mousemove.imageCursorZoom', onMousemove);

    $wrapper.css({
      overflow: 'hidden',
      position : 'absolute',
      left : 0,
      top : 0,
      background : 'white',
      width : '100%',
      height : '100%',
      'z-index' : 9999
    }).on('click', destroy).append($clone).appendTo($parent);

    /**
     * Tracking mouse pointer
     * @param {Event} event
     */
    function onMousemove( event ){

      var width = +$clone[0].clientWidth || $clone.width(),
          height = +$clone[0].clientHeight || $clone.height(),
          ratioX = (event.pageX / parentWidth) > 1 ? 1 : (event.pageX / parentWidth),
          ratioY = (event.pageY / parentHeight) > 1 ? 1 : (event.pageY / parentHeight),
          posX = -(width - parentWidth) * ratioX,
          posY = -(height - parentHeight) * ratioY;

      if( posX > 0 )
        posX = 0;

      if( posY > 0 )
        posY = 0;

      $clone.css('transform', 'translate(' + posX + 'px, ' + posY + 'px)');

    }

    /**
     * Get window width / height
     * @param {Event} event
     */
    function onResize( event ){

      parentWidth = +$(this).width();
      parentHeight = +$(this).height();

    }

    /**
     * Destroy all elements
     */
    function destroy(){
      $clone.remove();
      $wrapper.remove();
    }

  }

  /**
   * AMD(Asynchronous Module Definition)
   */
  define([], function(){ return imageCursorZoom; });

})(this, this.jQuery);
