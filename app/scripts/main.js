(function () {
  'use strict';
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
  }
})();
$(document).ready(function () {
  function layout(){
      // 加载瀑布流
      let windowWidth=$(window).width()
      if(windowWidth<=576){
        $('.cards').css({"width":"488px"})
        $('.cards').masonry({
          // set itemSelector so .grid-sizer is not used in layout
          itemSelector: '.card',
          // use element for option
          columnWidth: '.card',
          percentPosition: true,
          gutter: 16,
          resize: false
        })
      }else if(windowWidth<=739){
        $('.cards').css({"width":"488px"})
        $('.cards').masonry({
          // set itemSelector so .grid-sizer is not used in layout
          itemSelector: '.card',
          // use element for option
          columnWidth: '.card',
          percentPosition: false,
          gutter: 16,
          resize: false
        })
      }else{
        $('.cards').css({"width":"100%"})
        $('.cards').masonry({
          // set itemSelector so .grid-sizer is not used in layout
          itemSelector: '.card',
          // use element for option
          columnWidth: 236,
          percentPosition: true,
          gutter: 16,
          resize: false
        })
      }
      //$('body').css("min-width",$(window).width()+"px")
  }
  layout()
  $(window).resize(function(){
    layout()
  })
});
