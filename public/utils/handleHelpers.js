// Source https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
// Check if equal for Handlebars view
const equalCheck = function(a, b, options) {

  if (a === b) { return options.fn(this); }
  return options.inverse(this);

};

// Check if not equal for Handlebars view
const notEqualCheck = function(sender, receiver,  options) {

  if (sender !== receiver) { return options.fn(this); }
  return options.inverse(this);

};

module.exports = {
  equalCheck,
  notEqualCheck
};