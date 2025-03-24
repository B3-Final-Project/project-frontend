export enum RESTServerRoute {
  REST_LOGIN = 'auth/login',
  REST_SIGNUP = 'auth/register',
  REST_CONFIRM = 'auth/confirm',
  REST_REFRESH = 'auth/refresh',

  REST_PREFERENCES = 'preferences',
  REST_PREFERENCES_ALL = 'preferences/all',
  REST_PREFERENCE = 'preferences/:id',
}
