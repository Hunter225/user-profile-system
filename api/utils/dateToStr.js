const dateToStr = (dateObj) => {
  return `${dateObj.getUTCDate()}-${dateObj.getUTCMonth()}-${dateObj.getUTCFullYear()}`;
};

module.exports = dateToStr;
