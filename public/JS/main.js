/* Intersection Observer */
function intersectionObs(callback, options, selector1) {
    const elem1 = document.querySelector(selector1);

    const intersectionObs = new IntersectionObserver(callback, options);

    intersectionObs.observe(elem1);
}

intersectionObs(
    function(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                document.querySelector('.menu').classList.add('scrolled');
            } else {
                document.querySelector('.menu').classList.remove('scrolled');
            }
        });
    },
    {
        rootMargin : '-90% 0px 0px 0px'
    },
    '#backimg'
);
