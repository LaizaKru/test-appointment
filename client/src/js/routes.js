import HomePage from '../pages/home.jsx';
import LoginPage from '../pages/login.jsx';
import SignupPage from '../pages/signup.jsx';
import AppointmentPage from "@/pages/appointment";

import NotFoundPage from '../pages/404.jsx';

import * as api from "../api";

function checkAuth ({ resolve, reject, ...rest}) {
  api.check().then(resolve).catch(() => {
    reject();
    this.navigate('/login/');
  });
}

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/signup/',
    component: SignupPage,
  },
  {
    path: '/appointment/',
    component: AppointmentPage,
    beforeEnter: [checkAuth],
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
