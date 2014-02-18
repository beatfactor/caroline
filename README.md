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


API Documentation
-----------------
__caroline.style__

* `bold(text)`
* `italic(text)`
* `underline(text)`

__caroline.color__

* `black(text)`
* `red(text)`
* `green(text)`
* `yellow(text)`
* `blue(text)`
* `magenta(text)`
* `cyan(text)`
* `white(text)`
* `gray(text)`

__caroline.background__

* `black(text)`
* `red(text)`
* `green(text)`
* `yellow(text)`
* `blue(text)`
* `magenta(text)`
* `cyan(text)`
* `white(text)`

__caroline.print(text, [options])__

```
var logger = require('caroline');
logger.print('Italic text', {
  italic : true
});

logger.print('Underline text', {
  underline : true
});

logger.print('Bold text', {
  bold : true
});
```

__Log messages__

* caroline.log('Log message', [arg1, args2 ...])
* caroline.info('Info message', [arg1, args2 ...])
* caroline.warn('Warn message', [arg1, args2 ...])
* caroline.error('Error message', [arg1, args2 ...])

__Convenience methods__ 
* caroline.enable()
* caroline.disable() - Enable/disable logging
* caroline.disableColors() - Disable the coloring of the output
* caroline.enableColors()
* caroline.hidePrefixes() - Don't show the LOG|INFO etc. prefix
* caroline.showPrefixes()
* caroline.hideTimestamps() - Don't display the timestamp
* caroline.showTimestamps()

Run the tests
-------------

    npm test
