import jQuery from "jquery";
window.$ = window.jQuery = jQuery;
import "bootstrap";


(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  jQuery(document).ready(function($) {
    $("#sidebarToggle, #sidebarToggleTop").on('click', function() {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      
      if ($(".sidebar").hasClass("toggled")) {
        // Animar el ocultamiento del collapse en 350 ms
        $('.sidebar .collapse').slideToggle(100);
      } else {
        // Animar la expansión del collapse en 350 ms
        $('.sidebar .collapse').slideToggle(100);
      }
    });
  });
  
  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

  console.log("Bootstrap collapse:", typeof jQuery.fn.collapse); // Debe imprimir "function"
  console.log("jQuery version:", jQuery.fn.jquery); // Debe imprimir "3.7.1"  

})(jQuery); // End of use strict