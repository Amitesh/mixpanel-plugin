/**
 * A plugin to add Mixpanel tracking api calls with respective elements 
 * and also call the associated event
 *
 * @author : Amitesh Kumar
 * @documentation : Checkout at https://github.com/Amitesh/mixpanel-plugin
 * 
 * @usage :
 *
 * Add respective data attributes with elemets and it will call the 
 * approperiate Mixpanel api for it.
 *
 * Track page event
 * =================
 * <div data-mixp-event="event name" data-mixp-attrs='{"prop1": "val1", "prop2": "val1"}' ></div>
 * event name example : Page.home, Page.login
 *
 * Track user identity and add his/her profile
 * ===========================================
 * <div data-mixp-person-identity="user unique id" data-mixp-attrs='{"$first_name": "val1", "$last_name": "val1", "$email": "", "other":""}' ></div>
 * 
 * Check Mixpanel `mixpanel.person.set` documentation for more information about properties associated woith person.
 * 
 * Track link click
 * ================
 * It will also add the href as a property.
 * 
 * <a href="#" data-mixp-track-link="event name" data-mixp-attrs='{}'></a>
 * <a href="#" data-mixp-track-link="Click.login" data-mixp-attrs='{}'></a>
 *
 * Track form submit
 * ================
 * <form action="/payment" data-mixp-track-form="event name" data-mixp-attrs='{}'>...</form> 
 * 
 */

(function(window, $){

  if(typeof window.mixpanel === "undefined" || typeof window.mixpanel.track !== "function"){
    return;
  }

  var MixpanelPlugin = (function(){

    var prefix = 'mixp';
    var count = 0;

    return {
      init: function(){
        /**
         * List of types ot track with mixpanel
         *
         * - mixpanel.track       : Track event like page type
         * - mixpanel.track_links : Track the link click event
         * - mixpanel.track_forms : track the form submit event
         * - mixpanel.identify    : Set the user id to identify him
         * - mixpanel.person.set  : Set the user id to identify him
         *
         * To be implemented
         * - mixpanel.register    : Add properties to super properties so that mixpanel lib will send them with each event
         * - mixpanel.alias       : It should be called before signup
         */

        this.trackUserIdentity();
        this.trackEvent();
        this.trackLinkClick();
        this.trackFormSubmit();
        this.watch();
      },

      /**
       * If there is elements added dynamically then watch them and add the tracking to it
       * @return {[type]} [description]
       */
      watch: function(){
        var self = this;
        setTimeout(function(){
          self.init();
        }, 2000);
      },

      addTracked: function(elem){
        $(elem).data(prefix + '-tracked', true);
      },

      isTracked: function(elem){
        return $(elem).data(prefix + '-tracked');
      },

      isNotTrackedYet: function(elem){
        return !this.isTracked(elem);
      },

      trackUserIdentity: function(){
        var attName = prefix + '-person-identity';
        var person  = $('[data-' + attName + ']');

        if(person && this.isNotTrackedYet(person)){
          var identity = $(person).data(attName);

          if(identity){
            var personAttrs = this.getAttributes(person);
            
            window.mixpanel.identify(identity);
            window.mixpanel.people.set(personAttrs);

            // Keep it for further sending with events
            this.commonAttrs = personAttrs;
            this.addTracked(person);
          }
        }
      },

      trackEvent: function(){
        var elem      = $('[data-' + prefix + '-event]');
        var eventName = $(elem).data( prefix + '-event');

        if(this.isNotTrackedYet(elem) && eventName){
          var attrs = this.getAttributes(elem);
          window.mixpanel.track(eventName, attrs);
          this.addTracked(elem);
        }
      },

      trackLinkClick: function(){
        var links = $('[data-' + prefix + '-track-link]');

        var self = this;

        // Attach link tracking with each links which 
        // has 'data-mixp-track-link' attributes
        $.each(links, function(){

          var eventName = $(this).data( prefix + '-track-link');

          if(self.isNotTrackedYet(this) && eventName){
            var id    = prefix + '-track-link-id-' + count++;
            var attrs = self.getAttributes(this);
            
            $(this).data(id, eventName);
            $(this).addClass('data-' + id);
            attrs['url'] = $(this).attr('href');

            // track click for link
            window.mixpanel.track_links(".data-" + id, eventName, attrs);
            self.addTracked(this);
          }   
        });
      },
      
      trackFormSubmit: function(){
        var forms = $('[data-' + prefix + '-track-form]');

        var self = this;

        // Attach tracking with each form which 
        // has 'data-mixp-track-form' attributes
        $.each(forms, function(){

          var eventName = $(this).data( prefix + '-track-form');

          if(self.isNotTrackedYet(this) && eventName){
            var id    = prefix + '-track-form-id-' + count++;
            var attrs = self.getAttributes(this);
            
            $(this).data(id, eventName);
            $(this).addClass('data-' + id);
            attrs['url'] = $(this).attr('action');

            // track click for link
            window.mixpanel.track_forms(".data-" + id, eventName, attrs);
            self.addTracked(this);
          }   
        });
      },

      /**
       * A custom function to send evenets by calling it
       * as MixpanelPlugin.send(elem)
       * 
       * @return {[type]} [description]
       */
      send: function(elem){
        var eventName = $(elem).data( prefix + '-send');
  
        if(eventName){
          var attrs = this.getAttributes(elem);
          window.mixpanel.track(eventName, attrs);
        }
      },

      getAttributes: function(elem, attrName, isCommonAttrs){
        var attrs;

        isCommonAttrs = isCommonAttrs === 'undefined' ? true : isCommonAttrs;
        attrName      = attrName || prefix;

        if($(elem).size() > 0){
          attrs = $(elem).data( attrName + '-attrs');
          if(attrs && typeof attrs  == "string" ){
            attrs = jQuery.parseJSON(attrs);
          }
        }

        attrs = attrs || {};

        if(isCommonAttrs && this.commonAttrs && typeof this.commonAttrs  === 'object' ){
          attrs = $.extend({}, attrs, this.commonAttrs);
        }
        
        // Add tracking time with each attributes
        attrs = $.extend({}, attrs, this.getTimeStamp(), this.commonAttrs);
        return attrs;
      },

      getTimeStamp: function() {
        // Widdle the Date object to fit Mixpanel's format
        var raw = new Date(),
            date = raw.toISOString().split('.');
            date.pop();
            return {'Tracked time': date.join()}
      },
      
      //Its already tracked by mixpanel api no need to add explicitly
      getReferrer: function(){
        return {"referrer": document.referrer};
      }

    };
  })();

  //Starting plugin calls
  $(document).ready(function(){
    //Expose it to others also
    window.MixpanelPlugin = MixpanelPlugin;

    //Avoid to call init()
    //Let the page settle and then call tracking
    MixpanelPlugin.watch();
  });

}(window, $));



