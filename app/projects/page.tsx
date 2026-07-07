import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isProjectsPageEnabled } from "@/app/lib/feature-flags";

type Project = {
  title: string;
  description: string;
  date: string;
  href?: string;
};

const projects: Project[] = [
  {
    title: "ETF tracker",
    description: "Track performance + reverse-engineer component weights",
    date: "2025",
    href: "https://ebi.jlast.io",
  },
  {
    title: "Photo journal",
    description: "Collage of personal photos",
    date: "2026",
    href: "https://journal.jlast.io",
  },
  {
    title: "Parameterized prints",
    description: "3D Print design tool visualizing selecting the ideal params",
    date: "2026",
    href: "https://prints.jlast.io",
  },
  {
    title: "Dining table",
    description: "Mid-century modern dining table woodworking walkthrough",
    date: "Coming soon",
  },
];

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Jason Laster",
  alternates: {
    canonical: "/projects",
  },
};

function ProjectTitle({ project }: { project: Project }) {
  const className =
    "text-neutral-900 dark:text-neutral-100 tracking-tight font-medium";

  if (!project.href) {
    return <span className={className}>{project.title}</span>;
  }

  return (
    <a
      className={`${className} hover:text-blue-500 dark:hover:text-zinc-300`}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {project.title}
    </a>
  );
}

export default function ProjectsPage() {
  if (!isProjectsPageEnabled()) {
    notFound();
  }

  return (
    <section aria-labelledby="projects-heading">
      <h1 id="projects-heading" className="sr-only">
        Projects
      </h1>

      <div className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="hidden md:block">
          {projects.map((project) => (
            <div
              key={project.title}
              className="grid grid-cols-[160px_1fr_100px] gap-4 border-b border-zinc-200 dark:border-zinc-800 py-2"
            >
              <ProjectTitle project={project} />
              <p className="text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
              <p className="text-right text-neutral-400 dark:text-neutral-400 tabular-nums text-sm self-center">
                {project.date}
              </p>
            </div>
          ))}
        </div>

        <div className="block md:hidden">
          {projects.map((project) => (
            <div
              key={project.title}
              className="border-b border-zinc-200 dark:border-zinc-800 py-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <ProjectTitle project={project} />
                <span className="shrink-0 text-sm text-neutral-400 dark:text-neutral-400 tabular-nums">
                  {project.date}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
