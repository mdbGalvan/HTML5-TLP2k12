
/*
 *	Barley js
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */


var BARLEY = BARLEY || {};

BARLEY.View || (BARLEY.View = {});
BARLEY.Data || (BARLEY.Data = {});

/*
 *	BARLEY.App
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.App = (function(Barley) {

	var init = function(config){
		Barley.Init({});
	};

	return {
		init: init
    };

})(BARLEY);

/*
 *	BARLEY.Core
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.Core = (function(barley) {

	var bind = function(object, method) {
		return function() {
			return method.apply(object, toArray(arguments));
		};
	};

	var _isMobile = function(){
		var useragent = navigator.userAgent;
		useragent = useragent.toLowerCase();

		if (useragent.indexOf('iphone') != -1 ||
			useragent.indexOf('symbianos') != -1 ||
			useragent.indexOf('ipad') != -1 ||
			useragent.indexOf('ipod') != -1 ||
			useragent.indexOf('android') != -1 ||
			useragent.indexOf('blackberry') != -1 ||
			useragent.indexOf('samsung') != -1 ||
			useragent.indexOf('nokia') != -1 ||
			useragent.indexOf('windows ce') != -1 ||
			useragent.indexOf('sonyericsson') != -1 ||
			useragent.indexOf('webos') != -1 ||
			useragent.indexOf('wap') != -1 ||
			useragent.indexOf('motor') != -1 ||
			useragent.indexOf('symbian') != -1 ) {
			return true;
		}
		else
		{
				return false;
		}
	};

	var environment = function(){
		return {
			isMobile : _isMobile()
		};
	};

	return {
		bind : bind,
		environment : environment
	};

})(BARLEY);/*
 *	BARLEY.Event
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.Event = (function(barley) {

	var TIME = 0,
		MIN_SWIPE = 50,
		MIN_TIMEOUT = 200,
		_started = false,
		_startX = 0,
		_startY = 0,
		_startTime = 0,
		_endX = 0,
		_endY = 0,
		_endTime = 0;

	var _listenEvents = function(event, element, callback){
		var env = element || $(document);

		$(env).on('mousedown', function(e){_onTouchStart(e);});
		$(env).on('mousemove', function(){_onTouchMove(callback);});
		$(env).on('mouseup', function(e){_onTouchEnd(e, event, callback);});
	};

	var _onTouchStart = function(e){
		_started = true;
		_startX = e.clientX;
		_startY = e.clientY;
		_startTime = Date.now();
	};

	var _onTouchMove = function(){
		//TODO
	};

	var _onTouchEnd = function(e, event, callback){
		_endX = e.clientX;
		_endY = e.clientY;
		_endTime = Date.now();

		switch (event){
			case 'swipeRight':
				if (_startX < _endX && (_endX - _startX > MIN_SWIPE)){
					callback();
				}
				break;

			case 'swipeLeft':
				if (_startX > _endX && (_startX - _endX > MIN_SWIPE)){
					callback();
				}
				break;
		
			case 'longTap':
				if (_endTime - _startTime > MIN_TIMEOUT){
					callback();
				}
				break;
		}

		//Check event type
		_onTouchCancel();
	};

	var _onTouchCancel = function(){
		_startX = 0;
		_startY = 0;
		_startTime = 0;
		_endX = 0;
		_endY = 0;
		_endTime = 0;
	};


	var tap = function(element, callback){
		$(element).on('click', callback);
	};

	var doubleTap = function(element, callback){
		$(element).on('dblclick', callback);
	};

	
	var longTap = function(element, callback){
		_listenEvents('longTap', element, callback);
	};

	var swipeRight = function(element, callback){
		_listenEvents('swipeRight', element, callback);
	};

	var swipeLeft = function(element, callback){
		_listenEvents('swipeLeft', element, callback);
	};

	return {
		tap: tap,
		doubleTap: doubleTap,
		longTap: longTap,
		swipeRight: swipeRight,
		swipeLeft: swipeLeft
    };

})(BARLEY);/*
 *	BARLEY.Nav
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.Nav = (function(Barley) {

	/* Constants */
	var CURRENT_SECTION = 'displayed',
		CURRENT_ARTICLE = 'current',
		HIDE_CLASS = 'hide',
		SHOW_CLASS = 'show',
		ACTIVE_CLASS = 'active';

	var current = {
		section : null,
		article : null,
		aside : null
	};

	var _history = [];

	var go = function(name, target){

		//Remove active class
		$('.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);

		//Check if have aside open
		if (current.aside !== null && target != 'aside'){

			current.aside.addClass(HIDE_CLASS);
			current.section.removeClass('aside');
			current.aside =  null;
		}


		if (target == 'section' || target == 'article')
		{
			var targetSection = (target == 'section') ? $(name) :  $(name).closest('section'),
				targetArticle = (target == 'section') ? $(name + ' article').first() : $(name);

			current.section = $('.' + CURRENT_SECTION);
			current.article = $('.' + CURRENT_ARTICLE);

			if (current.section.attr('id') != targetSection.attr('id')){
				current.section.removeClass(CURRENT_SECTION).removeClass(SHOW_CLASS).addClass(HIDE_CLASS);
				targetSection.removeClass(HIDE_CLASS).addClass(CURRENT_SECTION).addClass(SHOW_CLASS);
			}

			if (current.article.attr('id') != targetArticle.attr('id')){
				current.article.removeClass(CURRENT_ARTICLE).removeClass(SHOW_CLASS).addClass(HIDE_CLASS);
				targetArticle.removeClass(HIDE_CLASS).addClass(CURRENT_ARTICLE).addClass(SHOW_CLASS);
			}

			//Add active class
			$('a[href="' + name + '"]').addClass(ACTIVE_CLASS);
		}
		else if (target == 'aside')
		{
			if (current.aside === null){
				current.section = $('.' + CURRENT_SECTION);
				current.aside = $(name);

				current.section.addClass('aside');
				current.aside.removeClass(HIDE_CLASS).show();
			}
			else{
				current.aside.addClass(HIDE_CLASS).hide();
				current.section.removeClass('aside');
				current.aside = null;
			}
		}
		

		Barley.View.Config.render($(name));
		_add(name, target);
		return false;
	};

	var back = function(){

		if (_history.length > 0){
			_history.pop(); /* Remove Current element */
			var backView = _history.pop(); /* Nav to last one */
			go(backView.name, backView.target);
		}
	};

	var _add = function(name, target){

		if (_history.length === 0 || _history[_history.length - 1].name != name)
		{
			_history.push({
				'name' : name,
				'target' : target
			});
		}
	};

	var initNavigation = function(element){

		var _target = typeof (element) != 'undefined' ? element + ' ' : '';

		// Navigation listeners
		$(_target + 'a[data-target="article"]').click( function(){
			var destination = $(this).attr('href');
			go(destination, 'article');
		});

		$(_target + 'a[data-target="section"]').click( function(){
			var destination = $(this).attr('href');
			go(destination, 'section');
		});

		$(_target + 'a[data-target="aside"]').click( function(){
			var destination = $(this).attr('href');
			go(destination, 'aside');
		});

		$(_target + 'aside a').click( function(){
			$('aside').addClass('hide');
		});
	};

	// Init functions
	var init = function(){
		$("section").first().addClass('displayed');
		$("section").first().find("article").first().addClass('current').show();
		this.initNavigation();
		//Config view
		Barley.View.Config.render($('section.displayed'));

		window.addEventListener("orientationchange", function(){
			Barley.View.Config.render($('section.displayed'));
		}, false);

		//Add first section to history
		_add( '#' + $("section").first().attr('id') ,'section');
	};

	return {
		init : init,
		initNavigation : initNavigation,
		go: go,
		back : back
    };

})(BARLEY);/*
 *	BARLEY.Init
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.Init = (function(Barley) {

	return function() {
		Barley.Nav.init();
	};

})(BARLEY);/*
 *	BARLEY.Data.Cache
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.Data.Cache = (function(barley) {

	var _isLocalStorageAvailable = function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	};

	var get = function(key){
		if (_isLocalStorageAvailable())
		{
			var data = null;
			try {
				data = JSON.parse( localStorage.getItem(key) );
			} catch (e){
				return false;
			}
			return data ? data : false;
		}
	};

	var set = function(key, data){
		if (_isLocalStorageAvailable())
		{
			localStorage.setItem(key, JSON.stringify(data));
		}
	};

	var refresh = function(key, data){
		if (_isLocalStorageAvailable())
		{
			remove(key);
			set(key,data);
		}
	};

	var remove = function(key){
		if (_isLocalStorageAvailable())
		{
			localStorage.removeItem(key);
		}
	};

	return {
		get: get,
		set: set,
		refresh : refresh,
		remove : remove
    };

})(BARLEY);/*
 *	BARLEY.View.List
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.View.List = (function(barley) {

	var append = function(config){
		var html = BARLEY.View.Template.render(config.template, config.data);
		$(config.element).append(html);

		barley.Nav.initNavigation(config.element);
	};

	return {
		append: append
    };

})(BARLEY);/*
 *	BARLEY.View.Scroll
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.View.Scroll = (function(Barley) {

	var _scrolls = [];


	var _isHorizontal = function(id){
		return $('#' + id).hasClass('horizontal') ? true : false;
	};

	var _isVertical = function(id){
		return $('#' + id).hasClass('vertical') ? true : false;
	};

	var _needScroll = function(id) {
		var scrollWidth = $("#" + id).width(),
			scrollHeight = $("#" + id).height();

		var clientWidth = $(document).width(),
			clientHeight = $(document).height() - $(".displayed header").height() - $(".displayed footer").height();

		var is_horizontal = _isHorizontal(id);

		if (is_horizontal)
		{
			return (clientWidth <= scrollWidth);
		}
		else
		{
			return true;
		}
	};

	var _navToFirst = function(id) {
		if (_scrolls[id]) {
			_scrolls[id].scrollTo(0, 0, 250);
		}
	};

	var _render = function(element, horizontal) {

		var scroll = $(element);
				
		//Get the element identifier
		var id = null;

		if (typeof scroll.attr('id') !== "undefined" && scroll.attr('id') !== "")
		{
			id =  idElement = scroll.attr('id');
		}
		else
		{
			idElement = 'scroll' + _scrolls.length;
			id = _scrolls.length;
			scroll.attr('id', idElement);
		}

		if (id !== null && _needScroll(id)){
			if (!_scrolls[id]){
				var properties = {
					desktopCompatibility:true,
					hScroll : horizontal,
					vScroll : !horizontal,
					useTransition: true,
					momentum: true,
					lockDirection: true,
					fixedScrollbar: true,
					fadeScrollbar: true,
					hideScrollbar: horizontal
				};
				_scrolls[id] = new iScroll(idElement, properties);
			}
			_navToFirst(id);
		}

	};

	var refresh = function(id){
		_render(id);
	};

	var start = function(element, horizontal){
		if (element)
		{
			_render(element, horizontal);
		}
		else
		{
			console.log('ERROR: Create scroll to: ' + $(element).attr('id'));
		}
	};

	
	return {
		start : start,
		refresh : refresh
	};

})(BARLEY);/*
 *	BARLEY.View.Template
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.View.Template = (function(barley) {

	var render = function(template, data){

		var element = _get(template);

		var itemHTML = element.html();

		for (var attr in data )
		{
			itemHTML = itemHTML.replace(new RegExp('{{' + attr + '}}', 'g'), data[attr]);
		}

		element.html(itemHTML);
		element.show().removeAttr('data-template');

		return element;
	};

	var _get = function(id){
		
		return $('*[data-template="' + id + '"]').clone();
	};

	return {
		render : render
	};

})(BARLEY);/*
 *	BARLEY.View.Notification
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

BARLEY.View.Notification = (function(Barley) {


	var _templates = {
		'alert' : '\
			<div class="alert" data-template="alertNotification" style="display:none">\
				<i class="{{icon}}"></i>\
				<span>{{msg}}</span>\
			</div>',

		'confirm' : '\
			<div class="confirm"data-template="confirmNotification" style="display:none">\
				<i class="{{icon}}"></i>\
				<span>{{msg}}</span>\
				<div class="buttons">\
					<div class="button cancel">Cancel</div>\
					<div class="button ok">Ok</div>\
				</div>\
			</div>',
		'actions' : '\
			<div class="actions" data-template="actionsNotification" style="display:none">\
				<div class="button cancel">Cancel</div>\
				<div class="button ok">Ok</div>\
				<div class="button">Other</div>\
			</div>'
	};


	var _alert = false,
		_confirm = false,
		_actions = false;

	var alert = function (msg, icon){
		if (!_alert)
		{
			$('section.displayed').append(_templates.alert);

			Barley.View.List.append({
				element: 'section.displayed',
				template: 'alertNotification',
				data: {
					msg : msg,
					icon : icon
				}
			});

			_alert = true;

			Barley.Event.tap(".alert", function(){
				Barley.View.Notification.close();
			});
		}
	};

	var confirm = function(msg, icon, success, cancel){

		if (!_confirm)
		{
			_confirm = true;

			$('section.displayed').append(_templates.confirm);

			Barley.View.List.append({
				element: 'section.displayed',
				template: 'confirmNotification',
				data: {
					msg : msg,
					icon : icon
				}
			});

			//Ok
			Barley.Event.tap(".ok", function(){
				success();
				Barley.View.Notification.close();
			});

			//Close
			Barley.Event.tap(".cancel", function(){
				if (typeof cancel == 'function'){
					cancel();
				}
				Barley.View.Notification.close();
			});
		}
	};

	var actions = function(){
		if (!_actions)
		{

			$('section.displayed').append(_templates.actions);

			Barley.View.List.append({
				element: 'section.displayed',
				template: 'actionsNotification',
				data: {}
			});


			//Close
			Barley.Event.tap(".actions .button", function(){
				Barley.View.Notification.close();
			});
		}
	};

	var close = function (){
		//alert
		_alert = false;
		$('.alert').remove();

		//Confirm
		_confirm = false;
		$('.confirm').remove();

		//Actions
		_actions = false;
		$('.actions').remove();
	};



	return {
		alert: alert,
		close : close,
		confirm : confirm,
		actions : actions
    };

})(BARLEY);/*
 *	BARLEY.View.Config
 *
 *	@author Adrian Vera || @adrianveracom
 *
 */

 BARLEY.View.Config = (function(Barley) {

	var _initScrolls = function(element){
		if (element.hasClass('.scrollable'))
		{
			Barley.View.Scroll.start(element.children(), element.hasClass('horizontal'));
		}
		else
		{
			// Init scrolls
			$.each(element.find('.scrollable'), function() {
				$(this).children().addClass('scrollableElement');
				Barley.View.Scroll.start($(this).children(), $(this).hasClass('horizontal'));
			});
		}
	};

	var _configView = function(element){
		var _marginFooter = ($(element).find('footer').height() !==  null) ? ($(element).find('footer').height() + 10) + 'px' : '10px';
		$('article.current').css( 'bottom', _marginFooter);
	};

	var render = function(element){
		_configView(element);
		_initScrolls(element);
	};

	return {
		render : render
    };

})(BARLEY);(function(){function o(a,b){var c;this.element="object"==typeof a?a:document.getElementById(a);this.wrapper=this.element.parentNode;this.element.style.webkitTransitionProperty="-webkit-transform";this.element.style.webkitTransitionTimingFunction="cubic-bezier(0,0,0.25,1)";this.element.style.webkitTransitionDuration="0";this.element.style.webkitTransform=i+"0,0"+j;this.options={bounce:e,momentum:e,checkDOMChanges:!0,topOnDOMChanges:!1,hScrollbar:e,vScrollbar:e,fadeScrollbar:p||!g,shrinkScrollbar:p||
!g,desktopCompatibility:!1,overflow:"auto",snap:!1,bounceLock:!1,scrollbarColor:"rgba(0,0,0,0.5)",onScrollEnd:function(){}};if("object"==typeof b)for(c in b)this.options[c]=b[c];this.options.desktopCompatibility&&(this.options.overflow="hidden");this.onScrollEnd=this.options.onScrollEnd;delete this.options.onScrollEnd;this.wrapper.style.overflow=this.options.overflow;this.refresh();window.addEventListener("onorientationchange"in window?"orientationchange":"resize",this,!1);if(g||this.options.desktopCompatibility)this.element.addEventListener(k,
this,!1),this.element.addEventListener(l,this,!1),this.element.addEventListener(m,this,!1);this.options.checkDOMChanges&&this.element.addEventListener("DOMSubtreeModified",this,!1)}function n(a,b,c,d,f){var h=document;this.dir=a;this.fade=c;this.shrink=d;this.uid=++q;this.bar=h.createElement("div");this.bar.style.cssText="position:absolute;top:0;left:0;-webkit-transition-timing-function:cubic-bezier(0,0,0.25,1);pointer-events:none;-webkit-transition-duration:0;-webkit-transition-delay:0;-webkit-transition-property:-webkit-transform;z-index:10;background:"+
f+";-webkit-transform:"+i+"0,0"+j+";"+("horizontal"==a?"-webkit-border-radius:3px 2px;min-width:6px;min-height:5px":"-webkit-border-radius:2px 3px;min-width:5px;min-height:6px");this.wrapper=h.createElement("div");this.wrapper.style.cssText="-webkit-mask:-webkit-canvas(scrollbar"+this.uid+this.dir+");position:absolute;z-index:10;pointer-events:none;overflow:hidden;opacity:0;-webkit-transition-duration:"+(c?"300ms":"0")+";-webkit-transition-delay:0;-webkit-transition-property:opacity;"+("horizontal"==
this.dir?"bottom:2px;left:2px;right:7px;height:5px":"top:2px;right:2px;bottom:7px;width:5px;");this.wrapper.appendChild(this.bar);b.appendChild(this.wrapper)}o.prototype={x:0,y:0,enabled:!0,handleEvent:function(a){switch(a.type){case k:this.touchStart(a);break;case l:this.touchMove(a);break;case m:this.touchEnd(a);break;case "webkitTransitionEnd":this.transitionEnd();break;case "orientationchange":case "resize":this.refresh();break;case "DOMSubtreeModified":this.onDOMModified(a)}},onDOMModified:function(a){var b=
this;a.target.parentNode==b.element&&(setTimeout(function(){b.refresh()},0),b.options.topOnDOMChanges&&(0!=b.x||0!=b.y)&&b.scrollTo(0,0,"0"))},refresh:function(){var a=this.x,b=this.y;this.scrollWidth=this.wrapper.clientWidth;this.scrollHeight=this.wrapper.clientHeight;this.scrollerWidth=this.element.offsetWidth;this.scrollerHeight=this.element.offsetHeight;this.maxScrollX=this.scrollWidth-this.scrollerWidth;this.maxScrollY=this.scrollHeight-this.scrollerHeight;this.directionY=this.directionX=0;this.scrollX&&
(0<=this.maxScrollX?a=0:this.x<this.maxScrollX&&(a=this.maxScrollX));this.scrollY&&(0<=this.maxScrollY?b=0:this.y<this.maxScrollY&&(b=this.maxScrollY));this.options.snap&&(this.maxPageX=-Math.floor(this.maxScrollX/this.scrollWidth),this.maxPageY=-Math.floor(this.maxScrollY/this.scrollHeight),b=this.snap(a,b),a=b.x,b=b.y);if(a!=this.x||b!=this.y)this.setTransitionTime("0"),this.setPosition(a,b,!0);this.scrollX=this.scrollerWidth>this.scrollWidth;this.scrollY=!this.options.bounceLock&&!this.scrollX||
this.scrollerHeight>this.scrollHeight;this.options.hScrollbar&&this.scrollX?(this.scrollBarX=this.scrollBarX||new n("horizontal",this.wrapper,this.options.fadeScrollbar,this.options.shrinkScrollbar,this.options.scrollbarColor),this.scrollBarX.init(this.scrollWidth,this.scrollerWidth)):this.scrollBarX&&(this.scrollBarX=this.scrollBarX.remove());this.options.vScrollbar&&this.scrollY&&this.scrollerHeight>this.scrollHeight?(this.scrollBarY=this.scrollBarY||new n("vertical",this.wrapper,this.options.fadeScrollbar,
this.options.shrinkScrollbar,this.options.scrollbarColor),this.scrollBarY.init(this.scrollHeight,this.scrollerHeight)):this.scrollBarY&&(this.scrollBarY=this.scrollBarY.remove())},setPosition:function(a,b,c){this.x=a;this.y=b;this.element.style.webkitTransform=i+this.x+"px,"+this.y+"px"+j;c||(this.scrollBarX&&this.scrollBarX.setPosition(this.x),this.scrollBarY&&this.scrollBarY.setPosition(this.y))},setTransitionTime:function(a){a=a||"0";this.element.style.webkitTransitionDuration=a;this.scrollBarX&&
(this.scrollBarX.bar.style.webkitTransitionDuration=a,this.scrollBarX.wrapper.style.webkitTransitionDuration=e&&this.options.fadeScrollbar?"300ms":"0");this.scrollBarY&&(this.scrollBarY.bar.style.webkitTransitionDuration=a,this.scrollBarY.wrapper.style.webkitTransitionDuration=e&&this.options.fadeScrollbar?"300ms":"0")},touchStart:function(a){var b;if(this.enabled){a.preventDefault();a.stopPropagation();this.scrolling=!0;this.moved=!1;this.distY=this.distX=0;this.setTransitionTime("0");if(this.options.momentum||
this.options.snap)if(b=new WebKitCSSMatrix(window.getComputedStyle(this.element).webkitTransform),b.e!=this.x||b.f!=this.y)document.removeEventListener("webkitTransitionEnd",this,!1),this.setPosition(b.e,b.f),this.moved=!0;this.touchStartX=g?a.changedTouches[0].pageX:a.pageX;this.scrollStartX=this.x;this.touchStartY=g?a.changedTouches[0].pageY:a.pageY;this.scrollStartY=this.y;this.scrollStartTime=a.timeStamp;this.directionY=this.directionX=0}},touchMove:function(a){if(this.scrolling){var b=g?a.changedTouches[0].pageX:
a.pageX,c=g?a.changedTouches[0].pageY:a.pageY,d=this.scrollX?b-this.touchStartX:0,f=this.scrollY?c-this.touchStartY:0,h=this.x+d,e=this.y+f;a.stopPropagation();this.touchStartX=b;this.touchStartY=c;if(0<=h||h<this.maxScrollX)h=this.options.bounce?Math.round(this.x+d/3):0<=h||0<=this.maxScrollX?0:this.maxScrollX;if(0<=e||e<this.maxScrollY)e=this.options.bounce?Math.round(this.y+f/3):0<=e||0<=this.maxScrollY?0:this.maxScrollY;5<this.distX+this.distY?(this.distX-3>this.distY?(e=this.y,f=0):this.distY-
3>this.distX&&(h=this.x,d=0),this.setPosition(h,e),this.moved=!0,this.directionX=0<d?-1:1,this.directionY=0<f?-1:1):(this.distX+=Math.abs(d),this.distY+=Math.abs(f))}},touchEnd:function(a){if(this.scrolling){var b=a.timeStamp-this.scrollStartTime,c=g?a.changedTouches[0]:a,d,f;d=0;f=this.x;var e=this.y;this.scrolling=!1;if(this.moved)!this.options.snap&&250<b?this.resetPosition():(this.options.momentum&&(a=!0===this.scrollX?this.momentum(this.x-this.scrollStartX,b,this.options.bounce?-this.x+this.scrollWidth/
5:-this.x,this.options.bounce?this.x+this.scrollerWidth-this.scrollWidth+this.scrollWidth/5:this.x+this.scrollerWidth-this.scrollWidth):{dist:0,time:0},c=!0===this.scrollY?this.momentum(this.y-this.scrollStartY,b,this.options.bounce?-this.y+this.scrollHeight/5:-this.y,this.options.bounce?(0>this.maxScrollY?this.y+this.scrollerHeight-this.scrollHeight:0)+this.scrollHeight/5:this.y+this.scrollerHeight-this.scrollHeight):{dist:0,time:0},d=Math.max(Math.max(a.time,c.time),1),f=this.x+a.dist,e=this.y+
c.dist),this.options.snap&&(a=this.snap(f,e),f=a.x,e=a.y,d=Math.max(a.time,d)),this.scrollTo(f,e,d+"ms"));else if(this.resetPosition(),g){for(d=c.target;1!=d.nodeType;)d=d.parentNode;f=document.createEvent("MouseEvents");f.initMouseEvent("click",!0,!0,a.view,1,c.screenX,c.screenY,c.clientX,c.clientY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,0,null);f._fake=!0;d.dispatchEvent(f)}}},transitionEnd:function(){document.removeEventListener("webkitTransitionEnd",this,!1);this.resetPosition()},resetPosition:function(){var a=
this.x,b=this.y;0<=this.x?a=0:this.x<this.maxScrollX&&(a=this.maxScrollX);0<=this.y||0<this.maxScrollY?b=0:this.y<this.maxScrollY&&(b=this.maxScrollY);a!=this.x||b!=this.y?this.scrollTo(a,b):(this.moved&&(this.onScrollEnd(),this.moved=!1),this.scrollBarX&&this.scrollBarX.hide(),this.scrollBarY&&this.scrollBarY.hide())},snap:function(a,b){var c,a=0<this.directionX?Math.floor(a/this.scrollWidth):0>this.directionX?Math.ceil(a/this.scrollWidth):Math.round(a/this.scrollWidth);this.pageX=-a;a*=this.scrollWidth;
0<a?a=this.pageX=0:a<this.maxScrollX&&(this.pageX=this.maxPageX,a=this.maxScrollX);b=0<this.directionY?Math.floor(b/this.scrollHeight):0>this.directionY?Math.ceil(b/this.scrollHeight):Math.round(b/this.scrollHeight);this.pageY=-b;b*=this.scrollHeight;0<b?b=this.pageY=0:b<this.maxScrollY&&(this.pageY=this.maxPageY,b=this.maxScrollY);c=Math.round(Math.max(500*(Math.abs(this.x-a)/this.scrollWidth),500*(Math.abs(this.y-b)/this.scrollHeight)));return{x:a,y:b,time:c}},scrollTo:function(a,b,c){this.x==a&&
this.y==b?this.resetPosition():(this.moved=!0,this.setTransitionTime(c||"350ms"),this.setPosition(a,b),"0"===c||"0s"==c||"0ms"==c?this.resetPosition():document.addEventListener("webkitTransitionEnd",this,!1))},scrollToPage:function(a,b,c){this.options.snap||(this.pageX=-Math.round(this.x/this.scrollWidth),this.pageY=-Math.round(this.y/this.scrollHeight));"next"==a?a=++this.pageX:"prev"==a&&(a=--this.pageX);"next"==b?b=++this.pageY:"prev"==b&&(b=--this.pageY);a=-a*this.scrollWidth;b=-b*this.scrollHeight;
b=this.snap(a,b);a=b.x;b=b.y;this.scrollTo(a,b,c||"500ms")},scrollToElement:function(a,b){if(a="object"==typeof a?a:this.element.querySelector(a)){var c=this.scrollX?-a.offsetLeft:0,d=this.scrollY?-a.offsetTop:0;0<=c?c=0:c<this.maxScrollX&&(c=this.maxScrollX);0<=d?d=0:d<this.maxScrollY&&(d=this.maxScrollY);this.scrollTo(c,d,b)}},momentum:function(a,b,c,d){var b=1E3*(Math.abs(a)/b),f=b*b/2.5/1E3,e=0;0<a&&f>c?(b=b*c/f/2.5,f=c):0>a&&f>d&&(b=b*d/f/2.5,f=d);e=b/1.2;return{dist:Math.round(f*(0>a?-1:1)),
time:Math.round(e)}},destroy:function(a){window.removeEventListener("onorientationchange"in window?"orientationchange":"resize",this,!1);this.element.removeEventListener(k,this,!1);this.element.removeEventListener(l,this,!1);this.element.removeEventListener(m,this,!1);document.removeEventListener("webkitTransitionEnd",this,!1);this.options.checkDOMChanges&&this.element.removeEventListener("DOMSubtreeModified",this,!1);this.scrollBarX&&(this.scrollBarX=this.scrollBarX.remove());this.scrollBarY&&(this.scrollBarY=
this.scrollBarY.remove());a&&this.wrapper.parentNode.removeChild(this.wrapper);return null}};n.prototype={init:function(a,b){var c=document,d=Math.PI;"horizontal"==this.dir?this.maxSize!=this.wrapper.offsetWidth&&(this.maxSize=this.wrapper.offsetWidth,c=c.getCSSCanvasContext("2d","scrollbar"+this.uid+this.dir,this.maxSize,5),c.fillStyle="rgb(0,0,0)",c.beginPath(),c.arc(2.5,2.5,2.5,d/2,-d/2,!1),c.lineTo(this.maxSize-2.5,0),c.arc(this.maxSize-2.5,2.5,2.5,-d/2,d/2,!1),c.closePath(),c.fill()):this.maxSize!=
this.wrapper.offsetHeight&&(this.maxSize=this.wrapper.offsetHeight,c=c.getCSSCanvasContext("2d","scrollbar"+this.uid+this.dir,5,this.maxSize),c.fillStyle="rgb(0,0,0)",c.beginPath(),c.arc(2.5,2.5,2.5,d,0,!1),c.lineTo(5,this.maxSize-2.5),c.arc(2.5,this.maxSize-2.5,2.5,0,d,!1),c.closePath(),c.fill());this.size=Math.max(Math.round(this.maxSize*this.maxSize/b),6);this.maxScroll=this.maxSize-this.size;this.toWrapperProp=this.maxScroll/(a-b);this.bar.style["horizontal"==this.dir?"width":"height"]=this.size+
"px"},setPosition:function(a){"1"!=this.wrapper.style.opacity&&this.show();a=Math.round(this.toWrapperProp*a);0>a?(a=this.shrink?a+3*a:0,7>this.size+a&&(a=-this.size+6)):a>this.maxScroll&&(a=this.shrink?a+3*(a-this.maxScroll):this.maxScroll,7>this.size+this.maxScroll-a&&(a=this.size+this.maxScroll-6));a="horizontal"==this.dir?i+a+"px,0"+j:i+"0,"+a+"px"+j;this.bar.style.webkitTransform=a},show:function(){e&&(this.wrapper.style.webkitTransitionDelay="0");this.wrapper.style.opacity="1"},hide:function(){e&&
(this.wrapper.style.webkitTransitionDelay="350ms");this.wrapper.style.opacity="0"},remove:function(){this.wrapper.parentNode.removeChild(this.wrapper);return null}};var e="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,p=/iphone|ipad/gi.test(navigator.appVersion),g="ontouchstart"in window,k=g?"touchstart":"mousedown",l=g?"touchmove":"mousemove",m=g?"touchend":"mouseup",i="translate"+(e?"3d(":"("),j=e?",0)":")",q=0;window.iScroll=o})();
