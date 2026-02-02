"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "inherit",
});

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className = "" }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className={`mermaid-error ${className}`} style={{
        padding: "1rem",
        background: "#fee",
        border: "1px solid #fcc",
        borderRadius: "4px",
        color: "#c00"
      }}>
        <strong>Diagram Error:</strong> {error}
        <pre style={{ marginTop: "0.5rem", fontSize: "0.8em", overflow: "auto" }}>
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container ${className}`}
      style={{
        margin: "1.5rem 0",
        display: "flex",
        justifyContent: "center",
        overflow: "auto"
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
