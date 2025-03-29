export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login/index.tsx',
      },
      {
        name: 'Reset Password',
        path: '/user/resetPassword',
        component: './user/ResetPassword/index.tsx',
      },
      {
        name: 'Forgot Password',
        path: '/user/forgotPassword',
        component: './user/ForgotPassword/index.tsx',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './dashboard/analysis/index.tsx',
  },
  {
    path: '/e-invoice',
    name: 'invoice.mapping',
    icon: 'fileSync',
    access: 'canUser',
    component: './invoice-mapping/index.tsx',
  },
  {
    path: '/lhdn-submission-history',
    name: 'invoice.submission',
    icon: 'fileDone',
    access: 'canUser',
    component: './invoice-submission/index.tsx',
  },
  {
    path: '/partner',
    name: 'partner',
    icon: 'team',
    access: 'canAdmin',
    component: './partner/index.tsx',
  },
  {
    name: 'account.settings',
    icon: 'setting',
    path: '/account',
    component: './account/settings/index.tsx',
  },
  {
    path: '/audit-log',
    name: 'audit-log',
    icon: 'history',
    component: './audit-log/index.tsx',
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
