export const screenshotMode = process.env.VERCEL !== "1" && process.env.SCREENSHOT_MODE === "true";

export const syntheticResumes = [
  { id: "resume-product", name: "Product & Delivery", notes: null },
  { id: "resume-digital", name: "Digital Operations", notes: null },
];

export const syntheticApplications = [
  { id: "demo-1", companyName: "Northstar Digital", jobTitle: "Digital Project Coordinator", location: "Melbourne - Hybrid", careerCategory: "Digital Marketing", applicationDate: new Date("2026-07-14"), nextFollowUpDate: new Date("2026-07-20"), status: "Interview", updatedAt: new Date("2026-07-16"), resumeVersionId: "resume-product", resumeVersion: syntheticResumes[0] },
  { id: "demo-2", companyName: "Harbour Health", jobTitle: "Implementation Specialist", location: "Melbourne", careerCategory: "Customer Service", applicationDate: new Date("2026-07-11"), nextFollowUpDate: new Date("2026-07-18"), status: "Applied", updatedAt: new Date("2026-07-15"), resumeVersionId: "resume-digital", resumeVersion: syntheticResumes[1] },
  { id: "demo-3", companyName: "BrightPath Learning", jobTitle: "Operations Coordinator", location: "Remote", careerCategory: "Other", applicationDate: new Date("2026-07-08"), nextFollowUpDate: new Date("2026-07-22"), status: "Screening", updatedAt: new Date("2026-07-13"), resumeVersionId: "resume-digital", resumeVersion: syntheticResumes[1] },
  { id: "demo-4", companyName: "Civic Cloud", jobTitle: "Junior Business Analyst", location: "Melbourne - Hybrid", careerCategory: "IT Support", applicationDate: new Date("2026-07-03"), nextFollowUpDate: null, status: "Reference Check", updatedAt: new Date("2026-07-12"), resumeVersionId: "resume-product", resumeVersion: syntheticResumes[0] },
  { id: "demo-5", companyName: "Greenline Energy", jobTitle: "Customer Onboarding Specialist", location: "Richmond", careerCategory: "Customer Service", applicationDate: new Date("2026-06-27"), nextFollowUpDate: null, status: "Offer", updatedAt: new Date("2026-07-10"), resumeVersionId: "resume-digital", resumeVersion: syntheticResumes[1] },
  { id: "demo-6", companyName: "Atlas Commerce", jobTitle: "Digital Operations Assistant", location: "Southbank", careerCategory: "Other", applicationDate: new Date("2026-06-21"), nextFollowUpDate: null, status: "Rejected", updatedAt: new Date("2026-07-05"), resumeVersionId: "resume-digital", resumeVersion: syntheticResumes[1] },
];
