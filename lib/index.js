var util = require('util');
var colors = require('./colors.js');

function Caroline() {
  Object.keys(colors.styles).forEach(function(k) {
    var style = colors.styles[k];
    Caroline.prototype.style[k] = function Foreground(text) {
      if (!Caroline.SETTINGS.colors) {
        return text;
      }

      var output = [
        '\u001b[', style[0], 'm',
        text,
        '\u001b[', style[1], 'm'
      ];

      return output.join('');
    };
  });

  Object.keys(colors.foreground).forEach(function(k) {
    var color = colors.foreground[k];
    Caroline.prototype.color[k] =
    Caroline.prototype.c[k] = function Foreground(text) {
      if (!Caroline.SETTINGS.colors) {
        return text;
      }
      var output = [
        '\u001b[', color, 'm',
        text,
        '\u001b[39m'
      ];
      return output.join('');
    };

    var prefix = 'bright_'
    Caroline.prototype.color[prefix + k] =
    Caroline.prototype.c[prefix + k] = function Foreground(text) {
      if (!Caroline.SETTINGS.colors) {
        return text;
      }
      var output = [
        '\u001b[', color, ';1m',
        text,
        '\u001b[22;39m'
      ];

      return output.join('');
    };
  });

  Object.keys(colors.background).forEach(function(k) {
    var color = colors.background[k];
    Caroline.prototype.background[k] =
    Caroline.prototype.bg[k] = function Background(text) {
      if (!Caroline.SETTINGS.colors) {
        return text;
      }

      var output = [
        '\u001b[', color, 'm',
        text,
        '\u001b[49m'
      ];

      return output.join('');
    };
  });

}

Caroline.SETTINGS = {
  timestamps : true,
  prefix : true,
  enabled : true,
  colors : true
};

Caroline.LEVELS = ['EMERG', 'ALERT', 'CRITICAL', 'ERROR', 'WARN', 'NOTICE', 'INFO', 'LOG', 'DEBUG'];
Caroline.prototype.background = Caroline.prototype.bg = {};
Caroline.prototype.color = Caroline.prototype.c = {};
Caroline.prototype.style = {};

/**
 * Print the timestamp
 */
Caroline.prototype.logTimestamp = function logTimestamp() {
  if (Caroline.SETTINGS.timestamps) {
    return timestamp() + ' ';
  }
  return '';
};

/**
 * Print the timestamp
 */
Caroline.prototype.showPrefix = function showPrefix(severity, opts) {
  if (Caroline.SETTINGS.prefix) {
    severity = severity.toUpperCase();

    var textColor = opts.prefix || opts.text;
    var bgColor = opts.background && this.bg[opts.background] || false;
    var prefix = inArray(Caroline.LEVELS, severity) && severity || 'LOG';
    if (textColor) {
      prefix = this.color[textColor](prefix);

      if (bgColor) {
        prefix = bgColor(prefix);
      }
    }

    return prefix + ' ';
  }
  return '';
};

/**
 * Own version of util.print since console.log adds new lines
 */
Caroline.prototype._stdout = function(output) {
  process.stdout.write(String(output));
};

Caroline.prototype.print = function(text, opts) {
  var output = text;
  opts = opts || {};
  if (opts.color && typeof opts.color == 'string') {
    if (!this.color[opts.color]) {
      throw new Error('Unsupported text color: ' + opts.color);
    }
    output = this.color[opts.color](text);
  }

  if (opts.bold) {
    output = this.style.bold(output);
  }
  if (opts.italic) {
    output = this.style.italic(output);
  }
  if (opts.underline) {
    output = this.style.underline(output);
  }

  if (opts.background && typeof opts.background == 'string') {
    if (!this.bg[opts.background]) {
      throw new Error('Unsupported background color: ' + opts.background);
    }
    output = this.bg[opts.background](output);
  }

  this._stdout(output + '\n');
};

