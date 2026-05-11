export const adminColumn = [
  {
    label: 'Admin Name',
    field: 'adminName',
    sort: 'asc',
    width: 200,
  },
  {
    label: 'Role',
    field: 'role',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'Admin Email',
    field: 'email',
    sort: 'asc',
    width: 270,
  },
  {
    label: 'Last Login',
    field: 'lastLogin',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Action',
    field: 'action',
    width: 100,
    sort: 'disabled',
  },
];

export const BuyStep = [
  {
    label: 'Sr. No.',
    field: 'number',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Step Name',
    field: 'name',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Step Description',
    field: 'description',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Date',
    field: 'date',
    sort: 'disabled',
    width: 100,
  },
  // {
  //   label: 'Status',
  //   field: 'status',
  //   sort: 'disabled',
  //   width: 100,
  // },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
    width: 100,
  },
];

export const MarketChartColumn = [
  {
    label: 'Year',
    field: 'year',
    width: 100,
  },
  {
    label: 'Rent($)',
    field: 'rent',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Appreciation($)',
    field: 'appreciation',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
    width: 100,
  },
];

export const fiatColumn = [
  {
    label: 'Date & Time',
    field: 'registration_date',
    sort: 'asc',
    width: 150,
  },
  {
    label: 'Amount',
    field: 'amount',
    sort: 'asc',
    width: 270,
  },
  {
    label: 'Fees',
    field: 'fees',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'To',
    field: 'to',
    sort: 'asc',
    width: 150,
  },
  {
    label: 'From',
    field: 'source',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'Transaction Hash',
    field: 'transactionHash',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
    width: 100,
  },
];

export const withdrawColumn = [
  {
    label: 'Date & Time',
    field: 'registration_date',
    sort: 'asc',
    width: 150,
  },
  {
    label: 'Amount',
    field: 'amount',
    sort: 'asc',
    width: 270,
  },
  {
    label: 'Fees',
    field: 'fees',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'To',
    field: 'to',
    sort: 'asc',
    width: 150,
  },
  {
    label: 'From',
    field: 'description',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'Transaction Hash',
    field: 'transactionHash',
    sort: 'disabled',
    width: 200,
  },
  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
    width: 100,
  },
];
export const transferColumn = [
  {
    label: 'Date & Time',
    field: 'registration_date',
    sort: 'asc',
  },
  {
    label: 'Amount',
    field: 'amount',
    sort: 'asc',
  },
  {
    label: 'From',
    field: 'to',
    sort: 'disabled',
  },
  {
    label: 'To',
    field: 'destination',
    sort: 'disabled',
  },

  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
  },
];
export const investorColumn = [
  {
    label: 'Name',
    field: 'name',
    sort: 'disabled',
  },
  {
    label: 'Email',
    field: 'email',
    sort: 'disabled',
  },
  {
    label: 'KYC Status',
    field: 'kyc',
    sort: 'disabled',
  },
  {
    label: 'Last Login',
    field: 'date',
    sort: 'disabled',
  },
  // {
  //   label: 'Investor Relations',
  //   field: 'affiliate',
  //   sort: 'disabled',
  // },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  },
];

export const cashflowColumn = [
  {
    label: 'Asset',
    field: 'propertyName',
  },
  {
    label: 'Property Manager',
    field: 'propertyManager',
  },
  {
    label: 'Rent/Month',
    field: 'alterMonthlyRentAmount',
  },
  {
    label: 'Duration',
    field: 'rentalDuration',
  },
  {
    label: 'Next Payout Summary',
    field: 'endDate',
  },
  {
    label: 'Status',
    field: 'status',
  },
  {
    label: 'Action',
    field: 'action',
  },
];

export const cashflowTxnColumn = [
  {
    label: 'Asset',
    field: 'propertyName',
  },
  {
    label: 'Rent/Month',
    field: 'rentAmount',
  },
  {
    label: 'Payout Date',
    field: 'endDate',
  },
  {
    label: 'Status',
    field: 'status',
  },
  {
    label: 'Action',
    field: 'action',
  },
];

export const cashflowTxnHistoryColumn = [
  {
    label: 'Timestamp',
    field: 'timestamp',
  },
  {
    label: 'Investor',
    field: 'name',
  },
  {
    label: 'Property',
    field: 'propertyName',
  },
  {
    label: 'Amount',
    field: 'rent',
  },
  {
    label: 'Action',
    field: 'action',
  },
];

export const cashflowDetailColumn = [
  {
    label: 'Investor Name',
    field: 'title',
    width: 100,
  },
  {
    label: 'Token owned',
    field: 'token',
    sort: 'disabled',
    width: 100,
  },
  // {
  //   label: 'Portfolio Value',
  //   field: 'deposite',
  //   sort: 'disabled',
  //   width: 100,
  // },
  {
    label: 'Duration',
    field: 'duration',
    sort: 'disabled',
    width: 100,
  },
  {
    label: 'Start Date',
    field: 'updated',
    sort: 'disabled',
    width: 100,
  },
];

