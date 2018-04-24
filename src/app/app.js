/* jshint esversion: 6 */

// var $ = require("jquery");
// require('imports-loader?window.jQuery=jquery!./node_modules/path-to-slider-script.js');

console.log('app.js');

import $ from 'jquery';
import 'slick-carousel';
// import 'bootstrap';

$(document).ready(function () {
    console.log('Hello World!');
    $('.slider').slick();
});