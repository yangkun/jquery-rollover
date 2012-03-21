/**
 * A jQuery plugin for rollover images
 *
 * Version 1.0
 * 2012-03-22
 *
 * Copyright (c) 2006 Luke Lutman (http://www.lukelutman.com)
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-license.php

 * http://guny.kr
 */
;(function($) {
	$.fn.rollover = function(options) {

		var els = $(this),
			opts = $.extend(true, {}, $.fn.rollover.defaults, options || {}),
			selected = false,
			defaultIndex = false,
			layerMode = (opts.layers !== null);

		return this.each(function(index) {
			var $this = $(this);
			$.data(this, 'originSrc', $this.attr('src'));
			$.data(this, 'overSrc', $.fn.rollover.overs[opts.getOver]($this,opts));
			if (layerMode) {
				var $layer = $(opts.layers.get(index));
				$.data(this, 'layer', $layer);
				$layer.hide();
			}

			if ($this.hasClass(opts.selectedClass)) {
				doOver(index);
			}
			if ($this.hasClass(opts.defaultClass)) {
				doOver(index);
				defaultIndex = index;
				if (opts.container) {
					$(opts.container).mouseleave(function(e) {
						doOver(defaultIndex);
					});
				}
			}
			$this.mouseenter(function(e) {
				doOver(index);
			});
			if(opts.out) {
				$this.mouseleave(function(e) {
					doOut();
				});
			}
		});
		function doOver(i) {
			if(selected !== i) {
				doOut();
				var $img = $(els.get(i));
				$img.attr('src', $.data(els.get(i),'overSrc'));
				selected = i;
				if (layerMode) opts.layerOn($img, $.data(els.get(i), 'layer'),i);
			}
		}
		function doOut() {
			if (selected !== false) {
				els.get(selected).src = $.data(els.get(selected),'originSrc');
				if (layerMode)  opts.layerOff($(els.get(selected)), $.data(els.get(selected), 'layer'),selected);
				selected = false;
			}
		}
	};
	// default options
	$.fn.rollover.defaults = {
		getOver: 'addSuffix',
		addSuffix: '_r',
		replaceOff: '.',
		replaceOn: '_r.',
		fromClass: 'over',
		selectedClass: 'selected',
		defaultClass: 'default',
		out: true,
		container: null,
		layers: null,
		layerOn: function($img, $layer, index) {
			$layer.show();
		},
		layerOff: function($img, $layer, index) {
			$layer.hide();
		}
	};

	$.fn.rollover.overs = {
		// add suffix to original path's end
		addSuffix: function($img,opts) {
			return $img.attr('src').replace(/(\.[^\.]+)$/, opts.addSuffix + "$1");
		},
		replaceOn: function($img, opts) {
			return $img.attr('src').replace(opts.replaceOff, opts.replaceOn);
		},
		// inspired by Metadata (jquery.metadata.js)
		fromClass: function($img, opts) {
			var m = /({.*})/.exec($img[0].className);
			if(m) {
				var data = m[1];
				if(data.indexOf('{') < 0) data = '{' + data + '}';
				data = eval('(' + data + ')');
				return data[opts.fromClass];
			} else {
				console.log('specify class for over image path');
				return $img.attr('src');
			}
		}
	};
})(jQuery);