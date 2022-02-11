const Rellax = require('Rellax');
const Package = require('../../package.json');

// Oh, Hello!
console.log('Hi. I come from webpack.');

// Rellax
new Rellax('.js-rellax', {
  center: false
});

// Vue
const vue = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  data: {
    pkg: Package
  }
});
