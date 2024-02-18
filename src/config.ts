import {
  Home,
  Feather,
  Twitter,
  GitHub,
  Figma,
  CheckSquare,
  Mic,
  Briefcase,
  Layers,
  Package,
} from "react-feather";

const config = {
  app: {
    title: "Jason Laster",
    // subtitle: "JS Time traveler",
    // thumbnailUrl: "/img/logo.svg",
  },
  meta: {
    url: "https://reshaped-blog-starter.vercel.app",
    title: "Jason Laster",
    description: "Blog starter built on top of Next.js and Reshaped",
    twitter: {
      username: "jasonlaster11",
    },
  },
  menu: [
    {
      icon: Home,
      title: "Home",
      href: "/",
    },
    {
      icon: Feather,
      title: "Writing",
      href: "/article",
    },
    {
      icon: Layers,
      title: "Stack",
      href: "/stack",
    },

    {
      title: "Projects",
      items: [
        {
          icon: Package,
          title: "Replay.io",
          href: "https://replay.io",
        },
        {
          icon: CheckSquare,
          title: "Firefox DevTools",
          href: "https://www.designsystemchecklist.com",
        },
        {
          icon: Mic,
          title: "Backbone Mariotte",
          href: "https://reshaped.so/blog",
        },
        // {
        //   icon: Briefcase,
        //   title: "Formaat Design",
        //   href: "https://formaat.design",
        // },
      ],
    },
    {
      title: "Online",
      items: [
        {
          icon: Twitter,
          title: "Twitter",
          href: "https://twitter.com/jasonlaster11",
        },
        {
          icon: GitHub,
          title: "GitHub",
          href: "https://github.com/jason-laster",
        },
        {
          icon: Figma,
          title: "Linkedin",
          href: "https://linkedin.com/in/jason-laster-6657167",
        },
      ],
    },
  ],
};

export default config;
