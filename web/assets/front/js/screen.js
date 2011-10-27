(function($) {

    var Flipper = function(element) {
        var _element = $(element);
        var _this = this;
        var _left = _element.width();
        _this.init = function() {
            _element.hover(
                function(event) {
                    _element.find('img').animate({'left': '+=' + _left}, 'fast');
                    _element.find('span').show();
                },
                function(event) {
                    _element.find('img').animate({'left': '-=' + _left}, 'fast');
                    _element.find('span').hide();
                }
            );
        };
        _this.init();
    };

    /**
     * Namespace in jQuery
     */
    $.fn.Flipper = function() {
        return this.each(function() {
            new Flipper(this);
        });
    };

    // DOMREADY
    $(document).ready(function(event) {
        // Flip images on latest project for homepage
        $('.flipper').Flipper();
        // Remove title on latest project for homepage links
        $(".home .projects li a").attr('title', '');
    });

})(jQuery);