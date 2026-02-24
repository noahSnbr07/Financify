import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Financify',
        short_name: 'Financify',
        description: 'Track Finances',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#101010',
        theme_color: '#101010',
        display_override: ["fullscreen", "minimal-ui", "standalone", "browser"],
        lang: "en",
        orientation: "portrait-primary",
        dir: "ltr",
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}