import assert from "node:assert/strict";
import test from "node:test";
import { parseJobDescription } from "./parser";

test("extracts a labelled company name", () => {
  const result = parseJobDescription("Job title: IT Support Officer\nCompany: Northstar Health\nLocation: Melbourne VIC");
  assert.equal(result.companyName, "Northstar Health");
});

test("extracts a SEEK-style company name below the title", () => {
  const result = parseJobDescription("Service Desk Analyst\nTalent International\nMelbourne VIC\nFull time");
  assert.equal(result.companyName, "Talent International");
});

test("extracts a LinkedIn-style company name from a combined line", () => {
  const result = parseJobDescription("Junior Web Developer\nCloudbase Systems · Sydney NSW · Hybrid\nAbout the job");
  assert.equal(result.companyName, "Cloudbase Systems");
});

test("does not mistake location or employment type for a company", () => {
  const result = parseJobDescription("Customer Service Officer\nSydney NSW\nFull-time\nAbout the role");
  assert.equal(result.companyName, "");
});
