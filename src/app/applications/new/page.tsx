import { ApplicationForm } from "@/components/application-form";
import { createApplication } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const resumes = await prisma.resumeVersion.findMany({ orderBy: { name: "asc" } });
  return <div className="page narrow-page"><header className="page-header"><div><p className="eyebrow">Manual entry</p><h1>Add application</h1><p>Record a role with all relevant details.</p></div></header><ApplicationForm action={createApplication} resumes={resumes} /></div>;
}
