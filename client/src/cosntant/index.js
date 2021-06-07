module.exports = {
  api: {
    signIn: '/users/sign-in',
    signUp: '/users/sign-up',
    users: '/users'
  },
  adminApi: {
    users: '/admin/users'
  },
  pageUrl: {
    user: '/user',
    adminUser: '/admin/user-list',
    register: '/register'
  },
  cookies: { jwt: 'JWT', userRole: 'userRole' }
};
