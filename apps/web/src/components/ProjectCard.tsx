type Project = {
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  longDescription?: string;
  tags?: string[];
  tech?: Array<string | { name: string }>;
  liveUrl?: string;
  live?: string;
  repository?: string;
  source?: string;
  links?: {
    live?: string;
    repo?: string;
  };
};

export function ProjectCard({ p }: { p: Project }) {
  // Get description from any available field
  const blurb = p.summary || p.description || p.longDescription || "Full-stack application with modern architecture";
  
  // Get tags from either tags or tech array
  const projectTags = p.tags || (p.tech?.map(t => typeof t === 'string' ? t : t.name)) || [];
  
  // Get links
  const liveLink = p.liveUrl || p.live || p.links?.live;
  const repoLink = p.repository || p.source || p.links?.repo;
  
  return (
    <article className="rounded-2xl border p-5 transition hover:shadow-sm">
      <h3 className="text-xl font-semibold">{p.title}</h3>
      <p className="mt-2 text-sm text-slate-700">{blurb}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {projectTags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full border px-2.5 py-1 text-xs text-slate-700"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        {liveLink && (
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-900 underline underline-offset-4"
          >
            Live Demo
          </a>
        )}
        {repoLink && (
          <a
            href={repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-900 underline underline-offset-4"
          >
            Source Code
          </a>
        )}
        <a
          href={`/projects/${p.slug}`}
          className="text-sm font-medium text-slate-900 underline underline-offset-4"
        >
          Case Study
        </a>
      </div>
    </article>
  );
}