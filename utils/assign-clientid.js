let counter = 0;

module.exports.assignID = () => {
  counter += 1;
  return counter - 1;
};
