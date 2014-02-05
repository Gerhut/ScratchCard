;(function() {
  var global = this;
  function ScratchCard(element, options, ownerDocument) {

    // apply default arguments.
    var defaultOptions = {
      'color': 'gray',
      'radius': 5
    };
    if (options) {
      for (var key in defaultOptions) {
        if (!(key in options)) {
          options[key] = defaultOptions[key];
        }
      }
    } else {
      options = defaultOptions;
    }
    ownerDocument = ownerDocument || global.document;
    
    // canvas validate.
    var canvas = document.createElement('canvas');
    if (typeof canvas.getContext != 'function')
      return console.log('Canvas not supported.');

    // apply canvas offset & size of element
    var rect = element.getBoundingClientRect();
    canvas.width = rect.width || rect.right - rect.left
    canvas.height = rect.height || rect.bottom - rect.top;
    canvas.style.top = rect.top + 'px';
    canvas.style.left = rect.left + 'px';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = +element.style.zIndex + 1;

    // fill the canvas
    var context = canvas.getContext('2d');
    context.fillStyle = options.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'transparent';
    context.globalCompositeOperation = "destination-in";

    // add mouse events to canvas
    // TODO: supply touch events
    canvas.addEventListener('mousedown', function (event) {
      if (event.button != 0) // not left button
        return;

      function scratch(event) {
        var x = event.offsetX || event.layerX;
        var y = event.offsetY || event.layerY;
        context.beginPath();
        context.arc(x, y, options.radius, 0, Math.PI *2);
        context.fill();
      }

      function onMousemove(event) {
        scratch(event);
      }

      function onMouseup(event) {
        canvas.removeEventListener('mousemove', onMousemove);
        canvas.removeEventListener('mouseup', onMouseup);
      }

      canvas.addEventListener('mousemove', onMousemove);
      canvas.addEventListener('mouseup', onMouseup);

      scratch(event);
    });

    // append canvas to body.
    document.body.appendChild(canvas);
  }

  if (typeof module == 'object' && module.exports) {
    // Node.js module
    module.exports = ScratchCard;
  } else if (typeof define == 'function' && (define.amd || define.cmd)) {
    // AMD or CMD module
    define(ScratchCard);
  } else if (typeof jQuery == 'function' && typeof jQuery.extend == 'function') {
    // jQuery plugin
    jQuery.fn.extend({
      'ScratchCard': function ($elements) {
        return $elements.each(ScratchCard);
      }
    });
  } else if (typeof angular == 'object' && typeof angular.module == 'function') {
    // AngularJS module
    // TODO: modify it to a directive.
    angular.module('ScratchCard', [])
      .value('ScratchCard', ScratchCard);
  } else {
    // Apply to a global variable.
    if (this.ScratchCard) {
      (function (oldScratchCard) {
        ScratchCard.noConflict = function () {
          this.ScratchCard = oldScratchCard;
          return ScratchCard;
        };
      }) (this.ScratchCard);
    }
    this.ScratchCard = ScratchCard;
  }
}).call(this);