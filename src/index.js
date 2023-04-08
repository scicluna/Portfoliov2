import './styles.css'

$('.carousel').carousel({
    interval: 10000
  })

  document.addEventListener('DOMContentLoaded', function () {
    const modalTriggers = document.querySelectorAll('.custom-modal-trigger');
    modalTriggers.forEach((trigger, i) => {
        const modal = new bootstrap.Modal(document.getElementById(`modal${i + 1}`), {});

        trigger.addEventListener('click', function () {
            modal.show();
        });
    })
});



const tabs = document.querySelectorAll('.tab')
tabs.forEach(tab =>{
    tab.addEventListener('click', changeTab)
})

async function changeTab(e){
    const tab = e.target.dataset.reveal
    const activetab = document.querySelector('.activetab').dataset.reveal
    const currentPage = document.querySelector(`.${activetab}`)
    const newPage = document.querySelector(`.${tab}`)

    if(newPage === currentPage) return

    document.querySelector('.activetab').classList.remove('activetab')
    e.target.classList.add('activetab')

   // Slide-out animation for the current page
   anime({
    targets: currentPage,
    translateX: [-50, 0],
    opacity: [1, 0],
    easing: 'easeInOutQuart',
    duration: 500,
    complete: () => {
        currentPage.classList.add('hide');
        currentPage.style.transform = '';
        currentPage.style.opacity = '';
            // Slide-in animation for the new page
        newPage.style.transform = 'translateX(50px)';
        newPage.style.opacity = 0;
        newPage.classList.remove('hide');
        anime({
            targets: newPage,
            translateX: [50, 0],
            opacity: [0, 1],
            easing: 'easeInOutQuart',
            duration: 500,
        });
    }
    });
}

function fitElementToParent(el, padding) {
    var timeout = null;
    function resize() {
      if (timeout) clearTimeout(timeout);
      anime.set(el, {scale: 1});
      var pad = padding || 0;
      var parentEl = el.parentNode;
      var elOffsetWidth = el.offsetWidth - pad;
      var parentOffsetWidth = parentEl.offsetWidth;
      var ratio = parentOffsetWidth / elOffsetWidth;
      timeout = setTimeout(anime.set(el, {scale: ratio}), 10);
    }
    resize();
    window.addEventListener('resize', resize);
}
  
var advancedStaggeringAnimation = (function() {

  var staggerVisualizerEl = document.querySelector('.stagger-visualizer');
  var dotsWrapperEl = staggerVisualizerEl.querySelector('.dots-wrapper');
  var dotsFragment = document.createDocumentFragment();
  var grid = [20, 10];
  var cell = 55;
  var numberOfElements = grid[0] * grid[1];
  var animation;
  var paused = true;
  
  fitElementToParent(staggerVisualizerEl, 0);

  for (var i = 0; i < numberOfElements; i++) {
    var dotEl = document.createElement('div');
    dotEl.classList.add('dot');
    dotsFragment.appendChild(dotEl);
  }

  dotsWrapperEl.appendChild(dotsFragment);

  var index = anime.random(0, numberOfElements-1);
  var nextIndex = 0;

  anime.set('.stagger-visualizer .cursor', {
    translateX: anime.stagger(-cell, {grid: grid, from: index, axis: 'x'}),
    translateY: anime.stagger(-cell, {grid: grid, from: index, axis: 'y'}),
    translateZ: 0,
    scale: 1.5,
  });

  function play() {

    paused = false;
    if (animation) animation.pause();

    nextIndex = anime.random(0, numberOfElements-1);

    animation = anime.timeline({
      easing: 'easeInOutQuad',
      complete: play
    })
    .add({
      targets: '.stagger-visualizer .cursor',
      keyframes: [
        { scale: .75, duration: 120}, 
        { scale: 2.5, duration: 220},
        { scale: 1.5, duration: 450},
      ],
      duration: 300
    })
    .add({
      targets: '.stagger-visualizer .dot',
      keyframes: [
        {
          translateX: anime.stagger('-2px', {grid: grid, from: index, axis: 'x'}),
          translateY: anime.stagger('-2px', {grid: grid, from: index, axis: 'y'}),
          duration: 100
        }, {
          translateX: anime.stagger('4px', {grid: grid, from: index, axis: 'x'}),
          translateY: anime.stagger('4px', {grid: grid, from: index, axis: 'y'}),
          scale: anime.stagger([2.6, 1], {grid: grid, from: index}),
          duration: 225
        }, {
          translateX: 0,
          translateY: 0,
          scale: 1,
          duration: 1200,
        }
      ],
      delay: anime.stagger(80, {grid: grid, from: index})
    }, 30)
    .add({
      targets: '.stagger-visualizer .cursor',
      translateX: { value: anime.stagger(-cell, {grid: grid, from: nextIndex, axis: 'x'}) },
      translateY: { value: anime.stagger(-cell, {grid: grid, from: nextIndex, axis: 'y'}) },
      scale: 1.5,
      easing: 'cubicBezier(.075, .2, .165, 1)'
    }, '-=800')

    index = nextIndex;

  }

  play();

})();

  if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
