"use client";

import { useState } from "react";
import type { ResumeVersion } from "@prisma/client";
import { ClipboardPaste, SearchCheck } from "lucide-react";
import { CATEGORIES, EMPLOYMENT_TYPES, SOURCE_PLATFORMS, STATUSES, WORK_ARRANGEMENTS } from "@/lib/constants";
import { parseJobDescription, type ParsedJob } from "@/lib/parser";

const empty: ParsedJob = { companyName: "", jobTitle: "", location: "", salaryRange: "", employmentType: "", sourcePlatform: "", keySkills: [], closingDate: "", workArrangement: "", confidenceNotes: [] };

export function QuickAddForm({ action, resumes }: { action: (formData: FormData) => void | Promise<void>; resumes: ResumeVersion[] }) {
  const [description, setDescription] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [parsed, setParsed] = useState(empty);
  const [extracted, setExtracted] = useState(false);
  const update = (key: keyof ParsedJob, value: string | string[]) => setParsed((current) => ({ ...current, [key]: value }));

  return (
    <div className="quick-layout">
      <section className="paste-card">
        <div className="step-label">Step 1</div><h2>Paste the job ad</h2><p>Copy the full advertisement from any job board. No AI service is used.</p>
        <label className="field"><span>Job link (optional)</span><input value={jobLink} onChange={(e) => setJobLink(e.target.value)} placeholder="Helps detect the source platform" /></label>
        <label className="field"><span>Full job description</span><textarea rows={18} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paste the full job advertisement here..." /></label>
        <button className="button button-primary button-wide" type="button" onClick={() => { setParsed(parseJobDescription(description, jobLink)); setExtracted(true); }} disabled={!description.trim()}><SearchCheck size={18} />Extract details</button>
      </section>
      <form action={action} className="review-card">
        <div className="step-label">Step 2</div><h2>Review and save</h2><p>{extracted ? "Check the extracted details and fill any gaps." : "Extract details to pre-fill this form."}</p>
        <input type="hidden" name="jobLink" value={jobLink} /><input type="hidden" name="jobDescription" value={description} />
        <div className="form-grid compact-grid">
          <label className="field"><span>Company name</span><input name="companyName" value={parsed.companyName} onChange={(e) => update("companyName", e.target.value)} required /></label>
          <label className="field"><span>Job title</span><input name="jobTitle" value={parsed.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} required /></label>
          <label className="field"><span>Location</span><input name="location" value={parsed.location} onChange={(e) => update("location", e.target.value)} /></label>
          <label className="field"><span>Salary range</span><input name="salaryRange" value={parsed.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} /></label>
          <label className="field"><span>Employment type</span><select name="employmentType" value={parsed.employmentType} onChange={(e) => update("employmentType", e.target.value)}><option value="">Not specified</option>{EMPLOYMENT_TYPES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Work arrangement</span><select name="workArrangement" value={parsed.workArrangement} onChange={(e) => update("workArrangement", e.target.value)}><option value="">Not specified</option>{WORK_ARRANGEMENTS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Source platform</span><select name="sourcePlatform" value={parsed.sourcePlatform} onChange={(e) => update("sourcePlatform", e.target.value)}><option value="">Not specified</option>{SOURCE_PLATFORMS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Career category</span><select name="careerCategory" defaultValue="Other">{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Status</span><select name="status" defaultValue="Applied">{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Application date</span><input name="applicationDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
          <label className="field"><span>Closing date</span><input name="closingDate" type="date" value={parsed.closingDate} onChange={(e) => update("closingDate", e.target.value)} /></label>
          <label className="field"><span>Next follow-up</span><input name="nextFollowUpDate" type="date" /></label>
          <label className="field"><span>Resume version</span><select name="resumeVersionId"><option value="">None</option>{resumes.map((x) => <option value={x.id} key={x.id}>{x.name}</option>)}</select></label>
          <label className="field field-wide"><span>Key skills</span><input name="keySkills" value={parsed.keySkills.join(", ")} onChange={(e) => update("keySkills", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></label>
          <label className="field field-wide"><span>Notes</span><textarea name="notes" rows={3} /></label>
          <label className="field field-wide"><span>Cover letter used for this application</span><textarea name="coverLetterText" rows={10} placeholder="Paste the final cover letter submitted for this role..." /></label>
          <label className="field field-wide"><span>Cover letter notes</span><textarea name="coverLetterNotes" rows={3} placeholder="What did you emphasise? What would you improve next time?" /></label>
        </div>
        {parsed.confidenceNotes.length > 0 && <div className="parser-notes"><ClipboardPaste size={16} /><span>{parsed.confidenceNotes.join(" ")}</span></div>}
        <button className="button button-dark button-wide" disabled={!extracted}>Save application</button>
      </form>
    </div>
  );
}
