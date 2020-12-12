/* Intersection Observer */
function intersectionObs(callback, options, selector1) {
  const elem1 = document.querySelector(selector1);

  const intersectionObs = new IntersectionObserver(callback, options)

  intersectionObs.observe(elem1)
}

intersectionObs(function(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      $('.menu').addClass('scrolled');
    } else {
      $('.menu').removeClass('scrolled');
    }
  })
}, {
  rootMargin: "-90% 0px 0px 0px"
}, '#backimg')