import { createApplication } from "@/app/actions";
import { QuickAddForm } from "@/components/quick-add-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuickAddPage() {
  const resumes = await prisma.resumeVersion.findMany({ orderBy: { name: "asc" } });
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Fast capture</p><h1>Quick add from job description</h1><p>Paste, extract, review, and save in under a minute.</p></div></header><QuickAddForm action={createApplication} resumes={resumes} /></div>;
}
