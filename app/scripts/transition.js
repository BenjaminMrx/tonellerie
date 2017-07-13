

document.addEventListener('DOMContentLoaded', function() {
  var lastElementClicked;
  Barba.Pjax.init();
  Barba.Prefetch.init();

  Barba.Dispatcher.on('linkClicked', function(el) {
    lastElementClicked = $('.bg-'+el.data('class'));
  });

  var ExpandTransition = Barba.BaseTransition.extend({
    start: function() {
      this.originalThumb = lastElementClicked;

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

      TweenLite.to(this.cloneThumb, 0.3, {
        top: 0,
        height: window.innerHeight,
        onComplete: function() {
          deferred.resolve();
        }
      });

      return deferred.promise;
    },

    showNewPage: function() {
      this.newContainer.style.visibility = 'visible';
      this.done();
    }
  });


  var ShrinkTransition = Barba.BaseTransition.extend({
    start: function() {
      this.newContainerLoading.then(this.shrinkImage.bind(this));
    },

    shrinkImage: function() {
      var _this = this;

      this.oldContainer.style.zIndex = '10';
      this.newContainer.style.visibility = 'visible';

      var href = Barba.HistoryManager.prevStatus().url.split('/').pop();
      var destThumb = this.newContainer.querySelector('a[href="' + href + '"]');
      var destThumbPosition = destThumb.getBoundingClientRect();
      var fullImage = this.oldContainer.querySelector('.full');

      TweenLite.to(this.oldContainer.querySelector('.back'), 0.2, { opacity: 0 });

      TweenLite.to(fullImage, 0.3, {
        top: destThumbPosition.top,
        height: destThumb.clientHeight,
        onComplete: function() {
          _this.done();
        }
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    var transitionObj = ExpandTransition;

    if (Barba.HistoryManager.prevStatus().namespace === 'detail') {
      transitionObj = ShrinkTransition;
    }

    return transitionObj;
  };

});





var Homepage = Barba.BaseView.extend({
  namespace: 'homepage',
  onEnter: function() {
    console.log('entré dans home');
  },
  onEnterCompleted: function() {
    // The Transition has just finished.
  },
  onLeave: function() {
    console.log('quitte  home');
  },
  onLeaveCompleted: function() {
    // The Container has just been removed from the DOM.
  }
});

// Don't forget to init the view!
Homepage.init();

var FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    /**
     * This function is automatically called as soon the Transition starts
     * this.newContainerLoading is a Promise for the loading of the new container
     * (Barba.js also comes with an handy Promise polyfill!)
     */

    // As soon the loading is finished and the old page is faded out, let's fade the new page
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    /**
     * this.oldContainer is the HTMLElement of the old Container
     */
    console.log(window.location.pathname);
    return $(this.oldContainer).animate({ opacity: 0 }).promise();
  },

  fadeIn: function() {
    /**
     * this.newContainer is the HTMLElement of the new Container
     * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
     * Please note, newContainer is available just after newContainerLoading is resolved!
     */

    var _this = this;
    var $el = $(this.newContainer);

    $(this.oldContainer).hide();

    $el.css({
      visibility : 'visible',
      opacity : 0
    });

    $el.animate({ opacity: 1 }, 400, function() {
      /**
       * Do not forget to call .done() as soon your transition is finished!
       * .done() will automatically remove from the DOM the old Container
       */

      _this.done();
    });
  }
});

/**
 * Next step, you have to tell Barba to use the new Transition
 */

Barba.Pjax.getTransition = function() {
  /**
   * Here you can use your own logic!
   * For example you can use different Transition based on the current page or link...
   */

  return FadeTransition;
};

Barba.Pjax.start();
