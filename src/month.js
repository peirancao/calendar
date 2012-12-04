define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Templatable = require('templatable');
  var Overlay = require('overlay');
  var lang = require('i18n!lang') || {};
  var template = require('./month.tpl');

  var Month = Overlay.extend({
    Implements: [Templatable],
    attrs: {
      focus: moment(),
      range: null,
      template: template,
      model: {
        getter: function() {
          return createMonthModel(this.get('focus'), this.get('range'));
        }
      }
    },
    templateHelpers: {
      '_': function(key) {return lang[key] || key;}
    },
    initialize: function(config) {
      Month.superclass.initialize.call(this);
      var focus = moment(config.focus);
      this.set('focus', focus);
    }
  });

  module.exports = Month;

  // helpers
  var MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  function createMonthModel(time, range) {
    var month = time.month();
    var items = [];

    for (i = 0; i < MONTHS.length; i++) {
      items.push({
        value: i,
        available: isInRange(i, range),
        label: MONTHS[i]
      });
    }

    var current = {
      value: month,
      label: MONTHS[month]
    };

    // split [1, 2, .. 12] to [[1, 2, 3, 4], [5, ...]...]
    var list = [];
    for (var i = 0; i < items.length / 3; i++) {
      list.push(items.slice(i * 3, i * 3 + 3));
    }
    return {current: current, items: list};
  }

  function isInRange(month, range) {
    if (range == null) return true;
    if ($.isArray(range)) {
      var start = range[0];
      var end = range[1];
      var result = true;
      if (start) {
        result = result && month >= start;
      }
      if (end) {
        result = result && month <= end;
      }
      return result;
    }
    if ($.isFunction(range)) {
      return range(month);
    }
    return true;
  }
});
