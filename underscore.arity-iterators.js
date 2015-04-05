(function(_) {
  var mixin = {},
      slice = Function.prototype.call.bind(Array.prototype.slice);

  [
    'map',
    'each',
    'reduce',
    'reduceRight',
    'filter',
    'find',
    'reject',
    'every',
    'some',
    'sortBy',
    'groupBy',
    'indexBy',
    'countBy',
    'partition'
  ].forEach(function (baseFnName) {
    var offset = baseFnName.indexOf('reduce') === 0 ? 1 : 0,
        aliases = findAliases(baseFnName);
    [1, 2].forEach(function (arity) {
      arity += offset;
      var fn = wrapFn(_[baseFnName], 1, arity);
      aliases.forEach(function (alias) {
        mixin[alias + arity] = fn;
      });
    });
  });

  _.mixin(mixin);

  function wrapFn(fn, iterateePos, arity) {
    return function () {
      var args = slice(arguments),
          iteratee = args[iterateePos];
      args[iterateePos] = function () {
        return iteratee.apply(this, slice(arguments, 0, arity));
      };
      return fn.apply(_, args);
    };
  }

  function findAliases(fnName) {
    return Object.keys(_).filter(function (aliasName) {
      return _[aliasName] === _[fnName];
    });
  }
}.call(this, (typeof exports === 'object') ? (module.exports = require('underscore')) : _));

