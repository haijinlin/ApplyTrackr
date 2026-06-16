import type { JobApplication, ResumeVersion } from "@prisma/client";
import { CATEGORIES, EMPLOYMENT_TYPES, SOURCE_PLATFORMS, STATUSES, WORK_ARRANGEMENTS } from "@/lib/constants";
import { inputDate } from "@/lib/format";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  application?: JobApplication | null;
  resumes: ResumeVersion[];
  submitLabel?: string;
};

const Field = ({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <label className={wide ? "field field-wide" : "field"}>
    <span>{label}</span>
    {children}
  </label>
);

export function ApplicationForm({ action, application, resumes, submitLabel = "Save application" }: Props) {
  return (
    <form action={action} className="form-card">
      <div className="form-grid">
        <Field label="Company name"><input name="companyName" required defaultValue={application?.companyName} /></Field>
        <Field label="Job title"><input name="jobTitle" required defaultValue={application?.jobTitle} /></Field>
        <Field label="Job link" wide><input name="jobLink" type="url" defaultValue={application?.jobLink ?? ""} placeholder="https://..." /></Field>
        <Field label="Location"><input name="location" defaultValue={application?.location ?? ""} /></Field>
        <Field label="Salary range"><input name="salaryRange" defaultValue={application?.salaryRange ?? ""} placeholder="$70,000 - $85,000" /></Field>
        <Field label="Employment type">
          <select name="employmentType" defaultValue={application?.employmentType ?? ""}><option value="">Not specified</option>{EMPLOYMENT_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Work arrangement">
          <select name="workArrangement" defaultValue={application?.workArrangement ?? ""}><option value="">Not specified</option>{WORK_ARRANGEMENTS.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Career category">
          <select name="careerCategory" defaultValue={application?.careerCategory ?? "Other"}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Source platform">
          <select name="sourcePlatform" defaultValue={application?.sourcePlatform ?? ""}><option value="">Not specified</option>{SOURCE_PLATFORMS.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={application?.status ?? "Applied"}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Application date"><input name="applicationDate" type="date" defaultValue={inputDate(application?.applicationDate) || inputDate(new Date())} /></Field>
        <Field label="Resume version">
          <select name="resumeVersionId" defaultValue={application?.resumeVersionId ?? ""}><option value="">None</option>{resumes.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select>
        </Field>
        <Field label="Contact person"><input name="contactPerson" defaultValue={application?.contactPerson ?? ""} /></Field>
        <Field label="Contact email"><input name="contactEmail" type="email" defaultValue={application?.contactEmail ?? ""} /></Field>
        <Field label="Next follow-up"><input name="nextFollowUpDate" type="date" defaultValue={inputDate(application?.nextFollowUpDate)} /></Field>
        <Field label="Closing date"><input name="closingDate" type="date" defaultValue={inputDate(application?.closingDate)} /></Field>
        <Field label="Key skills" wide><input name="keySkills" defaultValue={application?.keySkills.join(", ") ?? ""} placeholder="Microsoft 365, Communication, IT Support" /></Field>
        <Field label="Notes" wide><textarea name="notes" rows={4} defaultValue={application?.notes ?? ""} /></Field>
        <Field label="Cover letter used for this application" wide><textarea name="coverLetterText" rows={14} defaultValue={application?.coverLetterText ?? ""} placeholder="Paste the final cover letter submitted for this role..." /></Field>
        <Field label="Cover letter notes" wide><textarea name="coverLetterNotes" rows={4} defaultValue={application?.coverLetterNotes ?? ""} placeholder="What did you emphasise? What would you improve next time?" /></Field>
        <Field label="Full job description" wide><textarea name="jobDescription" rows={10} defaultValue={application?.jobDescription ?? ""} /></Field>
      </div>
      <div className="form-actions"><button className="button button-primary" type="submit">{submitLabel}</button></div>
    </form>
  );
}
