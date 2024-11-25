export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'Reset Password',
        path: '/user/resetPassword',
        component: './user/ResetPassword',
      },
      {
        name: 'Forgot Password',
        path: '/user/forgotPassword',
        component: './user/ForgotPassword',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './dashboard/analysis',
  },
  {
    path: '/e-invoice',
    name: 'invoice.mapping',
    icon: 'fileSync',
    access: 'canAdmin',
    component: './invoice-mapping',
  },
  {
    path: '/lhdn-submission-history',
    name: 'invoice.submission',
    icon: 'fileDone',
    access: 'canAdmin',
    component: './invoice-submission',
  },
  {
    path: '/partner',
    name: 'partner',
    icon: 'team',
    component: './partner',
  },
  {
    name: 'account.settings',
    icon: 'setting',
    path: '/account',
    component: './account/settings',
  },
  {
    path: '/audit-log',
    name: 'audit-log',
    icon: 'history',
    component: './audit-log',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
