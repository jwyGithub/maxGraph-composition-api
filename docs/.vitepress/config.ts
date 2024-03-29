import { defineConfig } from 'vitepress';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    base: '/maxGraph-composition-api/',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'maxGraph'
        }
    },

    themeConfig: {
        nav: [
            {
                text: 'related links',
                items: [
                    { text: 'mxgraph', link: 'https://github.com/jgraph/mxgraph' },
                    { text: 'maxgraph', link: 'https://github.com/maxGraph/maxGraph' }
                ]
            }
        ],
        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'introduction', link: '/guide/introduction' },
                    { text: 'Getting Started', link: '/guide/getting-started' }
                ]
            },
            {
                text: 'Config',
                items: [
                    { text: 'Global Config', link: '/config/global-config' },
                    { text: 'Graph Config', link: '/config/graph-config' }
                ]
            },
            {
                text: 'Draw',
                items: [
                    { text: 'Draw', link: '/draw/draw' },
                    { text: 'Draw Anchor', link: '/draw/draw-anchor' }
                ]
            },
            {
                text: 'Style',
                items: [
                    { text: 'Global Style', link: '/style/register-global-style' },
                    { text: 'Default Style', link: '/style/default-style' }
                ]
            },
            {
                text: 'Shape',
                items: [{ text: 'Global Shape', link: '/shape/global-shape' }]
            },
            {
                text: 'Event',
                items: [
                    { text: 'Element Event', link: '/event/element-event' },
                    { text: 'Graph Event', link: '/event/graph-event' }
                ]
            }
        ],
        socialLinks: [{ icon: 'github', link: 'https://github.com/jwyGithub/maxGraph-composition-api' }]
    },
    vite: {
        plugins: [
            vueJsx({
                mergeProps: true
            })
        ]
    }
});

