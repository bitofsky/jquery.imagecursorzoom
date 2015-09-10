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

(function( window, $, define ){

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

    var opt = $.extend(true, {
          parent: 'BODY',
          src: function(){
            return this.src;
          },
          onerror: function(src){
            window.open(src);
          }
          //transition: 'transform 0.05s ease-out'
        }, option),
        src = typeof opt.src == 'function' ? opt.src.call(elm) : opt.src,
        $parent = $( typeof opt.parent == 'function' ? opt.parent.call(elm) : opt.parent ),
        $wrapper = $('<div/>'),
        $clone = $('<img/>').attr('src', src).css({width : 'auto', height : 'auto', transition : opt.transition}),
        parentWidth = 0,
        parentHeight = 0,
        isBody = $parent[0] === $('BODY')[0],
        scrollTop = isBody ? Math.max($('BODY').scrollTop(), $(window).scrollTop()) : $parent.scrollTop(),
        scrollLeft = isBody ? Math.max($('BODY').scrollLeft(), $(window).scrollLeft()) : $parent.scrollLeft(),
        originOverflowX = $parent.css('overflow-x'),
        originOverflowY = $parent.css('overflow-Y'),
        originPosition = $parent.css('position');

    try{ // IE Exception
      (isBody ? $(window) : $parent).on('resize', onResize).trigger('resize');
    }catch(e){
      opt.onerror( src );
      return;
    }

    if( !isBody )
      $parent.css({
        position: 'relative'
      });

    $parent.css({
      'overflow-x': 'hidden',
      'overflow-y': 'hidden'
    });

    $wrapper.on('mousemove.imageCursorZoom', onMousemove);

    $wrapper.css({
      overflow: 'hidden',
      position : 'absolute',
      left : scrollLeft,
      top : scrollTop,
      background : 'white',
      width : '100%',
      height : '100%',
      'z-index' : 9999
    }).on('click', destroy).append( $clone ).appendTo( $parent );

    var clientWidth  = $clone[0].clientWidth || $clone.width(),
        clientHeight = $clone[0].clientHeight || $clone.height();

    /**
     * Tracking mouse pointer
     * @param {Event} event
     */
    function onMousemove( event ){

      var ratioX = (event.pageX / parentWidth) > 1 ? 1 : (event.pageX / parentWidth),
          ratioY = (event.pageY / parentHeight) > 1 ? 1 : (event.pageY / parentHeight),
          posX = -(clientWidth - parentWidth) * ratioX,
          posY = -(clientHeight - parentHeight) * ratioY;

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
      $parent.css({
        position: originPosition,
        'overflow-x': originOverflowX,
        'overflow-y': originOverflowY
      });
    }

  }

  /**
   * AMD(Asynchronous Module Definition)
   */
  if( define && define.amd )
    define('imageCursorZoom', [], function(){ return imageCursorZoom; });

})(this, this.jQuery, this.define);
