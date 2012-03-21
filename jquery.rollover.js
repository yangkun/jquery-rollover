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
			defaultIndex = false;

		return this.each(function(index) {
			var $this = $(this);
			$.data(this, 'originSrc', $this.attr('src'));
			$.data(this, 'overSrc', $.fn.rollover.overs[opts.getOver]($this,opts));

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
				console.log('selected : ' + selected);
			}
		}
		function doOut() {
			if (selected !== false) {
				els.get(selected).src = $.data(els.get(selected),'originSrc');
				selected = false;
			}
		}
	};
	// default options
	$.fn.rollover.defaults = {
		getOver: 'replaceSuffix',
		suffix: '_r',
		selectedClass: 'selected',
		defaultClass: 'default',
		out: true,
		container: null
	};
	// get over image
	$.fn.rollover.overs = {
		replaceSuffix: function($img,opts) {
			return $img.attr('src').replace(/(\.[^\.]+)$/, opts.suffix + "$1");
		}
	};
})(jQuery);