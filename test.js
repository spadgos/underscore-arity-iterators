/*globals it, describe, before */
var _      = require('underscore'),
    expect = require('expect.js');

require('./underscore.arity-iterators');

describe('Underscore arity iterators', function () {
  var slice = Function.prototype.call.bind(Array.prototype.slice),
      numToWords = {
        0: 'zero',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five'
      };
  // aliases

  describe('give the right input and output of', function () {
    it('map1', function () {
      expect(_.map1(['1', '2', '3'], parseInt)).to.eql([1, 2, 3]);
    });

    it('map2', function () {
      expect(_.map2([1, 2, 3], addAllArgs)).to.eql([1, 3, 5]);
    });

    it('map1 with context', function () {
      expect(_.map1([1, 2, 3], function () {
        return this[addAllArgs.apply(null, arguments)];
      }, numToWords)).to.eql(['one', 'two', 'three']);
    });

    it('map2 with context', function () {
      expect(_.map2([1, 2, 3], function () {
        return this[addAllArgs.apply(null, arguments)];
      }, numToWords)).to.eql(['one', 'three', 'five']);
    });

    it('each1', function () {
      var callCount = 0;
      _.each1([1, 2, 3], function (n) {
        ++callCount;
        expect(n).to.be(callCount);
      });
    });

    it('each2', function () {
      var callCount = 0;
      _.each2([1, 2, 3], function (n, i) {
        expect(i).to.be(callCount);
        ++callCount;
        expect(n).to.be(callCount);
      });
    });

    it('reduce2', function () {
      expect(_.reduce2([1, 2, 3], addAllArgs, 0)).to.be(6);
    });

    it('reduce3', function () {
      expect(_.reduce3([1, 2, 3], addAllArgs, 10)).to.be(19); // 10 + (1 + 0) + (2 + 1) + (3 + 2)
    });

    it('reduceRight2', function () {
      var res = _.reduceRight2([1, 2, 3], function (arr) {
        arr.push.apply(arr, slice(arguments, 1));
        return arr;
      }, []);
      expect(res).to.eql([3, 2, 1]);
    });

    it('reduceRight3', function () {
      var res = _.reduceRight3([1, 2, 3], function (arr) {
        arr.push.apply(arr, slice(arguments, 1));
        return arr;
      }, []);
      expect(res).to.eql([3, 2, 2, 1, 1, 0]);
    });

    it('filter1', function () {
      expect(_.filter1(['hi', 'hey', '15', 'hum', '20'], parseInt)).to.eql(['15', '20']);
    });

    it('filter2', function () {
      expect(_.filter2([-2, -1, 0], addAllArgs)).to.eql([-2, 0]); // (-2 + 0), (-1 + 1), (0 + 2)
    });

    it('find1', function () {
      expect(_.find1(['hi', 'hey', '15', 'hum', '20'], parseInt)).to.be('15');
    });

    it('find2', function () {
      expect(_.find2([-2, -1, 0], addAllArgs)).to.be(-2);
    });

    // ^^ this is getting a bit repetitive and contrived

    it('partition1', function () {
      expect(_.partition1(['hi', 'hey', '15', 'hum', '20'], parseInt)).to.eql([['15', '20'], ['hi', 'hey', 'hum']]);
    });

    function addAllArgs() {
      return slice(arguments).reduce(function (memo, n) {
        return memo + n;
      });
    }
  });

  describe('applies the same changes for all aliases', function () {
    _.each({
      'forEach': 'each',
      'collect': 'map',
      'inject': 'reduce',
      'foldl': 'reduce',
      'select': 'filter',
      'detect': 'find'
    }, function (coreFnName, aliasName) {
      it(coreFnName + ' -> ' + aliasName, function () {
        expect(_[coreFnName + '2']).to.be(_[aliasName + '2']);
      });
    });
  });
  describe('chaining', function () {
    it('works', function () {
      var res = _.chain(['1', '2', '3'])
        .map1(parseInt)
        .filter2(function (val, ind) {
          return val + ind > 2;
        })
        .value();
      expect(res).to.eql([2, 3]);
    });
  });
});
