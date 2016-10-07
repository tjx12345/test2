module.exports = function (schema) {
  console.log('abcd');
  schema.methods.create_at_ago = function () {
    return 'abc';
  };

  schema.methods.update_at_ago = function () {
    return 'dbc';
  };
};
