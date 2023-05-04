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
            '/data-types/'
        ]
    }
};