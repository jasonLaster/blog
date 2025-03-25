import path from "node:path";
import fs from "node:fs";
export const getArticlesList = () => {
  const projectRoot = process.cwd();
  const postsDir = path.resolve(projectRoot, "src", "app", "blog", "posts");
  const dirs = fs.readdirSync(postsDir);
  console.log(dirs)
  return dirs
};

