import { EMPLOYMENT_TYPES, SKILLS, WORK_ARRANGEMENTS } from "./constants";

export type ParsedJob = {
  companyName: string;
  jobTitle: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  sourcePlatform: string;
  keySkills: string[];
  closingDate: string;
  workArrangement: string;
  confidenceNotes: string[];
};

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const statePattern = /\b(?:VIC|NSW|QLD|SA|WA|TAS|ACT|NT)\b/i;

const companyLabels =
  /^(?:company|company name|employer|employer name|organisation|organization|hiring company)\s*[:\-]\s*/i;

const nonCompanyLine =
  /^(?:full job description|job description|about the role|about the job|the role|apply now|save job|posted|job type|location|salary|benefits|skills|requirements|qualifications|responsibilities|description|profile|overview|summary|remote|hybrid|on-?site)$/i;

function isLikelyCompanyCandidate(line: string, jobTitle: string) {
  if (!line || line.length > 100 || line.toLowerCase() === jobTitle.toLowerCase()) return false;
  if (nonCompanyLine.test(line) || statePattern.test(line)) return false;
  if (/https?:\/\/|www\.|@|\$|\d{1,2}\s+(?:day|hour|minute)s?\s+ago/i.test(line)) return false;
  if (/\b(?:full[- ]time|part[- ]time|casual|contract|temporary|per hour|per annum)\b/i.test(line)) return false;
  if (/^[\d.★]+$/.test(line) || /[.!?]$/.test(line)) return false;

  const words = line.split(/\s+/);
  return words.length >= 1 && words.length <= 10 && /[A-Za-z]/.test(line);
}

function extractCompanyName(lines: string[], jobTitle: string) {
  const labelled = lines.find((line) => companyLabels.test(line));
  if (labelled) return { value: clean(labelled.replace(companyLabels, "")), method: "labelled" };

  const titleAtCompany = jobTitle.match(/\s+(?:at|with)\s+(.+)$/i);
  if (titleAtCompany?.[1] && isLikelyCompanyCandidate(titleAtCompany[1], jobTitle)) {
    return { value: clean(titleAtCompany[1]), method: "title" };
  }

  const atCompanyLine = lines.find((line) => /^(?:at|with)\s+[^,.!?]+$/i.test(line));
  if (atCompanyLine) {
    const candidate = clean(atCompanyLine.replace(/^(?:at|with)\s+/i, ""));
    if (isLikelyCompanyCandidate(candidate, jobTitle)) return { value: candidate, method: "at-line" };
  }

  const titleIndex = lines.findIndex((line) => line === jobTitle || companyLabels.test(line));
  const candidates = lines.slice(Math.max(0, titleIndex + 1), Math.max(0, titleIndex + 1) + 5);

  for (const line of candidates) {
    // LinkedIn commonly copies "Company · Location · Work arrangement".
    const linkedInParts = line.split(/\s*[·|]\s*/).filter(Boolean);
    const candidate = linkedInParts[0];
    if (isLikelyCompanyCandidate(candidate, jobTitle)) {
      return { value: clean(candidate), method: "after-title" };
    }
  }

  return { value: "", method: "" };
}

export function detectSource(jobLink = "") {
  const link = jobLink.toLowerCase();
  if (link.includes("seek.")) return "SEEK";
  if (link.includes("indeed.")) return "Indeed";
  if (link.includes("linkedin.")) return "LinkedIn";
  return link ? "Company Website" : "";
}

export function parseJobDescription(text: string, jobLink = ""): ParsedJob {
  const lines = text.split(/\r?\n/).map(clean).filter(Boolean);
  const lower = text.toLowerCase();
  const notes: string[] = [];

  const employmentType =
    EMPLOYMENT_TYPES.find((type) => {
      const variants = [type.toLowerCase(), type.toLowerCase().replace("-", " ")];
      return variants.some((variant) => lower.includes(variant));
    }) ?? "";

  const workArrangement =
    WORK_ARRANGEMENTS.find((arrangement) => {
      const variants: Record<string, string[]> = {
        "On-site": ["on-site", "onsite", "on site"],
        Hybrid: ["hybrid"],
        Remote: ["remote", "work from home", "wfh"],
      };
      return variants[arrangement].some((variant) => lower.includes(variant));
    }) ?? "";

  const salaryPatterns = [
    /\$\s?\d{2,3}(?:,\d{3})+(?:\.\d{2})?\s*(?:-|\u2013|to)\s*\$?\s?\d{2,3}(?:,\d{3})+(?:\.\d{2})?(?:\s*(?:per annum|p\.?a\.?))?/i,
    /\$\s?\d{2,3}(?:\.\d+)?k\s*(?:-|\u2013|to)\s*\$?\s?\d{2,3}(?:\.\d+)?k/i,
    /\$\s?\d{2,3}(?:\.\d{2})?\s*(?:per|an?)\s*(?:hour|hr)/i,
    /\$\s?\d{2,3}(?:,\d{3})+(?:\.\d{2})?(?:\s*(?:per annum|p\.?a\.?))?/i,
    /\$\s?\d{2,3}(?:\.\d+)?k/i,
  ];
  const salaryRange = salaryPatterns.map((pattern) => text.match(pattern)?.[0]).find(Boolean) ?? "";

  const locationLine = lines.find(
    (line) =>
      /(?:location|based in|located in)\s*[:\-]/i.test(line) ||
      (statePattern.test(line) && line.length < 80),
  );
  const location = locationLine
    ? clean(locationLine.replace(/^(?:location|based in|located in)\s*[:\-]\s*/i, ""))
    : "";

  const titleLabel = lines.find((line) => /^job title\s*[:\-]/i.test(line));
  const jobTitle = titleLabel
    ? clean(titleLabel.replace(/^job title\s*[:\-]\s*/i, ""))
    : lines[0]?.length < 80
      ? lines[0]
      : "";

  const company = extractCompanyName(lines, jobTitle);

  const keySkills = SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(text);
  });

  const closingMatch = text.match(
    /(?:applications?\s+close|closing date|apply by)\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
  );
  let closingDate = "";
  if (closingMatch?.[1]) {
    const parsed = new Date(closingMatch[1]);
    if (!Number.isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const day = String(parsed.getDate()).padStart(2, "0");
      closingDate = `${year}-${month}-${day}`;
    }
  }

  if (jobTitle) notes.push("Job title inferred from the first line or a labelled field.");
  if (company.value) {
    notes.push(
      company.method === "labelled"
        ? "Company name matched from a labelled field."
        : "Company name inferred from the lines immediately after the job title.",
    );
  } else {
    notes.push("Company name was not confidently detected.");
  }
  if (location) notes.push("Location matched from a labelled line or Australian state.");
  if (salaryRange) notes.push("Salary matched using a currency pattern.");

  return {
    companyName: company.value,
    jobTitle,
    location,
    salaryRange,
    employmentType,
    sourcePlatform: detectSource(jobLink),
    keySkills,
    closingDate,
    workArrangement,
    confidenceNotes: notes,
  };
}
