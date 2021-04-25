import { select, classNames } from '../settings.js';

class Carousel {
  constructor() {
    const sliders = document.querySelectorAll(select.carousel.slider); //3 div class=slider
    console.log(sliders);
    const circles = document.querySelectorAll(select.carousel.circle); //3 div class=circle
    console.log(circles);
    let slideNumber = 0;
    setInterval(nextSlide, 3000);

    function nextSlide() {
      sliders[slideNumber].classList.remove(classNames.slider.active);
      circles[slideNumber].classList.remove(classNames.circle.active);

      slideNumber = (slideNumber + 1) % sliders.length; // 1/3=1 2/3=2 3/3=0
      console.log(slideNumber);

      sliders[slideNumber].classList.add(classNames.slider.active);
      circles[slideNumber].classList.add(classNames.circle.active);
    }
  }
}
export default Carousel;
