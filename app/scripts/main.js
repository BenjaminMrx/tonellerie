document.addEventListener('DOMContentLoaded', function() {

  var lastElementClicked;
  Barba.Pjax.init();
  Barba.Prefetch.init();

  Barba.Dispatcher.on('linkClicked', function(el) {
    lastElementClicked = $('.bg-'+$(el).data('class'));
  });
  Barba.Dispatcher.on('onEnterCompleted', function(el) {
    console.log('enter complete');
  });

  var Homepage = Barba.BaseView.extend({
    namespace: 'homepage',
    onEnter: function() {
      initMenuHome();
    },
    onEnterCompleted: function() {
      // The Transition has just finished.
      // Or Init scrollMe here
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
    },
    onLeaveCompleted: function() {
      // The Container has just been removed from the DOM.
    }
  });
  var Contact = Barba.BaseView.extend({
    namespace: 'contact',
    onEnter: function() {
      initMenu();
    },
    onEnterCompleted: function() {
      // The Transition has just finished.
      // Or Init scrollMe here
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
    },
    onLeaveCompleted: function() {
      // The Container has just been removed from the DOM.
    }
  });
  var Histoire = Barba.BaseView.extend({
    namespace: 'histoire',
    onEnter: function() {
      initMenu();
    },
    onEnterCompleted: function() {
      // The Transition has just finished.
      // Or Init scrollMe here
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
    },
    onLeaveCompleted: function() {
      // The Container has just been removed from the DOM.
    }
  });
  var Realisation = Barba.BaseView.extend({
    namespace: 'realisation',
    onEnter: function() {
      initMenu();
    },
    onEnterCompleted: function() {
      // The Transition has just finished.
      // Or Init scrollMe here
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
    },
    onLeaveCompleted: function() {
      // The Container has just been removed from the DOM.
    }
  });
  var Savoir = Barba.BaseView.extend({
    namespace: 'savoir',
    onEnter: function() {
      initMenu();
    },
    onEnterCompleted: function() {
      // The Transition has just finished.
      // Or Init scrollMe here
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
    },
    onLeaveCompleted: function() {
      // The Container has just been removed from the DOM.
    }
  });

  Homepage.init();
  Contact.init();
  Savoir.init();
  Realisation.init();
  Histoire.init();

  var FromHomeTransition = Barba.BaseTransition.extend({
    start: function() {
      this.originalThumb = lastElementClicked[0];

      Promise
        .all([this.newContainerLoading, this.enlargeThumb()])
        .then(this.showNewPage.bind(this));
    },

    enlargeThumb: function() {
      var deferred = Barba.Utils.deferred();
      var thumbPosition = this.originalThumb.getBoundingClientRect();

      this.cloneThumb = this.originalThumb.cloneNode(true);
      this.cloneThumb.style.position = 'absolute';
      this.cloneThumb.style.top = thumbPosition.top + 'px';

      this.oldContainer.appendChild(this.cloneThumb);

      let container = $(this.oldContainer).children();

      var _this = this;

      TweenLite.to(container.children('nav'), .4, {
        top: '0px',
      });

      TweenLite.to([container.children('nav'), container.children('.home-page-summary')], .4, {
        opacity:0,
      });
      TweenLite.to(_this.cloneThumb, .4, {
        top: 0,
        left: 0,
        width: '100%',
        delay: .4,
        ease: Power2.easeInOut,
      });
      TweenLite.to(_this.cloneThumb, 1, {
        height: '400px',
        delay: .6,
        ease: Power2.easeInOut,
        onComplete: function() {
          deferred.resolve();
          newPageInit();
        }
      });



      return deferred.promise;
    },

    showNewPage: function() {
      this.newContainer.style.visibility = 'visible';
      this.done();
    }
  });

  var MenuTransition = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */

      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.showNewPage.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      let container = $(this.oldContainer).children();

      // this.cloneThumb = this.originalThumb.cloneNode(true);
      // this.cloneThumb.style.position = 'absolute';
      // this.cloneThumb.style.top = thumbPosition.top + 'px';

      TweenLite.set(container.children('header'), {
        autoAlpha: 0,
      });
      TweenLite.set(container.children('.content-page'), {
        autoAlpha: 0,
      });
      TweenLite.to([$('nav ul'), $('.btn-menu')], .2, {
        autoAlpha: 0,
      });
      console.log($('nav span'));
      TweenLite.to($('nav span'), .8, {
        height: '0',
        ease: Power2.easeOut,
        onComplete: function() {
          console.log('fini');
          deferred.resolve();
        }
      });

      return deferred.promise;
    },


    showNewPage: function() {
      // this.newContainer.style.visibility = 'visible';
      let _this = this;
      $(window).scrollTop(0);
      $(this.oldContainer).hide();

      TweenLite.to(this.newContainer, .8, {
        autoAlpha: 1,
        onComplete: function() {
          _this.done();
          newPageInit();
        }
      })
    }
  });

  Barba.Pjax.getTransition = function() {
    var transitionObj = MenuTransition;

    if (Barba.HistoryManager.prevStatus().namespace === 'homepage') {
      transitionObj = FromHomeTransition;
    }

    return transitionObj;
  };

});


