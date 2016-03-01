/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document,$,moment) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };
  app.onDataRouteClick = function(e) {
    $('paper-menu li.active').removeClass('active');
    $(e.target).parent().addClass('active');
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };
  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  app.expandTextarea = function($el){
    $el.attr('rows',5);
  };

  app.contractTextarea = function($el){
    $el.attr('rows',1);
  };

  app.momentToDate = function(momentObj){
    return momentObj.toDate();
  };
  app.compileDateTime = function(date,time,meridian,notToDate){
      var dt = moment(date+'T'+time+meridian, 'MM/DD/YThh:mmA');
      return (typeof notToDate !== 'undefined' && notToDate === false) ? dt : dt.toDate();
  };
  /*app.AWSdateTime = function(){
      return moment().format('YYYYMMDDTHHMMSSZ');
  };
  app.AWSdatestamp = function(){
      return moment().format('YMMDD');
  };*/
  app.formatRealISO = function(mom){
    var iso = mom.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
    return iso.replace('00','20');
  };
  app.compileTime = function(time,meridian){
    return moment(time+meridian, 'hh:mmA').toDate();
  };
  app.parseTime = function(time){
    return {
      "time"     : app.formatTime(time),
      "meridian" : app.formatMeridian(time)
    };
  };
  app.parseDateTime = function(datetime){
    return {
      "date"     :  app.formatDate(datetime),
      "time"     :  app.formatTime(datetime),
      "meridian" :  app.formatMeridian(datetime)
    };
  };
  app.formatTime = function(time){
    return moment(time).format('hh:mm');
  };
  app.formatMeridian = function(time){
    return moment(time).format('A');
  };
  app.formatDate = function(datetime){
    return moment(datetime).format('MM/DD/Y');
  };
  app.arrayCombine = function(names,values) {
    var result = {};
    for (var i = 0; i < names.length; i++){
      result[names[i]] = values[i];
    }
    return result;
  };
  app.areFieldsEmpty = function(fields){
    var empty = false;
    $.each(fields,function(k,field){
      if(field.indexOf('.com') === -1){
        field = (typeof field === 'object') ? Object.keys(field)[0] :field;
        var val = $(field).val();
        if(typeof val === 'undefined') val = field;
        if(val === '') return empty = true;
      }
    });
    return empty;
  };
  app.checkBuildFormData = function(names,fields){
    if(app.areFieldsEmpty(fields)) return false;
    console.log('not empty');
    return app.arrayCombine(names,fields);
  };
})(document,jQuery,moment);
