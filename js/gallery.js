/**
 * Created by Andrew on 1/26/2016.
 */

$(document).ready(function () {

    // Recipe Sizing
    function checkSize() {
        //Variables
        var sizer = $('.grid-sizer');
        var grid = $('.isotope-grid');

        $(grid).children('.grid-item').each(function () {
            var width = parseInt($(this).find('img').get(0).naturalWidth);
            if (width < 200) {
                $(this).addClass('grid-item-5')
            } else if (width >= 200 && width < 300) {
                $(this).addClass('grid-item-4')
            } else if (width >= 300 && width < 500) {
                $(this).addClass('grid-item-3')
            } else if (width >= 500 && width < 1000) {
                $(this).addClass('grid-item-2')
            } else if (width >= 1000) {
                $(this).addClass('grid-item-1')
            } else {

            }
        });
    }

    // run test on resize of the window
    $(window).resize(checkSize);


    //After Window has Loaded
    $(window).load(function () {

        var grid = $('.isotope-grid');
        $(grid).imagesLoaded(function () {
            $(grid).isotope({
                itemSelector: '.grid-item',
                fitWidth: true,
                percentPosition: true,
                layoutMode: 'packery'
            });

            // run test on initial page load
            checkSize();

            // Shuffle Grid to remove staleness
            $(grid).isotope('shuffle');
        });

    });
});