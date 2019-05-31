/*-----------------------------------
* Constants
*-----------------------------------*/

const gradeDistColors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800"];
const grades_cat = ["0-9%", "10-19%", "20-29%", "30-39%", "40-49%", "50-54%", "55-59%", "60-63%", "64-67%", "68-71%", "72-75%", "76-79%", "80-84%", "85-89%", "90-100%"];
 

/*-----------------------------------
* NAVBAR CLOSE ON CLICK
*-----------------------------------*/

$('.navbar-nav > li:not(.dropdown) > a').on('click', function() {
    $('.navbar-collapse').collapse('hide');
});

/*-----------------------------------
* ONE PAGE NAV - SMOOTH SCROLLING
*-----------------------------------*/

// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .on('click', function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 40
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });


function displayError(message) {
    // Show error
    $("#submit-text").after('<div class="alert alert-danger mt-3" id="error-msg"><strong>Error.</strong> ' + message + '</div>');
    // Fade the error after a second
    $("#error-msg").fadeTo(1000, 500).slideUp(500, function () {
        $("#error-msg").slideUp(1000);
        // Delete the HTML element after its hidden.
        $("#error-msg").remove();
    });
}