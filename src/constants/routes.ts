const routes = {
  index: '/',
  auth: {
    login: '/login',
    accessVerification: '/access-verification'
  },
  underwriting: {
    flow: {
      list: '/flow-list',
      edit: (id: string) => `/flow-list/${id}/edit`,
      view: (id: string) => `/flow-list/${id}/view`,
      dataDictionary: (id: string) => `/flow-list/${id}/data-dictionary`
    },
    changeHistory: '/change-history',
    leadRequest: '/lead-request',
    denialReasons: '/denial-reasons'
  }
};

export default routes;
