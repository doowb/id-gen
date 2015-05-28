'use strict';

/**
 * Create a new IdGenerator passing in an optional generator
 * function that does the actual work.
 *
 * @param {Function} `generator` Optional generator function used to generate new IDs
 * @api public
 * @name  IdGenerator
 */

function IdGenerator (generator) {
  if (!(this instanceof IdGenerator)) {
    return new IdGenerator(generator);
  }
  if (typeof generator !== 'function') {
    generator = defaultGenerator;
  }
  this.generator = generator.bind(this);
  this.groups = {};
}

/**
 * Create a new group to segment IDs
 *
 * @param  {String} `groupName` Name of the group to create.
 * @param  {Object} `options` Additional options to define how the IDs are generated.
 *   @option `digits` [options] Number of digits used when padding the generated ID
 *   @option `auto`   [options] Max number used to calculate length of digits used when padding generated ID
 *   @option `prefix` [options] string prefix used to add to the generated ID
 * @return {Object} `this` to enable chaining
 * @api public
 */

IdGenerator.prototype.create = function(groupName, options) {
  var opts = extend({digits: 3}, options);
  this.groups[groupName] = {
    options: opts,
    counter: 0
  };
  return this;
};

/**
 * Get a group by it's name
 *
 * @param  {String} `groupName` Group name to get
 * @return {Object} Object containing the group options and current counter.
 * @api public;
 */

IdGenerator.prototype.group = function(groupName) {
  return this.groups[groupName];
};

/**
 * Get the next ID by groupName
 *
 * @param  {String} `groupName` Optional name of group to generate the ID for.
 * @param  {String} `options` Additional options to pass to the generator
 * @return {String} Generated ID
 * @api public
 */

IdGenerator.prototype.next = function (groupName, options) {
  if (typeof groupName !== 'string') {
    options = groupName;
    groupName = null;
  }
  return this.generator(groupName, options);
};

/**
 * Default generator used to create incremental IDs by group name
 *
 * @param  {String} `groupName` Optional name of the group to use to generate an ID
 * @return {String} Generated ID
 */

function defaultGenerator (groupName, options) {
  var digits = require('digits');
  groupName = groupName || 'default';
  var group = this.groups[groupName] || this.groups['default'];
  group.counter++;
  var opts = extend({}, group.options, options);
  var len = opts.digits || (opts.auto && String(opts.auto).length) || 3;
  var result = digits(''+group.counter, len);
  result = (opts.prefix || '') + rtn;
  return result;
}

/**
 * Export IdGenator
 * @type {Object}
 */

module.exports = IdGenerator;



