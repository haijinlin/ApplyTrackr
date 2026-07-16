"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function assertWritable() {
  if (process.env.VERCEL !== "1" && process.env.SCREENSHOT_MODE === "true") {
    throw new Error("Screenshot mode is read-only.");
  }
}

const value = (formData: FormData, name: string) => {
  const result = formData.get(name)?.toString().trim();
  return result || null;
};

const dateValue = (formData: FormData, name: string) => {
  const result = value(formData, name);
  return result ? new Date(`${result}T12:00:00`) : null;
};

function applicationData(formData: FormData) {
  return {
    companyName: value(formData, "companyName") ?? "Unknown company",
    jobTitle: value(formData, "jobTitle") ?? "Untitled role",
    jobLink: value(formData, "jobLink"),
    location: value(formData, "location"),
    salaryRange: value(formData, "salaryRange"),
    employmentType: value(formData, "employmentType"),
    careerCategory: value(formData, "careerCategory") ?? "Other",
    sourcePlatform: value(formData, "sourcePlatform"),
    applicationDate: dateValue(formData, "applicationDate") ?? new Date(),
    status: value(formData, "status") ?? "Applied",
    resumeVersionId: value(formData, "resumeVersionId"),
    contactPerson: value(formData, "contactPerson"),
    contactEmail: value(formData, "contactEmail"),
    notes: value(formData, "notes"),
    nextFollowUpDate: dateValue(formData, "nextFollowUpDate"),
    closingDate: dateValue(formData, "closingDate"),
    workArrangement: value(formData, "workArrangement"),
    keySkills: (value(formData, "keySkills") ?? "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    jobDescription: value(formData, "jobDescription"),
    coverLetterText: value(formData, "coverLetterText"),
    coverLetterNotes: value(formData, "coverLetterNotes"),
  };
}

export async function createApplication(formData: FormData) {
  assertWritable();
  const application = await prisma.jobApplication.create({ data: applicationData(formData) });
  revalidatePath("/");
  revalidatePath("/applications");
  redirect(`/applications/${application.id}`);
}

export async function updateApplication(id: string, formData: FormData) {
  assertWritable();
  await prisma.jobApplication.update({ where: { id }, data: applicationData(formData) });
  revalidatePath("/");
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  redirect(`/applications/${id}`);
}

export async function deleteApplication(id: string) {
  assertWritable();
  await prisma.jobApplication.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/applications");
  redirect("/applications");
}

export async function createResumeVersion(formData: FormData) {
  assertWritable();
  const name = value(formData, "name");
  if (name) await prisma.resumeVersion.create({ data: { name, notes: value(formData, "notes") } });
  revalidatePath("/versions");
}

export async function deleteResumeVersion(id: string) {
  assertWritable();
  await prisma.resumeVersion.delete({ where: { id } });
  revalidatePath("/versions");
}
