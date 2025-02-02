document.addEventListener("DOMContentLoaded", function () {
    if (typeof lottie !== "undefined") {
      var animation = lottie.loadAnimation({
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: false,      // Desactivar el loop para controlar mejor el estado de la animación
        autoplay: true,
        path: 'mail-icon.json'
      });

      document.getElementById('lottie').addEventListener('mouseenter', function() {
        animation.playSegments([50, 100], true);  // Transita entre los frames de la animación de "cerrar"
      });

      document.getElementById('lottie').addEventListener('mouseleave', function() {
        animation.playSegments([0, 50], true);  // Transita entre los frames de la animación de "hamburguesa"
      });
    } else {
      console.error("Lottie no está definido.");
    }
  });