function initMenuHome(){

  $('.home .menu a').mouseenter(function () {
    if($(this).data('class')){
      var currentBg = $('.bg-'+$(this).data('class'));
      // TweenLite.set(currentBg , {css:{'z-index': 10}});
      // TweenLite.set(currentBg , {css:{autoAlpha: 1}});
      currentBg.attr('style', 'z-index:10; opacity : 1; visibility : visible;')
    }
  });

  $('.home .menu a').mouseleave(function () {
    if($(this).data('class')){
      var currentBg = $('.bg-'+$(this).data('class'));
      // TweenLite.set(currentBg , {css:{'z-index': 2}});
      // TweenLite.set(currentBg , {css:{autoAlpha: 0}});
      currentBg.attr('style', 'z-index:2; opacity : 0; visibility : hidden;')
    }
  });
}

function initMenu(){

  $('.btn-menu').on('click', function (e) {
    e.preventDefault();
    // console.log($('nav span'));
    if($('nav').hasClass('active')){
      TweenLite.to($('nav ul') , .2, {css:{autoAlpha: 0}});
      TweenLite.to($('nav span') , .5, {css:{width: '0%'}});
      TweenLite.to($('nav span') , .5, {
        width: '0%',
        ease: Power2.easeInOut,
        onComplete: function() {
          TweenLite.set($('nav') , {css:{autoAlpha: '0'}});
        }
      });
      // TweenLite.to($('nav ul') , .5, {css:{marginLeft: "-10px"}});
      $(this).removeClass('active');
      $('nav').removeClass('active');
    }else{
      TweenLite.set($('nav') , {css:{autoAlpha: '1'}});
      TweenLite.to($('nav span') , .5, {
        width: '50%',
        ease: Power2.easeInOut,
        onComplete: function() {
          TweenLite.to($('nav ul') , .5, {css:{autoAlpha: 1}});
        }
      });
      $(this).addClass('active');
      $('nav').addClass('active');
    }
  });
}

function newPageInit(){
  if($('.title')){
    // TweenLite.to($('.title'), 1, {
    //   autoAlpha : 1,
    // });
    TweenLite.to($('.title h1 span'), .4, {
      height : '100%',
      ease: Power2.easeInOut,
      onComplete: function () {
        $('.title h1').attr('style', 'text-shadow: 0 0 40px rgba(38, 35, 28, 0.8)');
        TweenLite.set($('.title h1 span'), {top: '0'});
        TweenLite.set($('.title h1'), {color: '#fff'});
      }
    });
    TweenLite.to($('.title h1 span'), .4, {
      height : '0%',
      delay: .4,
      ease: Power2.easeInOut,
    });
    TweenLite.to($('.btn-menu .line-1'), .4, {
      width: '50px',
      delay: 1,
      ease: Power4.easeOut,
    });
    TweenLite.to($('.btn-menu .line-2'), .4, {
      width: '50px',
      delay: 1.1,
      ease: Power4.easeOut,
    });
    TweenLite.to($('.btn-menu .line-3'), .4, {
      width: '50px',
      delay: 1.2,
      ease: Power4.easeOut,
    });
  }
}

function onScroll(){
  $(document).on('scroll', function () {
    let currentPosition = $(this).scrollTop() + $(window).height();
    $( '.decalage' ).each(function( index ) {
      let sectionPosition = $(this)[0].offsetTop;
      if( sectionPosition  < currentPosition - 200 ){
        TweenLite.to($(this), 1, {
          y: '0px',
          autoAlpha: 1,
          ease: Power4.easeOut,
        });
      }
    });

  });
}


$(document).ready(function () {

  initMenuHome();
  initMenu();
  newPageInit();
  onScroll();

  $(".slide img").on('click', function () {
    console.log('next');
    let current = $('.slide.current');
    let next;
    if(current.is(':last-child')){
      next = $('.slide:first-child');
    }else{
      next = $('.slide:eq('+ (current.index()+1) + ')');
    }
    let delay = .6;
    TweenLite.to(current.find('.overlay'), delay, {
      height: '100%',
      ease: Power4.easeOut,
      onComplete: function () {

        current.removeClass('current');
        next.addClass('current');
      }
    });
    TweenLite.set(current, {
      autoAlpha : 0,
      delay: delay
    });
    TweenLite.set(next, {
      autoAlpha : 1,
      delay: delay
    });
    TweenLite.to(next.find('.overlay'), delay, {
      height: '0%',
      ease: Power4.easeIn,
      delay: delay
    });
  });
});

