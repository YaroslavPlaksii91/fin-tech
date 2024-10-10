const routes = {
  index: '/',
  auth: {
    login: '/login',
    accessVerification: '/access-verification'
  },
  underwriting: {
    flow: {
      list: (id?: string) => (id ? `/flow-list/${id}` : '/flow-list'),
      edit: (id: string) => `/flow-list/${id}/edit`,
      dataDictionary: (id: string) => `/data-dictionary/${id}`
    },
    changeHistory: '/change-history',
    leadRequest: '/lead-request',
    denialReasons: '/denial-reasons',
    waterfall: '/waterfall',
    billingReport: '/billing-report'
  },
  permissionDenied: '/permission-denied'
};

export default routes;
