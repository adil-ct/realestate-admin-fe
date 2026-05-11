import React from 'react';

export const guestRoutes = [
  {
    path: '/signin',
    name: 'Signin',
    exact: true,
    component: React.lazy(() => import('../../views/auth/Login/Login')),
  },
  {
    path: '/otp',
    name: 'OTPVERIFY',
    exact: true,
    component: React.lazy(() => import('../../views/auth/Login/OtpScreen')),
  },
  {
    path: '/reset-password',
    name: 'Reset-password',
    exact: true,
    component: React.lazy(() => import('../../views/auth/Login/ResetPassword')),
  },
  {
    redirectRoute: true,
    name: 'SigninRedirect',
    path: '/signin'
  } 
];

export const userRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    exact: true,
    component: React.lazy(() => import('../../views/user/Dashboard/Dashboard')),
  },
  {
    path: '/oath-verification',
    name: 'Dashboard',
    exact: true,
    component: React.lazy(() => import('views/accountDetails/AccountDetails')),
  },
  {
    path: '/early-investors',
    name: 'Users-early-invester',
    exact: true,
    component: React.lazy(() => import('../../views/user/users/EarlyInvestors')),
  },
  {
    path: '/investors',
    name: 'Users-invesrtors',
    exact: true,
    component: React.lazy(() => import('../../views/investor/Investor')),
  },
  {
    path: '/property-managers',
    name: 'Users-property-manager',
    exact: true,
    component: React.lazy(() => import('../../views/user/users/PropertyManagers')),
  },
  {
    path: '/view-user/:id',
    name: 'ViewUSER',
    component: React.lazy(() => import('../../views/ViewUser/ViewUser')),
  },
  {
    path: '/admin-management',
    name: 'Admin-management',
    exact: true,
    component: React.lazy(() => import('views/adminmanagment/AdminManagment')),
  },
  // {
  //   path: '/account-details',
  //   name: 'Account-details',
  //   exact: true,
  //   component: React.lazy(() => import('views/accountDetails/AccountDetails')),
  // },
  // {
  //   path: '/wallet',
  //   name: 'Wallet',
  //   exact: true,
  //   component: React.lazy(() => import('views/wallet/FiatWallet')),
  // },
  {
    path: '/draft-properties',
    name: 'Draft Properties',
    exact: true,
    component: React.lazy(() => import('views/properties/DraftProperties')),
  },
  {
    path: '/published-properties',
    name: 'Published Properties',
    exact: true,
    component: React.lazy(() => import('views/properties/PublishedProperties')),
  },
  {
    path: '/edit-property/:propertyId',
    name: 'Edit Property',
    exact: true,
    component: React.lazy(() => import('views/properties/EditProperty')),
  },
  {
    path: '/market-management',
    name: 'Market Management',
    exact: true,
    component: React.lazy(() => import('views/properties/MarketManagement')),
  },
  {
    path: '/market-detail',
    name: 'Market detail',
    exact: true,
    component: React.lazy(() => import('views/properties/EditProperty')),
  },
  {
    path: '/cashflow',
    name: 'Cashflow',
    exact: true,
    component: React.lazy(() => import('views/cashflow/Cashflow')),
  },
  {
    path: '/rental-detail',
    name: 'Cashflow Detail',
    exact: true,
    component: React.lazy(() => import('views/cashflow/CashflowDetail')),
  },
  // {
  //   path: '/governance',
  //   name: 'Governance',
  //   exact: true,
  //   component: React.lazy(() => import('views/governance/Governance')),
  // },
  {
    path: '/profile',
    name: 'Profile detail',
    exact: true,
    component: React.lazy(() => import('views/profle/profile')),
  },
  // {
  //   path: '/promotions',
  //   name: 'Promotions',
  //   exact: true,
  //   component: React.lazy(() => import('views/promotions/Promotions')),
  // },
  // {
  //   path: '/promotions/:promoCode',
  //   name: 'Promo Details',
  //   exact: true,
  //   component: React.lazy(() => import('views/promotions/PromoDetails')),
  // },
  // {
  //   path: '/edit-promotion/:promoCode',
  //   name: 'Edit Promotion',
  //   exact: true,
  //   component: React.lazy(() => import('views/promotions/EditPromotion')),
  // },
  // {
  //   path: '/promotions/:promoCode/:userId',
  //   name: 'Promo Details',
  //   exact: true,
  //   component: React.lazy(() => import('views/promotions/UserPromotionTransaction')),
  // },
  {
    path: '/transactions-management',
    name: 'TransactionsManagement',
    exact: true,
    component: React.lazy(() => import('views/transactions/TransactionsManagement')),
  },
  // {
  //   path: '/rewards-transactions',
  //   name: 'ReferralTransactions',
  //   exact: true,
  //   component: React.lazy(() => import('views/transactions/ReferralTransactions')),
  // },
  {
    path: '/portfolio',
    name: 'Portfolio',
    exact: true,
    component: React.lazy(() => import('views/portfolio/Portfolio')),
  },
  // {
  //   path: '/payment-methods',
  //   name: 'PaymentMethods',
  //   exact: true,
  //   component: React.lazy(() => import('views/paymentmethods/index')),
  // },
  // {
  //   path: '/payment-method-details',
  //   name: 'MethodDetails',
  //   exact: true,
  //   component: React.lazy(() => import('views/paymentmethods/methodDetails')),
  // },
  {
    path: '/portfolio-property/:id',
    name: 'Portfolio Property',
    exact: true,
    component: React.lazy(() => import('views/portfolio/AssetPortfolio')),
  },
  {
    path: '/property-proposals/:id',
    name: 'Property Proposals',
    exact: true,
    component: React.lazy(() => import('views/portfolio/Proposals')),
  },
  {
    path: '/view-proposal/:id',
    name: 'View Proposal',
    exact: true,
    component: React.lazy(() => import('views/portfolio/ViewProposal')),
  },
  // {
  //   path: '/blogs',
  //   name: 'Blogs',
  //   exact: true,
  //   component: React.lazy(() => import('views/blog')),
  // },
  // {
  //   path: '/blogs/writer',
  //   name: 'Writer',
  //   exact: true,
  //   component: React.lazy(() => import('views/blog/writer')),
  // },
  // {
  //   path: '/blogs/type',
  //   name: 'Type',
  //   exact: true,
  //   component: React.lazy(() => import('views/blog/type')),
  // },
  // {
  //   path: '/blogs/add-blog',
  //   name: 'AddBlog',
  //   exact: true,
  //   component: React.lazy(() => import('views/blog/addBlog')),
  // },
  {
    path: '/property-financials',
    name: 'PropertyFinancials',
    exact: true,
    component: React.lazy(() => import('views/propertyFinancials')),
  },
  {
    path: '/investor-relations',
    name: 'investor-relation',
    exact: true,
    component: React.lazy(() => import('../../views/investorRelation/InvestorRelation')),
  },
  {
    path: '/investor-relations/:referralId',
    name: 'investor-relation-details',
    exact: true,
    component: React.lazy(() => import('../../views/investorRelation/InvestorRelationDetail')),
  },
  {
    path: '/referrals-transactions/:refreeId/:referralId',
    name: 'transaction-details',
    exact: true,
    component: React.lazy(() => import('../../views/investorRelation/TransactionDetail')),
  },
  {
    path: '/comparable-property',
    name: 'comparable-property',
    exact: true,
    component: React.lazy(() => import('../../views/comparableProperty/ComparableProperty')),
  },
  {
    path: '/comparable-property/:propertyId/:action',
    name: 'comparable-property',
    exact: true,
    component: React.lazy(() => import('../../views/comparableProperty/ViewComparableProperty')),
  },
  {
    redirectRoute: true,
    name: 'dashboardRedirect',
    path: '/dashboard',
  },
];
