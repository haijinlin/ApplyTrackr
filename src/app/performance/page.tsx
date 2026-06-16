import { prisma } from "@/lib/prisma";
import { percentage } from "@/lib/format";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const [resumes, applications] = await Promise.all([
    prisma.resumeVersion.findMany({ include: { applications: { select: { status: true } } }, orderBy: { name: "asc" } }),
    prisma.jobApplication.findMany({ select: { careerCategory: true, status: true } }),
  ]);
  const resumeRows = resumes.map((resume) => {
    const total = resume.applications.length;
    const interviews = resume.applications.filter((x) => ["Interview", "Reference Check", "Offer"].includes(x.status)).length;
    const offers = resume.applications.filter((x) => x.status === "Offer").length;
    return { name: resume.name, total, interviews, offers };
  });
  const categoryRows = CATEGORIES.map((category) => {
    const relevant = applications.filter((x) => x.careerCategory === category);
    return { name: category, total: relevant.length, interviews: relevant.filter((x) => ["Interview", "Reference Check", "Offer"].includes(x.status)).length, rejected: relevant.filter((x) => x.status === "Rejected").length, offers: relevant.filter((x) => x.status === "Offer").length };
  }).filter((x) => x.total > 0);
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Insights</p><h1>Performance</h1><p>See which documents and career paths are driving outcomes.</p></div></header>
  <section className="panel"><div className="panel-heading"><div><h2>Resume performance</h2><p>Interviews include reference checks and offers</p></div></div><div className="table-wrap embedded"><table><thead><tr><th>Resume</th><th>Applications</th><th>Interviews</th><th>Offers</th><th>Interview rate</th><th>Offer rate</th></tr></thead><tbody>{resumeRows.map((x) => <tr key={x.name}><td><strong>{x.name}</strong></td><td>{x.total}</td><td>{x.interviews}</td><td>{x.offers}</td><td>{percentage(x.interviews, x.total)}</td><td>{percentage(x.offers, x.total)}</td></tr>)}</tbody></table>{!resumeRows.length && <p className="empty">Add resume versions to see performance.</p>}</div></section>
  <section className="panel"><div className="panel-heading"><div><h2>Performance by category</h2><p>Outcomes across career paths</p></div></div><div className="table-wrap embedded"><table><thead><tr><th>Category</th><th>Applications</th><th>Interviews</th><th>Rejections</th><th>Offers</th></tr></thead><tbody>{categoryRows.map((x) => <tr key={x.name}><td><strong>{x.name}</strong></td><td>{x.total}</td><td>{x.interviews}</td><td>{x.rejected}</td><td>{x.offers}</td></tr>)}</tbody></table>{!categoryRows.length && <p className="empty">Category statistics will appear after applications are added.</p>}</div></section></div>;
}