export const governanceColumn = [
  {
    label: 'Proposal Title',
    field: 'title',
    width: 100,
  },
  // {
  //   label: 'Property',
  //   field: 'title',
  // },
  {
    label: 'Property',
    field: 'propertyName',
  },
  {
    label: 'Votes',
    field: 'votes',
  },
  {
    label: 'Start Date',
    field: 'startDate',
  },
  // {
  //   label: 'Start Date',
  //   field: 'date',
  //   sort: 'disabled',
  //   width: 100,
  // },
  {
    label: 'End Date',
    field: 'endDate',
  },
  {
    label: 'Status',
    field: 'status',
  },
  {
    label: 'Approval',
    field: 'approvalStatus',
  },
];
export const proposalsColumn = [
  {
    label: 'Proposal Title',
    sort: 'disabled',
    field: 'title',
  },
  {
    label: 'Property',
    field: 'propertyName',
  },
  {
    label: 'Votes',
    sort: 'disabled',
    field: 'votes',
  },
  {
    label: 'Start Date',
    field: 'startDate',
  },
  {
    label: 'End Date',
    field: 'endDate',
  },
  {
    label: 'Status',
    field: 'status',
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  },
];

export const portfolioColumn = [
  {
    label: 'Asset',
    field: 'title',
    sort: 'disabled',
  },
  {
    label: 'Allocation',
    field: 'tokensSoldPercentage',
  },
  {
    label: 'Balance',
    field: 'balance',
    sort: 'disabled',
  },
  /* {
    label: 'Action',
    field: 'action',
  }, */
];

export const TxnsManagementColumn = [
  {
    label: 'Date',
    field: 'updatedAt',
    sort: 'disabled',
  },
  {
    label: 'Txn Type',
    field: 'transactionType',
    sort: 'disabled',
  },
  {
    label: 'Source',
    field: 'source',
    sort: 'disabled',
  },
  {
    label: 'Destination',
    field: 'destination',
    sort: 'disabled',
  },
  {
    label: 'Transaction Hash/ID',
    field: 'transactionHash',
    sort: 'disabled',
  },
  {
    label: 'Amount',
    field: 'amount',
  },
  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
  },
];

export const AssetPortfolioColumn = [
  {
    label: 'Time stamp',
    field: 'createdAt',
  },
  {
    label: 'Purpose',
    field: 'type',
  },
  {
    label: 'No. of tokens',
    field: 'tokens',
  },
  {
    label: 'Amount($)',
    field: 'alterPrice',
  },
  {
    label: 'Txn Hash',
    field: 'transactionHash',
  },
];

export const RentTxnsColumn = [
  {
    label: 'Date',
    field: 'createdAt',
  },
  {
    label: 'Total Rent',
    field: 'totalRent',
  },
  {
    label: 'Amount($)',
    field: 'amount',
  },
  {
    label: '# of tokens',
    field: 'numberOfTokens',
  },
  {
    label: 'Action',
    field: 'action',
  },
];

export const PropertyTxnsColumn = [
  {
    label: 'Date',
    field: 'date',
  },
  {
    label: 'Amount($)',
    field: 'price',
  },
  {
    label: 'Txn Type',
    field: 'transactionType',
  },
  {
    label: 'To',
    field: 'destination',
  },
  {
    label: 'From',
    field: 'source',
  },
];

export const ProposalsColumn = [
  {
    label: 'Proposal Title',
    field: 'title',
  },
  {
    label: 'Votes (In Favor)',
    field: 'votedFor',
  },
  {
    label: 'Votes (Against)',
    field: 'votedAgainst',
  },
  {
    label: 'End Date',
    field: 'endDate',
  },
  {
    label: 'Status',
    field: 'status',
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  },
];

export const PaymentMethodsColumn = [
  {
    label: 'Title',
    field: 'method',
    sort: 'disabled',
  },
  {
    label: 'Sub Heading',
    field: 'subHeading',
    sort: 'disabled',
  },
  {
    label: 'Type',
    field: 'type',
    sort: 'disabled',
  },
  {
    label: 'Updated At',
    field: 'updatedAt',
    sort: 'disabled',
  },
  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
  },
  {
    label: 'Actions',
    field: 'action',
    sort: 'disabled',
  },
];

export const ReferralTxnsColumn = [
  {
    label: 'Date',
    field: 'createdAt',
  },
  {
    label: 'To',
    field: 'userName',
  },
  {
    label: 'Rewards Converted',
    field: 'quoteCurrencyAmount',
  },
  {
    label: 'Action/Txn Hash',
    field: 'transactionHash',
    sort: 'disabled',
  },
];

export const RewardTxnsColumn = [
  {
    label: 'Date',
    field: 'createdAt',
  },
  {
    label: 'To',
    field: 'referraluser',
  },
  {
    label: 'For',
    field: 'refereeuser',
  },
  {
    label: 'Reward Amount',
    field: 'quoteCurrencyAmount',
  },
  {
    label: 'Reward Type',
    field: 'rewardType',
  },
];

