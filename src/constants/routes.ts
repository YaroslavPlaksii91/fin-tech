const routes = {
  index: '/',
  login: '/login',
  underwriting: {
    flow: {
      list: '/flow-list',
      edit: (id: string) => `/flow-list/${id}/edit`,
      details: (id: string) => `/flow-list/${id}/details`
    },
    changeHistory: '/change-history',
    leadRequest: '/lead-request'
  }
};

export default routes;
