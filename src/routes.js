import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Pages/Dashboard/Default'));
const Charts = React.lazy(() => import('./Pages/Charts'));
const MasterUsers = React.lazy(() => import('./Pages/Master/Users'));

const routes = [
    { path: '/dashboard', exact: true, name: 'Default', component: DashboardDefault },
    { path: '/charts', exact: true, name: 'Chart', component: Charts },
    { path: '/master/users', exact: true, name: 'MasterUsers', component: MasterUsers },
];

export default routes;