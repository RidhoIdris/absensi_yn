export default {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/dashboard',
                    icon: 'feather icon-home',
                },
                {
                    id: 'charts',
                    title: 'Charts',
                    type: 'item',
                    icon: 'feather icon-pie-chart',
                    url: '/charts'
                },
                {
                    id: 'master',
                    title: 'Master',
                    type: 'collapse',
                    icon: 'feather icon-lock',
                    children: [
                        {
                            id: 'users',
                            title: 'Users',
                            type: 'item',
                            url: '/master/users',
                        },
                        {
                            id: 'department',
                            title: 'Department',
                            type: 'item',
                            url: '/master/department',
                        },
                        {
                            id: 'position',
                            title: 'Position',
                            type: 'item',
                            url: '/master/position',
                        },
                        {
                            id: 'schedule',
                            title: 'Schedule',
                            type: 'item',
                            url: '/master/schedule',
                        },
                    ]
                }
            ]
            
        }
    ]
}