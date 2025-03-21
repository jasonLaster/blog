import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { SubmenuItemsMap, SubmenuItem } from "../types";

const getArticleData = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;

  const file = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(file);

  if (process.env.NODE_ENV !== 'development' && data.draft) {
    return null;
  }

  const datePattern = /\d{4}-\d{1,2}-\d{2}/;
  const match = filePath.match(datePattern);
  const date = match ? match[0] : undefined;

  return {
    fileName: filePath,
    title: data.title,
    created: data.created || date,
  } as Pick<SubmenuItem, "title" | "created">;
};

export const getArticlesList = () => {
  const projectRoot = process.cwd();
  const postsDir = path.resolve(projectRoot, "src", "posts");
  const dirs = fs.readdirSync(postsDir);
  const availableSubmenuPages: SubmenuItemsMap = {};

  const rootPagePath = path.join(postsDir, "index.mdx");
  const rootArticle = getArticleData(rootPagePath);

  if (rootArticle) {
    availableSubmenuPages[""] = [
      {
        href: "/",
        ...rootArticle,
      },
    ];
  }

  dirs.forEach((dir) => {
    const dirPath = path.join(postsDir, dir);

    if (!fs.existsSync(dirPath)) return;
    if (dir === "index.mdx") return;

    const isDir = fs.lstatSync(dirPath).isDirectory();

    // Ignore non-mdx files
    if (!isDir && !dir.endsWith(".mdx")) return;

    // Handle top-level mdx files
    if (!isDir) {
      const menuArticle = getArticleData(dirPath);

      if (!menuArticle) return;

      availableSubmenuPages[dir.replace(".mdx", "")] = [
        {
          href: `/${dir}`,
          ...menuArticle,
        },
      ];

      return;
    }

    // Handle articles lists
    const pageDirs = fs.readdirSync(dirPath);
    availableSubmenuPages[dir] = [];

    pageDirs.forEach((pageDir) => {
      if (!pageDir.endsWith(".mdx")) return;

      const pagePath = path.join(dirPath, pageDir);
      const article = getArticleData(pagePath);
      if (!article) return;

      availableSubmenuPages[dir]?.push({
        href: `/${dir}/${pageDir.replace(".mdx", "")}`,
        ...article,
      });
    });

    availableSubmenuPages[dir]?.sort(
      (a, b) => (+b.created || 0) - (+a.created || 0),
    );
  });

  Object.keys(availableSubmenuPages).forEach((key: string) => {
    availableSubmenuPages[key] = availableSubmenuPages[key]?.map((page) => {
      const created = new Date(page.created)
      return {...page, created,}
    }).sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
  });


  return availableSubmenuPages;
};
