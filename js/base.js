/**
 * Created by Andrew on 10/22/2015.
 */
$(document).ready(function () {

    //Initial Theme Checker
    var themeCSSSheet = $('#theme-stylesheet'),
        themeSelect = $('#theme-options');
    $(themeCSSSheet).attr({href: $(themeSelect).find(":selected").val()});

    //
    //Sliding Menu JavaScript & JQuery
    //
    //Left Menu SlideOut Variables
    var navigationMenuHideDisplayTimer;
    var isNavigationMenuHidden = true;

    //Left Menu SlideOut Initialization
    $('.menu-action-link').bigSlide({
        menu: '.left-menu-panel',
        push: '.left-menu-slide-btn',
        side: 'left',
        easyClose: true,
        beforeOpen: function () {
            // Find All .nav-label
            var navLabels = $('.nav-label');
            // Add .nav-label-shadow
            navLabels.each(function () {
                $(this).fadeIn(50, function () {
                    if ($(this).hasClass('login'))
                        $(this).addClass('nav-label-light');
                    else if ($(this).hasClass('logout'))
                        $(this).addClass("nav-label-dark");
                    else
                        $(this).addClass("nav-label-primary");
                });
            })
        },
        afterOpen: function () {
            isNavigationMenuHidden = false;
        },
        beforeClose: function () {
            isNavigationMenuHidden = true;
        },
        afterClose: function () {
            // Find All .nav-label
            var navLabels = $('.nav-label');
            // Remove .nav-label-shadow
            navLabels.each(function () {
                $(this).fadeOut(350, function () {
                    if ($(this).hasClass('login'))
                        $(this).removeClass('nav-label-light');
                    else if ($(this).hasClass('logout'))
                        $(this).removeClass("nav-label-dark");
                    else
                        $(this).removeClass("nav-label-primary");
                });
            })
        }
    });

    //Show Menu on MouseOver of Hamburger Menu
    $('.left-menu-slide-btn').mouseover(function () {
        if (isNavigationMenuHidden) {
            $('.menu-action-link').trigger('click');
        }
    });


    //Begin Timer for Hiding Menu After MouseLeave Event
    $('.left-menu-panel').mouseleave(function () {
        navigationMenuHideDisplayTimer = setTimeout(function () {
            extendNavigationHideTimer();
        }, 3000);
    });

    //Extend Timeout for Hiding Menu if MouseOver
    function extendNavigationHideTimer() {
        if ($('.left-menu-panel').is(':hover') || $('.left-menu-slide-btn').is(':hover')) {
            setTimeout(extendNavigationHideTimer, 100);
        }
        else {
            clearTimeout(navigationMenuHideDisplayTimer);
            if (!isNavigationMenuHidden) {
                $('.menu-action-link').trigger('click');
                isNavigationMenuHidden = true;
            }
        }
    }


    //Nav Menu Items Indicate Hover
    var setNavigationLabelTimeout;
    $('.nav-label').hover(function () {
        var navLabel = $(this);
        setNavigationLabelTimeout = setTimeout(function () {
            $(navLabel).animate({padding: '15px 0 15px 0'}, 150)
        }, 100);
    }, function () {
        clearTimeout(setNavigationLabelTimeout);
        $(this).animate({padding: '6px 0 6px 0'}, 150);
    });

    //
    //Keep Navigation Menu Floating At All Times
    //
    $(function () {
        // Stick the #nav to the top of the window
        var nav = $('.left-menu-slide');
        var navHomeY = nav.offset().top;
        var isFixed = false;
        var $w = $(window);
        $w.scroll(function () {
            var scrollTop = $w.scrollTop();
            var shouldBeFixed = scrollTop > navHomeY;
            if (shouldBeFixed && !isFixed) {
                nav.css({
                    position: 'fixed',
                    top: 0,
                    left: nav.offset().left,
                    width: $(window).width()
                });
                isFixed = true;
            }
            else if (!shouldBeFixed && isFixed) {
                nav.css({
                    position: 'static'
                });
                isFixed = false;
            }
        });
        $w.resize(function () {
            nav.css({
                width: $(window).width()
            })
        })
    });
    //
    //
    //
    //
})
;