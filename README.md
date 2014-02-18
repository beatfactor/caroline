caroline
========

A small terminal color library and logger for Node.js based on [ANSI escape codes](http://en.wikipedia.org/wiki/ANSI_escape_code#Colors).

Installation
------------

    npm install caroline
    
Example
-------
```js
var logger = require('caroline');
console.log(logger.bg.red(logger.color.cyan(logger.style.italic('Test'))));

logger.print('Text', {
  color : 'white',
  background : 'green',
  bold : true,
  italic : true
});
```

Run the tests
-------------

    npm test
