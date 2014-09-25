/* jQuery-crop v1.0.2, based on jWindowCrop v1.0.0
 * Copyright (c) 2012 Tyler Brown
 * Modified by Adrien Gibrat
 * IE6 support By Weilao
 * Licensed under the MIT license.
 */
(function ($, undefined) {
    var namespace = 'crop',
        plugin = function (image, options) {
            var self = this,
                img = new Image(),
                node = function (tag, classname) {
                    return $('<' + tag + '/>', { 'class': namespace + classname.charAt(0).toUpperCase() + classname.slice(1) });
                };

            // wrap image in frame;
            this.$image = $(image).wrap(node('div', 'frame'));

            this.options = $.extend({}, this.options, {
                width: this.$image.attr('width'),
                height: this.$image.attr('height'),
                style: this.$image.css([ 'display', 'left', 'top', 'width', 'height' ]),
                $handler: this.$image
            }, options);

            this.$frame = this.$image.parent();
            // IE6: No naturalWidth nor naturalHeight, so provide natural width and
            // height in options to ensure IE6 works fine
            this.$image.data('naturalWidth', options.naturalWidth);
            this.$image.data('naturalHeight', options.naturalHeight);

            this.$image
                .hide() // hide image until loaded
                .addClass(namespace + 'Image')
                .data(namespace, this);

            this.options.$handler
                .on('dragstart.' + namespace, function (event) {
                    // IE6: Once dragstart event triggered, mousemove not triggered anymore.
                    event.preventDefault();
                })
                .on('mousedown.' + namespace, function (event) {
                    event.preventDefault(); //some browsers do image dragging themselves
                    $(document)
                        .on('mousemove.' + namespace, {
                            mouse: {
                                x: event.pageX, y: event.pageY
                            }, image: {
                                x: parseInt(self.$image.css('left'), 10), y: parseInt(self.$image.css('top'), 10)
                            }
                        }, $.proxy(self.drag, self))
                        .on('mouseup.' + namespace, function () {
                            $(document).off('.' + namespace)
                        });
                })
                .on('load.' + namespace, function () {
                    if (img.naturalWidth === undefined) {
                        img.src = self.$image.attr('src'); // should not need to wait image load event as src is loaded
                        self.$image.prop('naturalWidth', self.$image.data('naturalWidth'));
                        self.$image.prop('naturalHeight', self.$image.data('naturalHeight'));
                    }

                    var width = self.$image.prop('naturalWidth'),
                        height = self.$image.prop('naturalHeight');

                    self.minPercent = Math.max(
                        width ? self.options.width / width : 1,
                        height ? self.options.height / height : 1
                    );

                    self.focal = {
                        x: Math.round(width / 2),
                        y: Math.round(height / 2)
                    };

                    self.zoom(self.minPercent);
                    //display image now that it is loaded
                    self.$image.fadeIn('fast');
                })
                .trigger('load.' + namespace); // init even if image is already loaded

            this.$frame
                .css({
                    width: this.options.width,
                    height: this.options.height
                })
                .append(node('span', 'loading').append(this.options.loading))
                .hover(function () {
                    self.$frame.toggleClass('hover');
                });

            if (this.options.controls !== false) {
                this.$frame.append(node('div', 'controls')
                        .append(node('span', 'text').append(this.options.controls))
                        .append(node('a', 'zoomIn').on('click.' + namespace, $.proxy(this.zoomIn, this)))
                        .append(node('a', 'zoomOut').on('click.' + namespace, $.proxy(this.zoomOut, this)))
                );
            }
        };

    $[namespace] = $.extend(plugin, {
        prototype: {
            percent: null,
            options: {
                width: 320,
                height: 180,
                zoom: 10,
                stretch: 1,
                loading: 'Loading...',
                controls: 'Click to drag'
            },

            zoom: function (percent) {
                this.percent = Math.max(
                    this.minPercent,
                    Math.min(this.options.stretch, percent)
                );

                this.$image.width(Math.ceil(this.$image.prop('naturalWidth') * this.percent));
                this.$image.height(Math.ceil(this.$image.prop('naturalHeight') * this.percent));

                this.$image.css({
                    left: plugin.fill(-Math.round(this.focal.x * this.percent - this.options.width / 2), this.$image.width(), this.options.width),
                    top: plugin.fill(-Math.round(this.focal.y * this.percent - this.options.height / 2), this.$image.height(), this.options.height)
                });

                this.update();
            },

            drag: function (event) {
                this.$image.css({
                    left: plugin.fill(event.data.image.x + event.pageX - event.data.mouse.x, this.$image.width(), this.options.width),
                    top: plugin.fill(event.data.image.y + event.pageY - event.data.mouse.y, this.$image.height(), this.options.height)
                });

                this.update();
            },

            zoomIn: function () {
                return !!this.zoom(this.percent + 1 / ( this.options.zoom - 1 || 1 ));
            },

            zoomOut: function () {
                return !!this.zoom(this.percent - 1 / ( this.options.zoom - 1 || 1 ));
            },

            update: function () {
                this.focal = {
                    x: Math.round(( this.options.width / 2 - parseInt(this.$image.css('left'), 10) ) / this.percent),
                    y: Math.round(( this.options.height / 2 - parseInt(this.$image.css('top'), 10) ) / this.percent)
                };
                this.$image.trigger($.Event('change.' + namespace, {
                    cropX: -Math.floor(parseInt(this.$image.css('left'), 10) / this.percent),
                    cropY: -Math.floor(parseInt(this.$image.css('top'), 10) / this.percent),
                    cropW: Math.round(this.options.width / this.percent),
                    cropH: Math.round(this.options.height / this.percent), stretch: this.percent > 1
                }));
            },

            destroy: function () {
                this.$image
                    .removeClass(namespace + 'Image')
                    .css(this.options.style)
                    .off('.' + namespace)
                    .removeData(namespace)
                    .siblings()
                    .unwrap()
                    .remove()
                ;
            }
        }
        // ensure that no gaps are between target's edges and container's edges
        , fill: function (value, target, container) {
            if (value + target < container)
                value = container - target;
            return value > 0 ? 0 : value;
        }
    });

    $.fn[ namespace ] = function (options) {
        return this.each(function () {
            new plugin(this, options);
        });
    };

})(jQuery);