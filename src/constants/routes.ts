const routes = {
  index: '/',
  login: '/login',
  underwriting: {
    flow: {
      list: '/flow-list',
      edit: (id: string) => `/flow-list/${id}/edit`,
      details: (id: string) => `/flow-list/${id}/details`
    },
    dataDictionary: '/data-dictionary',
    changeHistory: '/change-history'
  }
};

export default routes;
