import fs from "fs";
import path from "path";
import styles from "./index.module.css";
import TableWidthAdjuster from "./TableWidthAdjuster";
import ClassRemover from "./ClassRemover";

export default function ChatGPT({ postPath }: { postPath: string }) {
  const filePath = path.join(process.cwd(), "app/posts/", postPath);
  const htmlContent = fs.readFileSync(filePath, "utf8");
  const containerClass = `${styles.container} ${styles.dynamicTable}`;
  const containerSelector = `.${styles.dynamicTable}`;

  return (
    <>
      <div
        className={containerClass}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <TableWidthAdjuster containerSelector={containerSelector} />
      <ClassRemover
        containerSelector={containerSelector}
        rawClassToRemove="top-[-0.094rem]"
        contentKey={htmlContent}
      />
    </>
  );
}
