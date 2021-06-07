module.exports = {
  mongoUrl:
    process.env.MONGODB_URL ||
    'mongodb://root:root@localhost:27017/aarini-assignment?authSource=admin',
  secret: process.env.SECRET || 'aarini-assignment',
  saltFactor: process.env.SALT_WORK_FACTOR || 10
};
