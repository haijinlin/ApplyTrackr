import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import { deleteApplication } from "@/app/actions";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.jobApplication.findUnique({ where: { id }, include: { resumeVersion: true } });
  if (!item) notFound();
  const remove = deleteApplication.bind(null, id);
  const details = [["Location", item.location], ["Salary", item.salaryRange], ["Employment", item.employmentType], ["Work arrangement", item.workArrangement], ["Category", item.careerCategory], ["Source", item.sourcePlatform], ["Applied", formatDate(item.applicationDate)], ["Closing date", formatDate(item.closingDate)], ["Next follow-up", formatDate(item.nextFollowUpDate)], ["Resume", item.resumeVersion?.name], ["Contact", item.contactPerson], ["Contact email", item.contactEmail]];
  return <div className="page narrow-page"><header className="detail-header"><div><p className="eyebrow">{item.companyName}</p><h1>{item.jobTitle}</h1><div className="detail-sub"><StatusBadge status={item.status} />{item.location && <span><MapPin size={15} />{item.location}</span>}{item.nextFollowUpDate && <span><CalendarClock size={15} />Follow up {formatDate(item.nextFollowUpDate)}</span>}</div></div><div className="header-actions">{item.jobLink && <a className="button button-secondary" href={item.jobLink} target="_blank" rel="noreferrer"><ExternalLink size={16} />Job ad</a>}<Link className="button button-primary" href={`/applications/${id}/edit`}><Pencil size={16} />Edit</Link></div></header>
  <section className="panel detail-panel"><h2>Application details</h2><dl className="detail-grid">{details.map(([label, val]) => <div key={label}><dt>{label}</dt><dd>{val || "—"}</dd></div>)}</dl></section>
  {item.keySkills.length > 0 && <section className="panel"><h2>Key skills</h2><div className="chips">{item.keySkills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>}
  {item.notes && <section className="panel prose-panel"><h2>Notes</h2><p>{item.notes}</p></section>}
  {item.coverLetterText && <section className="panel prose-panel cover-letter-panel"><div className="section-heading"><div><p className="eyebrow">Application snapshot</p><h2>Cover letter used</h2></div></div><p>{item.coverLetterText}</p></section>}
  {item.coverLetterNotes && <section className="panel prose-panel"><h2>Cover letter notes</h2><p>{item.coverLetterNotes}</p></section>}
  {item.jobDescription && <section className="panel prose-panel"><h2>Job description</h2><p>{item.jobDescription}</p></section>}
  <form action={remove}><button className="button button-danger" type="submit"><Trash2 size={16} />Delete application</button></form></div>;
}
