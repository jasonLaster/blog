import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Tweet } from "react-tweet";
import { Code } from "bright";
import { Mermaid } from "./app/components/mermaid";

type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type DetailsProps = ComponentPropsWithoutRef<"details">;
type SummaryProps = ComponentPropsWithoutRef<"summary">;

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  darkSelector: "html.dark",
  lightSelector: "html:not(.dark)",
};

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      {
        id: slug,
        className: `group flex whitespace-pre-wrap text-gray-800 dark:text-zinc-200 font-medium mt-8 mb-3 ${
          level === 1 ? "font-medium pt-12" : ""
        }`,
      },
      <>
        <a
          href={`#${slug}`}
          key={`link-${slug}`}
          className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 ml-[-14px] pr-[4px] text-zinc-600 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
        >
          #
        </a>
        {children}
      </>
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  Tweet,
  Mermaid,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),

  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img className="my-4 rounded-lg" {...props} />
  ),
  p: (props: ParagraphProps) => {
    // Handle both standard Markdown dividers and the special ⸻ character
    if (props.children && typeof props.children === "string") {
      const content = props.children.trim();

      // Check for special em dash divider
      if (content === "⸻") {
        return (
          <hr className="my-8 border-t border-gray-300 dark:border-zinc-700" />
        );
      }

      // Check for standard markdown dividers
      if (/^[\-*_]{3,}$/.test(content)) {
        return (
          <hr className="my-8 border-t border-gray-300 dark:border-zinc-700" />
        );
      }
    }

    return (
      <p
        className="text-gray-800 dark:text-zinc-300 my-[1em] leading-[1.5]"
        {...props}
      />
    );
  },
  ol: (props: ListProps) => (
    <ol
      className="text-gray-800 dark:text-zinc-300 list-decimal pl-5 space-y-2"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="text-gray-800 dark:text-zinc-300 list-disc pl-5 space-y-1"
      {...props}
    />
  ),
  li: (props: ListItemProps) => <li className="pl-1 last:mb-4" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      "text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: Code,

  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-gray-100 dark:bg-zinc-800" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody
      className="divide-y divide-gray-200 dark:divide-zinc-700"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => {
    // Parse width attribute from header content like "Header [w-300px]"
    let columnWidth = "";
    let displayContent = props.children;

    if (props.children && typeof props.children === "string") {
      const widthMatch = props.children.match(/\s*\[w-(\d+)px\]\s*$/);

      if (widthMatch) {
        // Extract the width value
        const widthValue = widthMatch[1];
        columnWidth = `w-[${widthValue}px]`;

        // Remove the width directive from the display content
        displayContent = props.children.replace(/\s*\[w-\d+px\]\s*$/, "");
      }
    }

    return (
      <th
        className={`px-4 py-3 text-left font-medium text-gray-700 dark:text-zinc-300 ${columnWidth}`}
        {...props}
      >
        {displayContent}
      </th>
    );
  },
  td: (props: ComponentPropsWithoutRef<"td">) => {
    return (
      <td
        className="px-4 py-3 text-gray-800 dark:text-zinc-300 border-t border-gray-200 dark:border-zinc-700 whitespace-normal break-words align-top"
        {...props}
      />
    );
  },

  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
      {...props}
    />
  ),

  // Disclosure components
  Details: ({ children, ...props }: DetailsProps) => {
    return (
      <details className="my-4 group " {...props}>
        {children}
      </details>
    );
  },

  Summary: ({ children, ...props }: SummaryProps) => {
    return (
      <summary
        className="cursor-pointer font-medium text-gray-800 dark:text-zinc-200 list-none flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
        {...props}
      >
        <span className="inline-flex items-center justify-center w-4 text-gray-500 dark:text-zinc-400 group-open:rotate-90 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        {children}
      </summary>
    );
  },

  // Explicit horizontal rule component
  hr: () => (
    <hr className="my-8 border-t border-gray-300 dark:border-zinc-700" />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
