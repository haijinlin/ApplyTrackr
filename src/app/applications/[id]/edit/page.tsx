import { notFound } from "next/navigation";
import { updateApplication } from "@/app/actions";
import { ApplicationForm } from "@/components/application-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditApplication({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [application, resumes] = await Promise.all([prisma.jobApplication.findUnique({ where: { id } }), prisma.resumeVersion.findMany({ orderBy: { name: "asc" } })]);
  if (!application) notFound();
  return <div className="page narrow-page"><header className="page-header"><div><p className="eyebrow">Update record</p><h1>Edit application</h1><p>{application.jobTitle} at {application.companyName}</p></div></header><ApplicationForm action={updateApplication.bind(null, id)} application={application} resumes={resumes} submitLabel="Save changes" /></div>;
}