/**
 * Prints a standard log message
 * @param {String} type
 * @param {String} message
 * @param {Object} opts
 * @param {Array} args
 */
Caroline.prototype.logMessage = function(type, message, opts, args) {
  if (!Caroline.SETTINGS.enabled) {
    return;
  }

  message = opts.text ? this.color[opts.text](message) : message;
  var output = [
    this.showPrefix(type, opts),
    this.logTimestamp(),
    message
  ];

  this._stdout(output.join(''));

  if (args.length > 0) {
    var inlineArgs = [];
    args.forEach(function(item) {
      if (isObject(item) && Object.keys(item).length > 0) {
        if (inlineArgs.length) {
          this._stdout(' ');
          console.log.apply(console, inlineArgs);
          inlineArgs = [];
        }
        inspect(item);
      } else {
        inlineArgs.push(item);
      }
    }, this);
    if (inlineArgs.length) {
      this._stdout(' ');
      console.log.apply(console, inlineArgs);
    }
  } else {
    this._stdout('\n');
  }
};

/**
 * Prints a LOG message
 */
Caroline.prototype.log = function(message) {
  this.logMessage('log', message, {
    text : '',
    background : ''
  }, Array.prototype.slice.call(arguments, 1));
};

/**
 * Prints an INFO message
 */
Caroline.prototype.info = function(message) {
  this.logMessage('info', message, {
    text : 'cyan',
    prefix : 'white',
    background : 'blue'
  }, Array.prototype.slice.call(arguments, 1));
};

/**
 * Prints a WARN message
 */
Caroline.prototype.warn = function(message) {
  this.logMessage('warn', message, {
    text : 'green',
    prefix : 'black',
    background : 'green'
  }, Array.prototype.slice.call(arguments, 1));
};

/**
 * Prints an ERROR message
 */
Caroline.prototype.error = function(message) {
  this.logMessage('error', message, {
    text : 'red',
    prefix : 'white',
    background : 'red'
  }, Array.prototype.slice.call(arguments, 1));
};

/**
 * Disable logging completely
 */
Caroline.prototype.disable = function() {
  Caroline.SETTINGS.enabled = false;
};

/**
 * Disable the coloring of the output
 */
Caroline.prototype.disableColors = function() {
  Caroline.SETTINGS.colors = false;
};

/**
 * Disable the coloring of the output
 */
Caroline.prototype.enableColors = function() {
  Caroline.SETTINGS.colors = true;
};

/**
 * Enable logging
 */
Caroline.prototype.enable = function() {
  Caroline.SETTINGS.enabled = true;
};

/**
 * Disable timestamps
 */
Caroline.prototype.hideTimestamps = function() {
  Caroline.SETTINGS.timestamps = false;
};

/**
 * Disable timestamps
 */
Caroline.prototype.showTimestamps = function() {
  Caroline.SETTINGS.timestamps = true;
};

/**
 * Disable prefixes
 */
Caroline.prototype.hidePrefixes = function() {
  Caroline.SETTINGS.prefix = false;
};

/**
 * Disable prefixes
 */
Caroline.prototype.showPrefixes = function() {
  Caroline.SETTINGS.prefix = true;
};
////////////////////////////////////////////////
// Date formatting helpers
///////////////////////////////////////////////
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];

function getDate() {
  var now = new Date();
  return [now.toLocaleDateString(), now.toLocaleTimeString()].join(' ');
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

function isObject(item) {
  return Object.prototype.toString.call(item) === '[object Object]';
}

function isFunction(fn) {
  return typeof fn == 'function';
}

function inArray(arr, item) {
  return arr.indexOf(item) > -1;
}

/**
 * Print an object and its properties
 *
 * @param {Object} obj
 */
function inspect(obj) {
  console.log(util.inspect(obj, {
    showHidden : false,
    depth : 3,
    colors : Caroline.SETTINGS.colors
  }));
};

module.exports = new Caroline();