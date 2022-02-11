/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
// ------------------------------------------
// Rellax.js - v1.0.0
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Rellax = factory();
  }
}(this, function () {
  var Rellax = function(el, options){
    "use strict";

    var self = Object.create(Rellax.prototype);

    var posY = 0; // set it to -1 so the animate function gets called at least once
    var screenY = 0;
    var blocks = [];
    var pause = false;

    // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event
    var loop = window.requestAnimationFrame ||
    	window.webkitRequestAnimationFrame ||
    	window.mozRequestAnimationFrame ||
    	window.msRequestAnimationFrame ||
    	window.oRequestAnimationFrame ||
    	function(callback){ setTimeout(callback, 1000 / 60); };

    // Default Settings
    self.options = {
      speed: -2,
      center: false
    };

    // User defined options (might have more in the future)
    if (options){
      Object.keys(options).forEach(function(key){
        self.options[key] = options[key];
      });
    }

    // If some clown tries to crank speed, limit them to +-10
    if (self.options.speed < -10) {
      self.options.speed = -10;
    } else if (self.options.speed > 10) {
      self.options.speed = 10;
    }

    // By default, rellax class
    if (!el) {
      el = '.rellax';
    }

    // Classes
    if (document.getElementsByClassName(el.replace('.',''))){
      self.elems = document.getElementsByClassName(el.replace('.',''));
    }

    // Now query selector
    else if (document.querySelector(el) !== false) {
      self.elems = querySelector(el);
    }

    // The elements don't exist
    else {
      throw new Error("The elements you're trying to select don't exist.");
    }


    // Let's kick this script off
    // Build array for cached element values
    // Bind scroll and resize to animate method
    var init = function() {
      screenY = window.innerHeight;
      setPosition();

      // Get and cache initial position of all elements
      for (var i = 0; i < self.elems.length; i++){
        var block = createBlock(self.elems[i]);
        blocks.push(block);
      }

			window.addEventListener('resize', function(){
			  animate();
			});

			// Start the loop
      update();

      // The loop does nothing if the scrollPosition did not change
      // so call animate to make sure every element has their transforms
      animate();
    };


    // We want to cache the parallax blocks'
    // values: base, top, height, speed
    // el: is dom object, return: el cache values
    var createBlock = function(el) {

      // initializing at scrollY = 0 (top of browser)
      // ensures elements are positioned based on HTML layout.
      //
      // If the element has the percentage attribute, the posY needs to be
      // the current scroll position's value, so that the elements are still positioned based on HTML layout
      var posY = el.getAttribute('data-rellax-percentage') || self.options.center ? document.body.scrollTop : 0;

      var blockTop = posY + el.getBoundingClientRect().top;
      var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

      // apparently parallax equation everyone uses
      var percentage = el.getAttribute('data-rellax-percentage') ? el.getAttribute('data-rellax-percentage') : (posY - blockTop + screenY) / (blockHeight + screenY);
      if(self.options.center){ percentage = 0.5; }

      // Optional individual block speed as data attr, otherwise global speed
      // Check if has percentage attr, and limit speed to 5, else limit it to 10
      var speed = el.getAttribute('data-rellax-speed') ? limitSpeed(el.getAttribute('data-rellax-speed'), 10) : self.options.speed;
      if (el.getAttribute('data-rellax-percentage') || self.options.center) {
        speed = el.getAttribute('data-rellax-speed') ? limitSpeed(el.getAttribute('data-rellax-speed'), 5) : limitSpeed(self.options.speed, 5);
      }

      var base = updatePosition(percentage, speed);

      // ~~Store non-translate3d transforms~~
      // Store inline styles and extract transforms
      var style = el.style.cssText;
      var transform = '';

      // Check if there's an inline styled transform
      if (style.indexOf('transform') >= 0) {
        // Get the index of the transform
        var index = style.indexOf('transform');

        // Trim the style to the transform point and get the following semi-colon index
        var trimmedStyle = style.slice(index);
        var delimiter = trimmedStyle.indexOf(';');

        // Remove "transform" string and save the attribute
        if (delimiter) {
          transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g,'');
        } else {
          transform = " " + trimmedStyle.slice(11).replace(/\s/g,'');
        }
      }

      return {
        base: base,
        top: blockTop,
        height: blockHeight,
        speed: speed,
        style: style,
        transform: transform
      };
    };

    // Check if current speed is < or > than max/-max
    // If so, return max
    var limitSpeed = function(current, max) {
      if (current < -max) {
        return -max;
      } else if (current > max) {
        return max;
      } else {
        return current;
      }
    };

    // set scroll position (posY)
    // side effect method is not ideal, but okay for now
    // returns true if the scroll changed, false if nothing happened
    var setPosition = function() {
    	var oldY = posY;

      if (window.pageYOffset !== undefined) {
        posY = window.pageYOffset;
      } else {
        posY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
      }

      if (oldY != posY) {
      	// scroll changed, return true
      	return true;
      }

      // scroll did not change
      return false;
    };


    // Ahh a pure function, gets new transform value
    // based on scrollPostion and speed
    var updatePosition = function(percentage, speed) {
      var value = (speed * (100 * (1 - percentage)));
      return Math.round(value);
    };


    //
		var update = function() {
			if (setPosition() && pause === false) {
				animate();
	    }

	    // loop again
	    loop(update);
		};

    // Transform3d on parallax element
    var animate = function() {
    	for (var i = 0; i < self.elems.length; i++){
        var percentage = ((posY - blocks[i].top + screenY) / (blocks[i].height + screenY));

        // Subtracting initialize value, so element stays in same spot as HTML
        var position = updatePosition(percentage, blocks[i].speed) - blocks[i].base;

        // Move that element
        // (Prepare the new transform and append initial inline transforms. Set the new, and preppend previous inline styles)
        var translate = ' translate3d(0,' + position + 'px' + ',0)' + blocks[i].transform;
        self.elems[i].style.cssText = blocks[i].style+'-webkit-transform:'+translate+';-moz-transform:'+translate+';transform:'+translate+';';
      }
    };


    self.destroy = function() {
      for (var i = 0; i < self.elems.length; i++){
        self.elems[i].style.cssText = blocks[i].style;
      }
      pause = true;
    };


    init();
    return self;
  };
  return Rellax;
}));


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
	"name": "radarseven",
	"version": "2.0.4",
	"description": "Website for mreiner.me",
	"main": "gulpfile.js",
	"author": "Michael Reiner, radarseven <mreiner77@gmail.com>",
	"copyright": "radarseven",
	"license": "UNLICENSED",
	"private": true,
	"paths": {
		"src": {
			"base": "./src/",
			"css": "./src/css/",
			"fontello": "./src/fontello/",
			"fonts": "./src/fonts/",
			"json": "./src/json/",
			"js": "./src/js/",
			"img": "./src/img/",
			"scss": "./src/scss/"
		},
		"dist": {
			"base": "./public/",
			"css": "./public/css/",
			"js": "./public/js/",
			"fonts": "./public/fonts/",
			"img": "./public/img/",
			"svg": "./public/svg"
		},
		"build": {
			"base": "./build/",
			"css": "./build/css/",
			"fontello": "./build/fonts/fontello/",
			"fonts": "./build/fonts/",
			"js": "./build/js/",
			"html": "./build/html/",
			"img": "./build/img/"
		},
		"favicon": {
			"src": "./src/img/favicon_src.png",
			"dest": "./public/img/site/",
			"path": "/img/site/"
		},
		"scss": [],
		"templates": "./templates/"
	},
	"urls": {
		"live": "https://mreiner.me/",
		"local": "https://mreiner.dev/",
		"critical": "https://mreiner.me/"
	},
	"vars": {
		"siteCssName": "site.combined.min.css",
		"scssName": "style.scss",
		"cssName": "style.css"
	},
	"globs": {
		"distCss": [
			"./node_modules/normalize.css/normalize.css",
			"./node_modules/flexboxgrid/dist/flexboxgrid.min.css",
			"./src/css/prism-theme.css",
			"./build/fonts/fontello/css/fontello-codes.css",
			"./build/css/*.css",
			"./src/css/*.css"
		],
		"img": [
			"./public/img/"
		],
		"components": [
			"./src/components/**/*.vue"
		],
		"fonts": [
			"./build/fonts/fontello/font/*.{eot,ttf,woff,woff2}",
			"./src/fonts/*.{eot,ttf,woff,woff2}"
		],
		"critical": [
			{
				"url": "",
				"template": "index"
			},
			{
				"url": "blog/stop-using-htaccess-files-no-really",
				"template": "blog/_entry"
			},
			{
				"url": "blog/stop-using-htaccess-files-no-really",
				"template": "blog/_amp_entry"
			},
			{
				"url": "blog",
				"template": "blog/index"
			},
			{
				"url": "blog",
				"template": "blog/amp_index"
			},
			{
				"url": "wordpress",
				"template": "wordpress"
			},
			{
				"url": "404",
				"template": "404"
			}
		],
		"distJs": [
			"./build/js/*.js",
			"./node_modules/lazysizes/lazysizes.min.js",
			"./node_modules/lazysizes/plugins/bgset/ls.bgset.min.js",
			"./node_modules/picturefill/dist/picturefill.min.js",
			"./node_modules/vue/dist/vue.min.js",
			"./node_modules/vue-resource/dist/vue-resource.min.js"
		],
		"prismJs": [
			"./node_modules/prismjs/prism.js",
			"./node_modules/prismjs/components/prism-markup.js",
			"./node_modules/prismjs/components/prism-apacheconf.js",
			"./node_modules/prismjs/components/prism-css.js",
			"./node_modules/prismjs/components/prism-json.js",
			"./node_modules/prismjs/components/prism-twig.js",
			"./node_modules/prismjs/components/prism-php.js",
			"./node_modules/prismjs/components/prism-bash.js",
			"./node_modules/prismjs/components/prism-javascript.js",
			"./node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js"
		],
		"systemJs": [
			"./node_modules/systemjs/dist/system-polyfills.js",
			"./node_modules/systemjs/dist/system.js",
			"./src/js/system-config.js"
		],
		"babelJs": [
			"./src/js/*.js"
		],
		"inlineJs": [
			"./node_modules/fg-loadcss/src/loadCSS.js",
			"./node_modules/fg-loadcss/src/cssrelpreload.js",
			"./node_modules/fontfaceobserver/fontfaceobserver.js",
			"./src/js/asyncload-blog-fonts.js",
			"./src/js/asyncload-site-fonts.js"
		],
		"siteIcon": "./public/img/site/favicon.*"
	},
	"dependencies": {
		"bourbon": "5.0.0-beta.7",
		"fg-loadcss": "^1.2.0",
		"flexboxgrid": "^6.3.1",
		"fontfaceobserver": "^2.0.5",
		"fitvids": "^2.0.0",
		"jquery": "^3.2.1",
		"lazysizes": "^3.0.0",
		"modernizr": "3.4.0",
		"modularized-normalize-scss": "^4.0.0",
		"bourbon-neat": "1.8.0",
		"normalize.css": "^5.0.0",
		"picturefill": "^3.0.2",
		"prismjs": "^1.5.1",
		"svg4everybody": "^2.1.7",
		"systemjs": "^0.19.40",
		"vue": "^2.1.0",
		"vue-resource": "^1.0.3"
	},
	"devDependencies": {
		"babel-cli": "^6.24.1",
		"babel-core": "^6.24.1",
		"babel-loader": "^7.0.0",
		"babel-plugin-transform-runtime": "^6.15.0",
		"babel-preset-es2015": "^6.16.0",
		"browser-sync": "^2.18.8",
		"chalk": "^1.1.3",
		"critical": "0.8.0",
		"del": "2.0.0",
		"fancy-log": "^1.2.0",
		"font-awesome": "^4.7.0",
		"git-rev-sync": "^1.7.1",
		"gulp": "^3.9.0",
		"gulp-autoprefixer": "^3.1.0",
		"gulp-babel": "^6.1.2",
		"gulp-changed": "1.3.0",
		"gulp-cheerio": "0.6.2",
		"gulp-concat": "^2.6.0",
		"gulp-cssnano": "^2.1.2",
		"gulp-debug": "^2.1.2",
		"gulp-favicons": "^2.2.6",
		"gulp-fontello": "^0.4.6",
		"gulp-header": "^1.8.7",
		"gulp-if": "^2.0.1",
		"gulp-imagemin": "^3.1.1",
		"gulp-include": "2.2.1",
		"gulp-insert": "0.5.0",
		"gulp-jshint": "^2.0.4",
		"gulp-load-plugins": "^1.3.0",
		"gulp-modernizr": "^1.0.0-alpha",
		"gulp-newer": "^1.2.0",
		"gulp-notify": "2.2.0",
		"gulp-plumber": "^1.1.0",
		"gulp-print": "^2.0.1",
		"gulp-rename": "^1.2.2",
		"gulp-replace": "0.5.4",
		"gulp-rev": "^7.1.0",
		"gulp-sass": "^2.1.0",
		"gulp-size": "^2.1.0",
		"gulp-sourcemaps": "^2.2.1",
		"gulp-svgmin": "1.2.2",
		"gulp-svgstore": "6.0.0",
		"gulp-uglify": "^1.5.4",
		"gulp-util": "^3.0.8",
		"gulp-watch": "4.3.8",
		"imagemin-pngcrush": "5.0.0",
		"jshint-stylish": "2.2.0",
		"moment": "^2.14.1",
		"rellax": "^1.0.0",
		"webpack": "^2.4.1",
		"webpack-stream": "^3.2.0"
	},
	"scripts": {
		"start": "gulp",
		"build": "gulp build"
	},
	"repository": {
		"type": "git",
		"url": "git@radarseven.com:mreiner.me.git"
	},
	"bugs": {
		"email": "mreiner77@gmail.com"
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Rellax = __webpack_require__(0);
var Package = __webpack_require__(1);

// Oh, Hello!
console.log('Hi. I come from webpack.');

// Rellax
new Rellax('.js-rellax', {
  center: false
});

// Vue
var vue = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  data: {
    pkg: Package
  }
});

/***/ })
/******/ ]);