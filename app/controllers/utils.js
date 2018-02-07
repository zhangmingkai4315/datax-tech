function getMethods(obj) {
  const ret = [];
  for (let prop in obj) {
    if (
      obj[prop] &&
      obj[prop].constructor &&
      obj[prop].call &&
      obj[prop].apply
    ) {
      ret.push(prop);
    }
  }
  return ret;
}

module.exports = {
  getMethods
};
