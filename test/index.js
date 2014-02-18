var caroline = require('../lib/index.js');
var assert = require('assert');
var colors = require('../lib/colors.js');

describe('Caroline', function() {
  describe('foreground colors', function() {
    it('checks for foreground color methods', function() {
      Object.keys(colors.foreground).forEach(function(k) {
        assert.ok(k in caroline.color, 'Color ' + k + ' not found.');
        assert.equal(typeof caroline.color[k], 'function', 'Color ' + k + ' not function.');
      });
    });

    it('checks for style color methods', function() {
      Object.keys(colors.styles).forEach(function(k) {
        assert.ok(k in caroline.style, 'Style ' + k + ' not found.');
        assert.equal(typeof caroline.style[k], 'function', 'Style ' + k + ' not function.');
      });
    });

    it('checks for background color methods', function() {
      Object.keys(colors.background).forEach(function(k) {
        assert.ok(k in caroline.background, 'Background color ' + k + ' not found.');
        assert.equal(typeof caroline.background[k], 'function', 'Background color ' + k + ' not function.');
      });
    });

    it('tests logMessage', function() {
      var originalPrint = caroline._stdout;
      var originalLog = console.log;
      var output = [];
      caroline.hideTimestamps();
      caroline._stdout = function() {
        var args = [].slice.call(arguments, 0);
        output = output.concat(args);
      };

      console.log = function() {
        var args = [].slice.call(arguments, 0);
        output = output.concat(args);
      };

      caroline.info('test');
      assert.equal(output.join(''), '\u001b[44m\u001b[37mINFO\u001b[39m\u001b[49m \u001b[36mtest\u001b[39m\n', 'INFO output should be colored');

      output.length = 0;
      caroline.warn('test');
      assert.equal(output.join(''), '\u001b[42m\u001b[30mWARN\u001b[39m\u001b[49m \u001b[32mtest\u001b[39m\n', 'WARN output should be colored');

      output.length = 0;
      caroline.error('test');
      assert.equal(output.join(''), '\u001b[41m\u001b[37mERROR\u001b[39m\u001b[49m \u001b[31mtest\u001b[39m\n', 'ERROR output should be colored');

      output.length = 0;
      caroline.log('test');
      assert.equal(output.join(''), 'LOG test\n', 'LOG output is not colored');

      caroline.showTimestamps();
      caroline._stdout = originalPrint;
      console.log = originalLog;
    });

    it('tests logTimestamp', function() {
      var time = caroline.logTimestamp();
      assert.ok(/\d{2}\s\w{3}\s\d{2}:\d{2}:\d{2}/.test(time), 'Invalid date format.');

      caroline.hideTimestamps();
      time = caroline.logTimestamp();
      assert.equal(time, '', 'Timestamp should be hidden');
    });

    it('tests showPrefix', function() {
      var prefix = caroline.showPrefix('log', {});
      assert.equal(prefix, 'LOG ');

      caroline.hidePrefixes();
      prefix = caroline.showPrefix('log');
      assert.equal(prefix, '', 'Prefix should be hidden');
      caroline.showPrefixes();
    });

    it('tests enable switch', function() {
      var originalPrint = caroline._stdout;
      var output = '';
      caroline._stdout = function(msg) {
        output += msg;
      }

      caroline.disable();
      caroline.log('test');
      assert.equal(output, '');

      caroline.enable();
      caroline.log('test');
      assert.ok(output.indexOf('test') > -1, 'Test was not printed out.');
      caroline._stdout = originalPrint;
    });

    it('tests disableColors', function() {
      var originalPrint = caroline._stdout;
      var output = [];

      caroline._stdout = function() {
        var args = [].slice.call(arguments, 0);
        output = output.concat(args);
      }

      caroline.disableColors();
      caroline.hideTimestamps();

      caroline.info('test');
      assert.equal(output.join(''), 'INFO test\n', 'Output should not be colored');

      output.length = 0;
      caroline.enableColors();
      caroline.info('test');
      assert.equal(output.join(''), '\u001b[44m\u001b[37mINFO\u001b[39m\u001b[49m \u001b[36mtest\u001b[39m\n', 'Output should be colored');
      caroline._stdout = originalPrint;
    });

    it('tests print method', function() {
      var originalPrint = caroline._stdout;
      var output = [];

      caroline._stdout = function() {
        var args = [].slice.call(arguments, 0);
        output = output.concat(args);
      }

      caroline.print('test');
      assert.equal(output.join(''), 'test\n');
      output.length = 0;

      caroline.print('test', {
        color : 'white'
      });
      assert.equal(output.join(''), '\u001b[37mtest\u001b[39m\n');
      output.length = 0;

      caroline.print('test', {
        color : 'white',
        bold : true
      });
      assert.equal(output.join(''), '\u001b[1m\u001b[37mtest\u001b[39m\u001b[22m\n');
      output.length = 0;

      caroline.print('test', {
        color : 'white',
        italic : true
      });
      assert.equal(output.join(''), '\u001b[3m\u001b[37mtest\u001b[39m\u001b[23m\n');
      output.length = 0;

      caroline.print('test', {
        color : 'white',
        underline : true
      });
      assert.equal(output.join(''), '\u001b[4m\u001b[37mtest\u001b[39m\u001b[24m\n');
      output.length = 0;

      caroline.print('test', {
        color : 'white',
        background : 'yellow'
      });
      assert.equal(output.join(''), '\u001b[43m\u001b[37mtest\u001b[39m\u001b[49m\n');
      output.length = 0;

      assert.throws(function() {
        caroline.print('test', {
          color : 'white',
          background : 'yello'
        });
      });

      assert.throws(function() {
        caroline.print('test', {
          color : 'xx'
        });
      });

      caroline._stdout = originalPrint;
    });
  });
});