export const PropertyFinancialsColumns = [
  {
    label: 'Title',
    field: 'customTitle',
    sort: 'disabled',
  },
  {
    label: 'Total Tokens',
    field: 'totalTokens',
  },
  {
    label: 'Tokens Left',
    field: 'tokenLeft',
  },
  {
    label: 'Tokens On Hold',
    field: 'tokensOnHold',
  },
  {
    label: 'Wallet Address',
    sort: 'disabled',
    field: 'customWalletAddress',
  },
  // {
  //   label: 'Wallet Balance',
  //   field: 'customWalletBalance'
  // },
  {
    label: 'Owner',
    sort: 'disabled',
    field: 'customOwner',
  },
  {
    label: 'Manager',
    sort: 'disabled',
    field: 'customPropertyManager',
  },
  {
    label: 'Status',
    field: 'status',
  },
  // {
  //   label: 'Transfer',
  //   field: 'transfer'
  // },
];

export const PropertyInvestorsList = [
  {
    label: 'Name',
    field: 'name',
  },
  {
    label: 'Tokens Owned',
    field: 'tokensOwned',
  },
  {
    label: 'Bought At Price',
    field: 'boughtAtPrice',
  },
];

export const investorRelationColumn = [
  {
    label: 'Name',
    field: 'name',
    sort: 'disabled',
  },
  {
    label: 'Email',
    field: 'email',
    sort: 'disabled',
  },
  {
    label: 'Phone No',
    field: 'phoneNo',
    sort: 'disabled',
  },
  {
    label: 'KYC Status',
    field: 'kyc',
    sort: 'disabled',
  },
  // {
  //   label: 'Amount Invested',
  //   field: 'invested',
  //   sort: 'disabled',
  // },
  {
    label: 'Amount Earned',
    field: 'earned',
    sort: 'disabled',
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  },
];

export const refreeTransactionColumn = [
  {
    label: 'Property Name',
    field: 'propertyName',
    sort: 'disabled',
  },
  {
    label: 'Date',
    field: 'createdAt',
    sort: 'disabled',
  },
  {
    label: 'Amount Invested',
    field: 'amount',
    sort: 'disabled',
  }  
];

export const promotionColumn = [
  {
    label: 'Promo Code',
    field: 'promoCode',
    sort: 'disabled',
  },
  {
    label: 'Name',
    field: 'name',
    sort: 'disabled',
  },
  {
    label: 'Description',
    field: 'description',
    sort: 'disabled',
  },
  {
    label: 'State',
    field: 'state',
    sort: 'disabled',
  },
  {
    label: 'Tokens Remaining',
    field: 'tokenRemaining',
    sort: 'disabled',
  },
  {
    label: 'Tokens Gifted',
    field: 'tokenGifted',
    sort: 'disabled',
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  } 
];


export const promotionDetailsColumn = [
  {
    label: 'Name',
    field: 'name',
    sort: 'disabled',
  },
  {
    label: 'Email',
    field: 'email',
    sort: 'disabled',
  },
  {
    label: 'Tokens Gifted',
    field: 'tokenGifted',
    sort: 'disabled',
  },
  {
    label: 'Tokens Pending',
    field: 'tokenGiftPending',
    sort: 'disabled',
  },
  {
    label: 'Invested ($)',
    field: 'amountInvested',
    sort: 'disabled',
  },
  {
    label: 'Posted ($)',
    field: 'amountPosted',
    sort: 'disabled',
  },
  {
    label: 'Pending ($)',
    field: 'amountPending',
    sort: 'disabled',
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  } 
];

export const promotionTransactionColumn = [
  {
    label: 'Date',
    field: 'createdAt',
    sort: 'disabled',
  },
  {
    label: 'Amount Invested',
    field: 'amount',
    sort: 'disabled',
  },  
  {
    label: 'Property Name',
    field: 'propertyName',
    sort: 'disabled',
  },
  {
    label: 'Token',
    field: 'token',
    sort: 'disabled',
  },
  {
    label: 'Status',
    field: 'status',
    sort: 'disabled',
  }
];

export const comparablePropertyColumn = [
  {
    label: 'Name',
    field: 'name',
    sort: 'disabled',
  },
  // {
  //   label: 'Baths',
  //   field: 'baths',
  //   sort: 'disabled',
  // },
  // {
  //   label: 'Beds',
  //   field: 'beds',
  //   sort: 'disabled',
  // },
  {
    label: 'Area (Square Feet)',
    field: 'sqFt',
    // sort: 'disabled',
  },
  {
    label: 'Monthly Rent',
    field: 'monthlyRent',
    // sort: 'disabled',
  },
  // {
  //   label: 'Price Sold',
  //   field: 'priceSold',
  //   sort: 'disabled',
  // },
  // {
  //   label: 'Date Sold',
  //   field: 'dateSold',
  //   sort: 'disabled',
  // },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
  } 
];