module.exports = {
    title: 'skapi',
    description: 'skapi API documentation',
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
            '/data-types/',
            {
                title: 'API Reference',
                path: '/api-reference/',
                sidebarDepth: 1,
                collapsable: false,
                children: [
                    ['/api-reference/database/', 'Database']
                ]
            }
        ]
    }
};