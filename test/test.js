'use strict';

var IdGenerator = require('../');
var assert = require('assert');

describe('IdGenerator', function () {

  describe('when initializing without any arguments', function () {

    var nameoromic;

    beforeEach(function () {
      nameoromic = new IdGenerator();
    });

    it ('should return a default name', function () {
      var expected = '001';
      var actual = nameoromic.next();
      assert.equal(actual, expected);
    });

    it ('should return default names in sequence', function () {
      var i;
      for (i = 1; i <= 10; i++) {
        var expected = (i===10) ? '010' : '00' + i;
        var actual = nameoromic.next();
        assert.equal(actual, expected);
      }
    });


    it ('should return proper names greater than 1000', function () {
      var i;
      for (i = 1; i <= 1010; i++) {
        var actual = nameoromic.next();
        if (i >= 1000) {
          var expected = String(i);
          assert.equal(actual, expected);
        }
      }
    });

  });

  describe('when initializing with default options and no generator', function () {

    var nameoromic;

    beforeEach(function () {
      nameoromic = new IdGenerator({digits: 5});
    });

    it ('should return a default name', function () {
      var expected = '00001';
      var actual = nameoromic.next();
      assert.equal(actual, expected);
    });

    it ('should return default names in sequence', function () {
      var i;
      for (i = 1; i <= 10; i++) {
        var expected = (i===10) ? '00010' : '0000' + i;
        var actual = nameoromic.next();
        assert.equal(actual, expected);
      }
    });


    it ('should return proper names greater than 100000', function () {
      var i;
      for (i = 1; i <= 100010; i++) {
        var actual = nameoromic.next();
        if (i >= 100000) {
          var expected = String(i);
          assert.equal(actual, expected);
        }
      }
    });

  });


  describe('when initializing with grouped options and no generator', function () {

    var nameoromic;

    beforeEach(function () {
      nameoromic = new IdGenerator();
      nameoromic.create('page', {
        digits: 5,
        prefix: 'Page-'
      });
    });

    it ('should return a default name', function () {
      var expected = '001';
      var actual = nameoromic.next();
      assert.equal(actual, expected);
    });

    it ('should return default names in sequence', function () {
      var i;
      for (i = 1; i <= 10; i++) {
        var expected = (i===10) ? '010' : '00' + i;
        var actual = nameoromic.next();
        assert.equal(actual, expected);
      }
    });

    it ('should return a page name', function () {
      var expected = 'Page-00001';
      var actual = nameoromic.next('page');
      assert.equal(actual, expected);
    });

    it ('should return page names in sequence', function () {
      var i;
      for (i = 1; i <= 10; i++) {
        var expected = 'Page-' + ((i===10) ? '00010' : '0000' + i);
        var actual = nameoromic.next('page');
        assert.equal(actual, expected);
      }
    });

    it ('should keep the correct counter for each group', function () {
      assert.equal(nameoromic.next(), '001');
      assert.equal(nameoromic.next('page'), 'Page-00001');
      assert.equal(nameoromic.next(), '002');
      assert.equal(nameoromic.next(), '003');
      assert.equal(nameoromic.next(), '004');
      assert.equal(nameoromic.next('page'), 'Page-00002');
      assert.equal(nameoromic.next('page'), 'Page-00003');
      assert.equal(nameoromic.next(), '005');
      assert.equal(nameoromic.next(), '006');
      assert.equal(nameoromic.next(), '007');
      assert.equal(nameoromic.next('page'), 'Page-00004');
    });

  });


  describe('when initializing a custom generator', function () {

    var nameoromic;

    beforeEach(function () {
      var generator = function (groupName, options) {
        options = options || {};
        return options['_id'] || options['name'];
      };
      nameoromic = new IdGenerator(generator);
    });

    describe('when no context is passed in', function () {
      it ('should return a default name', function () {
        var expected = '001';
        var actual = nameoromic.next();
        assert.equal(actual, expected);
      });
    });

    describe('when a context with an `_id` field is passed in', function () {
      it ('should return the name as the `_id` field', function () {
        var expected = 'my-id';
        var actual = nameoromic.next({'_id': 'my-id'});
        assert.equal(actual, expected);
      });
    });

    describe('when a context with an `name` field is passed in', function () {
      it ('should return the name as the `name` field', function () {
        var expected = 'my-name';
        var actual = nameoromic.next({'name': 'my-name'});
        assert.equal(actual, expected);
      });
    });

    describe('when a context without the proper fields is passed in', function () {
      it ('should return a default name', function () {
        var expected = '001';
        var actual = nameoromic.next({foo: 'bar', baz: 'bang'});
        assert.equal(actual, expected);
      });
    });

  });


  describe('when initializing a custom generator and options', function () {

    var nameoromic;

    beforeEach(function () {
      var options = {
        digits: 5,
        prefix: 'custom-'
      };
      var generator = function (groupName, options) {
        options = options || {};
        return options['_id'] || options['name'];
      };
      nameoromic = new IdGenerator(generator, options);
    });

    describe('when no context is passed in', function () {
      it ('should return a default name', function () {
        var expected = 'custom-00001';
        var actual = nameoromic.next();
        assert.equal(actual, expected);
      });
    });

    describe('when a context with an `_id` field is passed in', function () {
      it ('should return the name as the `_id` field', function () {
        var expected = 'my-id';
        var actual = nameoromic.next({'_id': 'my-id'});
        assert.equal(actual, expected);
      });
    });

    describe('when a context with an `name` field is passed in', function () {
      it ('should return the name as the `name` field', function () {
        var expected = 'my-name';
        var actual = nameoromic.next({'name': 'my-name'});
        assert.equal(actual, expected);
      });
    });

    describe('when a context without the proper fields is passed in', function () {
      it ('should return a default name', function () {
        var expected = 'custom-00001';
        var actual = nameoromic.next({foo: 'bar', baz: 'bang'});
        assert.equal(actual, expected);
      });
    });

  });



});

