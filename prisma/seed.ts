import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.jobApplication.deleteMany();
  await prisma.resumeVersion.deleteMany();
  await prisma.coverLetterVersion.deleteMany();

  const [itResume, customerResume, procurementResume] = await Promise.all([
    prisma.resumeVersion.create({ data: { name: "IT Support Resume V1", notes: "Technical support focused" } }),
    prisma.resumeVersion.create({ data: { name: "Customer Service Resume V1" } }),
    prisma.resumeVersion.create({ data: { name: "Procurement Resume V1" } }),
  ]);
  const [genericLetter, tailoredLetter] = await Promise.all([
    prisma.coverLetterVersion.create({ data: { name: "Generic Cover Letter" } }),
    prisma.coverLetterVersion.create({ data: { name: "Tailored Cover Letter", notes: "Role-specific opening and achievements" } }),
  ]);
  const now = new Date();
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 86_400_000);
  await prisma.jobApplication.createMany({ data: [
    { companyName: "Northstar Health", jobTitle: "IT Support Officer", location: "Melbourne VIC", salaryRange: "$72,000 - $80,000", employmentType: "Full-time", careerCategory: "IT Support", sourcePlatform: "SEEK", status: "Interview", applicationDate: daysFromNow(-5), nextFollowUpDate: daysFromNow(2), workArrangement: "Hybrid", keySkills: ["IT Support", "Microsoft 365", "Active Directory", "Troubleshooting"], resumeVersionId: itResume.id, coverLetterVersionId: tailoredLetter.id, notes: "First interview with service desk manager." },
    { companyName: "Brightline Retail", jobTitle: "Customer Service Coordinator", location: "Sydney NSW", employmentType: "Full-time", careerCategory: "Customer Service", sourcePlatform: "Indeed", status: "Applied", applicationDate: daysFromNow(-2), nextFollowUpDate: daysFromNow(5), workArrangement: "On-site", keySkills: ["Customer Service", "Communication", "Salesforce"], resumeVersionId: customerResume.id, coverLetterVersionId: genericLetter.id },
    { companyName: "Civic Supply Co", jobTitle: "Procurement Assistant", location: "Brisbane QLD", salaryRange: "$65k - $72k", employmentType: "Contract", careerCategory: "Procurement", sourcePlatform: "LinkedIn", status: "Offer", applicationDate: daysFromNow(-24), workArrangement: "Hybrid", keySkills: ["Procurement", "Inventory", "SAP"], resumeVersionId: procurementResume.id, coverLetterVersionId: tailoredLetter.id },
    { companyName: "Cloudbase Systems", jobTitle: "Junior Web Developer", location: "Remote", employmentType: "Full-time", careerCategory: "Web Development", sourcePlatform: "Company Website", status: "Rejected", applicationDate: daysFromNow(-12), workArrangement: "Remote", keySkills: ["WordPress", "Communication"], resumeVersionId: itResume.id, coverLetterVersionId: tailoredLetter.id },
  ]});
}

main().finally(() => prisma.$disconnect());
