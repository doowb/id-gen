var digits = require('digits');
var _ = require('lodash');

/**
 * .defaultGenerator ( )
 *
 * Used in case a custom generator is not passed in.
 *
 * @return null
 */

function defaultGenerator () {
  return null;
}



/**
 * IdGenerator
 *
 * @constructor
 * @param {Object} `options` groups of options to pass to `digits`
 * @param {Function} `generator` custom generator used to calculate an id.
 * @return {Object} new instance of a IdGenerator
 *
 */
function IdGenerator (options, generator) {
  if (!(this instanceof IdGenerator)) {
    return new IdGenerator(options, generator);
  }

  if (_.isFunction(options)) {
    generator = options;
    options = {};
  }

  this.generator = generator || defaultGenerator;
  this.options = options || {};
  this.groups = {};
  this.groups.default = {
    options: this.options.default || {},
    counter: 0
  };

  _.forOwn(this.options, function (opts, key) {
    // if the `digits` options are are the root
    // just add them to default options
    if (key === 'auto' || key === 'digits') {
      this.groups.default.options[key] = opts;
      return;
    }
    this.groups[key] = {
      options: opts,
      counter: 0
    };
  }.bind(this));
}


/**
 * .next (context)
 *
 * Generator the next id given the context and an optional group name.
 * If the custom generator returns `null` or `undefined`, then the
 * next id is calculated based on the group and `digits` options
 * passed in the constructor.
 *
 * @param {Object} `context` passed directly to the custom generator
 * @param {String} `group` name of the group to use when the custom generator doesn't return a id
 * @return {String} The next id.
 */
IdGenerator.prototype.next = function (context, group) {
  if (_.isString(context)) {
    group = context;
    context = {};
  }
  var id = this.generator(context);
  if (_.isEmpty(id)) {
    id = this._next(group);
  }
  return id;
};


/**
 * ._next (group)
 *
 * Use digits to create the next id from the group.
 * TODO: switch this to `strings` and allow a pattern instead of a prefix
 *
 * @param {String} `group` name of the group to use. defaults to 'default'
 * @return {String} next generated id
 *
 */
IdGenerator.prototype._next = function (name) {
  name = name || 'default';
  var group = this.groups[name] || this.groups['default'];
  group.counter++;

  var rtn = digits(''+group.counter, group.options.auto || group.options.digits || 3);
  rtn = (group.options.prefix || '') + rtn;
  return rtn;
};



module.exports = IdGenerator;
