import { FileText, Plus, Trash2 } from "lucide-react";
import { createResumeVersion, deleteResumeVersion } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VersionsPage() {
  const resumes = await prisma.resumeVersion.findMany({ include: { _count: { select: { applications: true } } }, orderBy: { name: "asc" } });
  return <div className="page narrow-page"><header className="page-header"><div><p className="eyebrow">Resume library</p><h1>Resume versions</h1><p>Manage the CV versions you use across applications. Cover letters are saved directly inside each job application.</p></div></header><div>
    <VersionSection title="Resume versions" items={resumes} createAction={createResumeVersion} deleteAction={deleteResumeVersion} />
  </div></div>;
}

function VersionSection({ title, items, createAction, deleteAction }: { title: string; items: { id: string; name: string; notes: string | null; _count: { applications: number } }[]; createAction: (data: FormData) => Promise<void>; deleteAction: (id: string) => Promise<void> }) {
  return <section className="panel version-panel"><div className="panel-heading"><div><h2>{title}</h2><p>{items.length} saved versions</p></div><FileText size={20} /></div><form className="inline-create" action={createAction}><input name="name" required placeholder="Version name" /><input name="notes" placeholder="Optional notes" /><button className="button button-dark"><Plus size={16} />Add</button></form><div className="stack-list">{items.map((item) => <div className="list-row" key={item.id}><span className="list-main"><strong>{item.name}</strong><small>{item.notes || `${item._count.applications} linked applications`}</small></span><form action={deleteAction.bind(null, item.id)}><button className="icon-button" aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button></form></div>)}{!items.length && <p className="empty">No versions added yet.</p>}</div></section>;
}
