import Link from "next/link";
import { Filter, FilePlus2, Plus } from "lucide-react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, SOURCE_PLATFORMS, STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

type Search = { status?: string; category?: string; resume?: string; source?: string; from?: string; to?: string; sort?: string };

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const resumes = await prisma.resumeVersion.findMany();
  const where: Prisma.JobApplicationWhereInput = {
    ...(query.status && { status: query.status }),
    ...(query.category && { careerCategory: query.category }),
    ...(query.resume && { resumeVersionId: query.resume }),
    ...(query.source && { sourcePlatform: query.source }),
    ...((query.from || query.to) && { applicationDate: { ...(query.from && { gte: new Date(`${query.from}T00:00:00`) }), ...(query.to && { lte: new Date(`${query.to}T23:59:59`) }) } }),
  };
  const orderBy: Prisma.JobApplicationOrderByWithRelationInput =
    query.sort === "followUp" ? { nextFollowUpDate: "asc" } :
    query.sort === "company" ? { companyName: "asc" } :
    query.sort === "status" ? { status: "asc" } : { applicationDate: "desc" };
  const applications = await prisma.jobApplication.findMany({ where, orderBy, include: { resumeVersion: true } });

  return (
    <div className="page">
      <header className="page-header"><div><p className="eyebrow">Pipeline</p><h1>Applications</h1><p>{applications.length} roles match the current view.</p></div><div className="header-actions"><Link className="button button-secondary" href="/applications/new"><Plus size={17} />Manual add</Link><Link className="button button-primary" href="/applications/quick-add"><FilePlus2 size={17} />Quick add</Link></div></header>
      <form className="filter-bar">
        <span className="filter-title"><Filter size={16} />Filters</span>
        <select name="status" defaultValue={query.status ?? ""}><option value="">All statuses</option>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
        <select name="category" defaultValue={query.category ?? ""}><option value="">All categories</option>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select>
        <select name="resume" defaultValue={query.resume ?? ""}><option value="">All resumes</option>{resumes.map((x) => <option value={x.id} key={x.id}>{x.name}</option>)}</select>
        <select name="source" defaultValue={query.source ?? ""}><option value="">All sources</option>{SOURCE_PLATFORMS.map((x) => <option key={x}>{x}</option>)}</select>
        <input name="from" type="date" defaultValue={query.from} aria-label="From date" />
        <input name="to" type="date" defaultValue={query.to} aria-label="To date" />
        <select name="sort" defaultValue={query.sort ?? "applicationDate"}><option value="applicationDate">Newest application</option><option value="followUp">Follow-up date</option><option value="company">Company name</option><option value="status">Status</option></select>
        <button className="button button-dark">Apply</button>
        <Link className="button button-ghost" href="/applications">Clear</Link>
      </form>
      <div className="table-wrap"><table><thead><tr><th>Role</th><th>Status</th><th>Category</th><th>Applied</th><th>Follow-up</th><th>Resume</th></tr></thead><tbody>
        {applications.map((item) => <tr key={item.id}><td><Link className="role-link" href={`/applications/${item.id}`}><strong>{item.jobTitle}</strong><span>{item.companyName}{item.location ? ` · ${item.location}` : ""}</span></Link></td><td><StatusBadge status={item.status} /></td><td>{item.careerCategory}</td><td>{formatDate(item.applicationDate)}</td><td>{formatDate(item.nextFollowUpDate)}</td><td>{item.resumeVersion?.name ?? "—"}</td></tr>)}
      </tbody></table>{!applications.length && <p className="empty">No applications match these filters.</p>}</div>
    </div>
  );
}
