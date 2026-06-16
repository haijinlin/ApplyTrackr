import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarClock, CircleCheckBig, FilePlus2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, percentage } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { DatabaseSetup } from "@/components/database-setup";
import { isDatabaseConfigured } from "@/lib/database";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!isDatabaseConfigured) return <DatabaseSetup />;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const followUpEnd = new Date(now);
  followUpEnd.setDate(now.getDate() + 14);

  const [total, thisWeek, thisMonth, interviews, rejections, offers, recent, followUps] = await Promise.all([
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { applicationDate: { gte: weekStart } } }),
    prisma.jobApplication.count({ where: { applicationDate: { gte: monthStart } } }),
    prisma.jobApplication.count({ where: { status: { in: ["Interview", "Reference Check"] } } }),
    prisma.jobApplication.count({ where: { status: "Rejected" } }),
    prisma.jobApplication.count({ where: { status: "Offer" } }),
    prisma.jobApplication.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.jobApplication.findMany({
      where: { nextFollowUpDate: { gte: now, lte: followUpEnd }, status: { notIn: ["Rejected", "Withdrawn", "Offer"] } },
      orderBy: { nextFollowUpDate: "asc" },
      take: 5,
    }),
  ]);

  const cards = [
    ["Total applications", total, "All tracked roles"],
    ["Submitted this week", thisWeek, "Since Monday"],
    ["Submitted this month", thisMonth, "Current month"],
    ["Interviews", interviews, `${percentage(interviews, total)} interview rate`],
    ["Rejections", rejections, "Closed applications"],
    ["Offers", offers, `${percentage(offers, total)} offer rate`],
  ];

  return (
    <div className="page">
      <header className="page-header dashboard-header">
        <div><p className="eyebrow">Overview</p><h1>Job search dashboard</h1><p>Track progress, follow up on time, and see what is working.</p></div>
        <div className="header-actions"><Link className="button button-secondary" href="/applications/new"><BriefcaseBusiness size={17} />Manual add</Link><Link className="button button-primary" href="/applications/quick-add"><FilePlus2 size={17} />Quick add</Link></div>
      </header>

      <section className="stats-grid">
        {cards.map(([label, number, detail]) => <article className="stat-card" key={label}><span>{label}</span><strong>{number}</strong><small>{detail}</small></article>)}
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Upcoming follow-ups</h2><p>Due in the next 14 days</p></div><CalendarClock size={20} /></div>
          <div className="stack-list">
            {followUps.length ? followUps.map((item) => (
              <Link className="list-row" href={`/applications/${item.id}`} key={item.id}>
                <span className="list-icon"><CircleCheckBig size={18} /></span>
                <span className="list-main"><strong>{item.jobTitle}</strong><small>{item.companyName}</small></span>
                <span className="list-meta">{formatDate(item.nextFollowUpDate)}</span>
              </Link>
            )) : <p className="empty">No follow-ups due soon.</p>}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Recently updated</h2><p>Your latest activity</p></div><Link href="/applications">View all <ArrowRight size={15} /></Link></div>
          <div className="stack-list">
            {recent.length ? recent.map((item) => (
              <Link className="list-row" href={`/applications/${item.id}`} key={item.id}>
                <span className="list-main"><strong>{item.jobTitle}</strong><small>{item.companyName}</small></span>
                <StatusBadge status={item.status} />
              </Link>
            )) : <p className="empty">No applications yet. Quick add your first role.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
