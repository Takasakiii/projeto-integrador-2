import bulmaCarousel from "bulma-carousel";

function initBulmaCarousel(ref) {
  bulmaCarousel.attach(ref.current, {
    slidesToScroll: 1,
    slidesToShow: 1,
  });
}

export default initBulmaCarousel;
