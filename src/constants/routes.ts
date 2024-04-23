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
      dataDictionary: (id: string) => `/flow-list/${id}/data-dictionary`
    },
    changeHistory: '/change-history',
    leadRequest: '/lead-request'
  }
};

export default routes;
