(function ($) {
    /**
     * Flipper class constructor
     *
     * @param DOMElement element
     */
    var Flipper = function (element) {
        var _element = $(element);
        var _this = this;
        var _left = _element.width();
        /**
         * Flipper init
         *
         */
        _this.init = function () {
            _element.hover(
                function (event) {
                    _element.find('img').animate({'left':'+=' + _left}, 200);
                },
                function (event) {
                    _element.find('img').animate({'left':'-=' + _left}, 200);
                }
            );
        };
        /* INIT */
        _this.init();
    };
    /**
     * Namespace Flipper in jQuery
     */
    $.fn.flipper = function () {
        return this.each(function () {
            new Flipper(this);
        });
    };
    /**
     * Navigation class constructor
     *
     * @param DOMElement element
     */
    var Navigation = function (element) {
        var _element = $(element);
        var _this = this;
        var _handle;
        var _move;
        /**
         * Move the handle to the specified element
         *
         * @param DOMElement element
         * @param int speed
         */
        _this.moveTo = function (element, speed) {
            var activeOffset = $(element).position().left;
            var handleOffset = activeOffset + (element.outerWidth() / 2) - 5;
            _handle.animate({'left':handleOffset}, speed);
        };
        /**
         * Move the handle to the active element
         *
         * @param int speed
         */
        _this.moveToActive = function (speed) {
            var activeElement = _element.find('.active');
            if (activeElement.length > 0) {
                _this.moveTo(activeElement, speed);
            }
        };
        /**
         * Follow (on mouseenter)
         *
         * @param DOMEvent event
         */
        _this.follow = function (event) {
            window.clearTimeout(_move);
            var element = $(this);
            _move = window.setTimeout(function () {
                _this.moveTo(element, 200);
            }, 300);
        };
        /**
         * Go back to active (on mouseleave)
         *
         * @param DOMEvent event
         */
        _this.gohome = function (event) {
            window.clearTimeout(_move);
            _move = window.setTimeout(function () {
                _this.moveToActive(200);
            }, 300);

        };
        /**
         * Navigation init
         *
         */
        _this.init = function () {
            _handle = $('<span>').addClass('handle').hide();
            _element.append(_handle);
            _this.moveToActive(0)
            _handle.show();
            _element.find('a').hover(_this.follow, _this.gohome);
            _element.find('a').click(function (event) {
                $(this).unbind('hover');
            });
        };
        /* INIT */
        _this.init();
    };

    $.fn.navigation = function (element) {
        return this.each(function () {
            new Navigation(this);
        });
    };

    var TwitterFeed = function (element) {
        var _this = this;
        var _element = $(element);
        var max_elements = 4;
        $('li', _element).each(function (offset, element) {
            if (offset >= max_elements) {
                $(element).hide();
            }
        });
        setInterval(function () {
            var first_child = $('li:first-child', _element);
            var siblings = first_child.siblings();
            first_child.slideUp(1000);
            $(siblings[max_elements - 1]).fadeIn(1000, function () {
                _element.append(first_child);
                first_child.hide();
            });

        }, 5000);


    };
    $.fn.twitterFeed = function () {
        return this.each(function () {
            new TwitterFeed(this);
        });
    };

    var CommentForm = function (element) {
        var _this = this;
        var _element = $(element);
        var _container = _element.parents('.comments-container');

        /**
         * CommentForm init
         */
        _this.init = function () {
            _element.submit(function () {
                $.post(_element.attr('action'), _element.serialize(), function (data, response, xhr) {
                    var html = $(data);
                    _container.replaceWith(html);
                    $('form', html).commentForm();
                });

                return false;
            });
        };
        /* INIT */
        _this.init();
    };
    $.fn.commentForm = function () {
        return this.each(function () {
            new CommentForm(this);
        });
    };

    /* DOMREADY */
    $(document).ready(function (event) {
        // Flip images on latest project for homepage
        $('.flipper').flipper();
        // Remove title on latest project for homepage links
        $(".home .projects li a").attr('title', '');
        $('header nav').navigation();
        $('section.tweets ul').twitterFeed();
        $('.comments form').commentForm();
        // Observer external links
        $('a[rel*=external]').click(function (event) {
            event.preventDefault();
            window.open(this.href);
        });
    });
})(jQuery);