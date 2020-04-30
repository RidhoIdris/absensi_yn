import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Pages/Dashboard/Default'));
const Charts = React.lazy(() => import('./Pages/Charts'));
const MasterUsers = React.lazy(() => import('./Pages/Master/Users'));
const MasterPosition = React.lazy(() => import('./Pages/Master/Position'));
const MasterDepartment = React.lazy(() => import('./Pages/Master/Department'));
const MasterSchedule = React.lazy(() => import('./Pages/Master/Schedule'));
const MasterLocation = React.lazy(() => import('./Pages/Master/Location'));

const routes = [
    { path: '/dashboard', exact: true, name: 'Default', component: DashboardDefault },
    { path: '/charts', exact: true, name: 'Chart', component: Charts },
    { path: '/master/users', exact: true, name: 'MasterUsers', component: MasterUsers },
    { path: '/master/position', exact: true, name: 'MasterPosition', component: MasterPosition },
    { path: '/master/department', exact: true, name: 'MasterDepartment', component: MasterDepartment },
    { path: '/master/schedule', exact: true, name: 'MasterSchedule', component: MasterSchedule },
    { path: '/master/location', exact: true, name: 'MasterLocation', component: MasterLocation },
];

export default routes;