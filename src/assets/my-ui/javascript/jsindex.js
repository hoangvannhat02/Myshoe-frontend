jQuery(document).ready(function ($) {
    $('.box-item').children('i').click(function () {
        $(this).toggleClass('rotate-icon');
        $(this).parent().parent().children('.dropdown-menu').toggleClass('show');
    })

    $(window).scroll(function () {
        const scrollTopPosition = $(this).scrollTop();
        if (scrollTopPosition >= 200) {
            $('.back-view-top').css({
                display: 'block'
            })
        } else {
            $('.back-view-top').css({
                display: 'none'
            })
        }
    })

    $('.back-view-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500)
    })

})