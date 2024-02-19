import {
  Home,
  Feather,
  Twitter,
  GitHub,
  Star,
  Tool,
  Linkedin,
} from "react-feather";
import { ReplayLogo } from "./components/App/ReplayLogo";

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
      title: "Projects",
      items: [
        {
          icon: ReplayLogo,
          title: "Replay.io",
          href: "https://replay.io",
        },
        {
          icon: Tool,
          title: "Firefox DevTools",
          href: "https://firefox-dev.tools/",
        },
        {
          icon: Star,
          title: "Backbone Mariotte",
          href: "https://marionettejs.com/",
        },
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
          href: "https://github.com/jasonlaster",
        },
        {
          icon: Linkedin,
          title: "Linkedin",
          href: "https://linkedin.com/in/jason-laster-6657167",
        },
      ],
    },
  ],
};

export default config;
