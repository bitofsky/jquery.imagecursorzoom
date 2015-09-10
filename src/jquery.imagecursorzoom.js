/**
 * jquery.imageCursorZoom
 * jQuery Plugin
 *
 * @author bitofsky@neowiz.com 2015.09.10
 * @package
 * @subpackage
 * @encoding UTF-8
 * @version 1.0
 */

"use strict";

(function( window ){

  /**
   * AMD(Asynchronous Module Definition)
   * @param {jQuery} $
   */
  define(['jquery'], function( $ ){

    $.imageCursorZoom = imageCursorZoom;

    $.fn.imageCursorZoom = function(){
      return this.on('click.imageCursorZoom', function(){
        imageCursorZoom(this);
      });
    };

    return imageCursorZoom;

    /**
     * @param {ImgElement} elm
     * @param {Object} option
     */
    function imageCursorZoom( elm, option ){

      var opt = $.extend(true, {/*transition: 'transform 0.05s ease-out'*/}, option),
          $window = $(window).on('resize', onResize),
          $body = $('BODY'),
          $wrapper = $('<div/>'),
          $clone = $(elm).clone().css({width : 'auto', height : 'auto', transition : opt.transition}),
          windowWidth = 0,
          windowHeight = 0;

      $wrapper.css({
        position : 'absolute',
        left : 0,
        top : 0,
        background : 'white',
        width : '100%',
        height : '100%',
        'z-index' : 9999
      }).on('click', destroy).on('mousemove', onMousemove),
          $wrapper.append($clone).appendTo($body);

      onResize();

      /**
       * Tracking mouse pointer
       * @param {Event} event
       */
      function onMousemove( event ){

        var width = +$clone[0].clientWidth || $clone.width(),
            height = +$clone[0].clientHeight || $clone.height(),
            ratioX = event.pageX / windowWidth,
            ratioY = event.pageY / windowHeight,
            posX = -(width - windowWidth) * ratioX,
            posY = -(height - windowHeight) * ratioY;

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

        windowWidth = +$window.width();
        windowHeight = +$window.height();

      }

      /**
       * Destroy all elements
       */
      function destroy(){
        $clone.remove();
        $wrapper.remove();
      }

    }

  });

})(this);
