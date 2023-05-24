module.exports = {
    title: 'skapi',
    description: 'skapi API documentation',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    plugins: [
        'code-switcher',
        ['vuepress-plugin-code-copy', {
            color: "#636569",
            staticIcon: true
        }]
    ],
    markdown: {
        plugins: [
            [require('markdown-it-custom-header-link')]
        ]
    },
    themeConfig: {
        // nav: [
        //     {
        //         text: 'Home',
        //         link: '/'
        //     },
        //     {
        //         text: 'Get Started',
        //         link: '/get-started/'
        //     }
        // ],
        sidebar: [
            '/getting-started/',
            '/the-basics/',
            '/authentication/',
            '/authentication-tutorial/',
            '/user-account/',
            '/user-account-tutorial/',
            '/database/',
            '/database-advanced/',
            {
                title: 'API Reference',
                sidebarDepth: 1,
                collapsable: false,
                disabled: true,
                children: [
                    ['/api-reference/database/', 'Database'],
                    ['/api-reference/user/', 'User'],
                    ['/api-reference/subscription/', 'Subscription'],
                    ['/api-reference/data-types/', 'Data Types']
                ]
            }
        ]
    }
};