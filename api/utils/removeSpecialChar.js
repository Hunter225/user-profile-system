// handle regex special chacracters

const removeSpecialChar = (str) => {
  return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/g, '');
};

module.exports = removeSpecialChar;
