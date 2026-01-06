import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'AI Systems in the Physical World, Embodied Intelligence',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },
  
  // url: 'http://localhost:3000',
  url: 'https://MariaKhan10.github.io',
  baseUrl: '/AI-Spec-Driven-Book/',
  organizationName: 'MariaKhan10',
  projectName: 'AI-Spec-Driven-Book',
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw', // keep as is for site links

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw', // ✅ move here for v4
    },
  },


  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'EN',
        direction: 'ltr',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
      },
    },
  },

  presets: [
    [
      'classic',
      {
            docs: {
      sidebarPath: './sidebars.ts',
      routeBasePath: 'docs', // ⭐ THIS IS THE FIX
      editUrl: 'https://github.com/MariaKhan10/AI-Spec-Driven-Book/edit/main/',
    },

        blog: false, // ✅ blog removed
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    colorMode: {
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Logo',
        src: 'img/favicon.ico', // favicon as logo
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Book',
          to: 'docs/introduction-embodied-ai-robotics',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/MariaKhan10/AI-Spec-Driven-Book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
  style: 'dark', // same dark theme
  links: [
    {
      title: 'Docs',
      items: [
        {
          label: 'Book',
          to: 'docs/introduction-embodied-ai-robotics',
        },
      ],
    },
    {
      title: 'Community',
      items: [
        { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
        { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
        { label: 'X', href: 'https://x.com/docusaurus' },
      ],
    },
    {
      title: 'More',
      items: [
        { label: 'GitHub', href: 'https://github.com/MariaKhan10/AI-Spec-Driven-Book' },
      ],
    },
  ],
  copyright: `Copyright © ${new Date().getFullYear()} AI Spec Driven Book. All rights reserved.`,
},


    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
