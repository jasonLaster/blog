import fs from "fs";
import path from "path";
import styles from "./index.module.css"; // Import the CSS module
import TableWidthAdjuster from "./TableWidthAdjuster"; // Import the client component

// Removed the server-side calculateColumnWidths function

export default function ChatGPT({ postPath }: { postPath: string }) {
  console.log("ResearchTable: Reading research.html (server-side)", postPath);
  let htmlContent = "<p>Error loading research data.</p>"; // Default error message
  // Removed dynamicStyles state/calculation from here
  const filePath = path.join(process.cwd(), "app/posts/", postPath);

  try {
    console.log("ResearchTable: Reading", filePath);
    htmlContent = fs.readFileSync(filePath, "utf8");
    console.log(`ResearchTable: Successfully read ${filePath}`);
    // No dynamic calculation here anymore
  } catch (error) {
    console.error(`ResearchTable: Error reading file ${filePath}:`, error);
    // Keep the default error message
  }

  const containerClass = `${styles.container} ${styles.dynamicTable}`;
  const containerSelector = `.${styles.dynamicTable}`; // Selector for the client component

  return (
    <>
      {/* Render the div with the HTML */}
      <div
        className={containerClass} // Apply container and dynamicTable classes
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {/* Render the client component to adjust widths post-hydration */}
      <TableWidthAdjuster containerSelector={containerSelector} />
    </>
  );
}
