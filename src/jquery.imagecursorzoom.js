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
        overflowX = $parent[0].style.overflowX,
        overflowY = $parent[0].style.overflowY,
        position = $parent[0].style.position;

    try{ // IE Exception
      (isBody ? $(window) : $parent).on('resize', onResize).trigger('resize');
    }catch(e){
      opt.onerror( src );
      return;
    }

    if( !isBody )
      $parent.css('position', 'relative');

    $parent.css({
      'overflow-x': 'hidden',
      'overflow-y': 'hidden'
    });

    $wrapper
      .on('mousemove.imageCursorZoom', function( event ){
        moveImage(event.pageX, event.pageY);
      })
      .on('click.imageCursorZoom', destroy)
      .css({
        overflow: 'hidden',
        position : 'absolute',
        left : scrollLeft,
        top : scrollTop,
        background : 'white',
        width : '100%',
        height : '100%',
        'z-index' : 9999
      })
      .append( $clone )
      .appendTo( $parent );

    var clientWidth  = $clone[0].clientWidth || $clone.width(),
        clientHeight = $clone[0].clientHeight || $clone.height();

    moveImage(0, 0);

    /**
     * Tracking mouse pointer
     * @param {Number} mouseX
     * @param {Number} mouseY
     */
    function moveImage( mouseX, mouseY ){

      var posX = getPx(mouseX, scrollLeft, parentWidth, clientWidth),
          posY = getPx(mouseY, scrollTop, parentHeight, clientHeight);

      $clone.css('transform', 'translate(' + posX + 'px, ' + posY + 'px)');

    }

    /**
     * Cacl px
     * @param {type} pos
     * @param {type} scroll
     * @param {type} pSize
     * @param {type} cSize
     * @returns px
     */
    function getPx( pos, scroll, pSize, cSize ){

      var x, ratio, px;

      x = pos - scroll,
      ratio = (x / pSize) > 1 ? 1 : (x / pSize),
      ratio = ratio > 1 ? 1 : ratio;
      px = (pSize - cSize) * ratio,
      px = px > 0 ? 0 : px;
      px = cSize < pSize ? ((pSize - cSize) / 2) : px;

      return px;


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
      $parent[0].style.overflowX = overflowX;
      $parent[0].style.overflowY = overflowY;
      $parent[0].style.position = position;
    }

  }

  /**
   * AMD(Asynchronous Module Definition)
   */
  if( define && define.amd )
    define('imageCursorZoom', [], function(){ return imageCursorZoom; });

})(this, this.jQuery, this.define);
