export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
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
    routes: [
      {
        path: '/e-invoice',
        redirect: '/e-invoice/preview',
      },
      {
        path: '/e-invoice/preview/01',
        name: 'invoice',
        component: './invoice-mapping',
      },
      {
        path: '/e-invoice/preview/02',
        name: 'credit-note',
        component: './invoice-mapping',
      },
      {
        path: '/e-invoice/preview/03',
        name: 'debit-note',
        component: './invoice-mapping',
      },
      {
        path: '/e-invoice/preview/11',
        name: 'self-billed-invoice',
        component: './invoice-mapping',
      },
      {
        path: '/e-invoice/preview/12',
        name: 'self-billed-credit-note',
        component: './invoice-mapping',
      },
      {
        path: '/e-invoice/preview/13',
        name: 'self-billed-debit-note',
        component: './invoice-mapping',
      },
    ],
  },
  {
    path: '/lhdn-submission-history',
    name: 'invoice.submission',
    icon: 'fileDone',
    access: 'canAdmin',
    routes: [
      {
        path: '/lhdn-submission-history',
        redirect: '/lhdn-submission-history/submission',
      },
      {
        path: '/lhdn-submission-history/submission/01',
        name: 'invoice',
        component: './invoice-submission',
      },
      {
        path: '/lhdn-submission-history/submission/02',
        name: 'credit-note',
        component: './invoice-submission',
      },
      {
        path: '/lhdn-submission-history/submission/03',
        name: 'debit-note',
        component: './invoice-submission',
      },
      {
        path: '/lhdn-submission-history/submission/11',
        name: 'self-billed-invoice',
        component: './invoice-submission',
      },
      {
        path: '/lhdn-submission-history/submission/12',
        name: 'self-billed-credit-note',
        component: './invoice-submission',
      },
      {
        path: '/lhdn-submission-history/submission/13',
        name: 'self-billed-debit-note',
        component: './invoice-submission',
      },
    ],
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
