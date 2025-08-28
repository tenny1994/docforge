// docs.js — BIG catalog with categories & field types
// Supported field types: text (default), textarea, date, select

const common = {
  tones: [
    { value: "polite", label: "Polite" },
    { value: "neutral", label: "Neutral" },
    { value: "firm", label: "Firm" },
    { value: "formal", label: "Formal" },
  ],
};

module.exports = {
  _meta: {
    categories: {
      government: "Government",
      business: "Business",
      general: "General",
    }
  },

  // =======================
  // GOVERNMENT
  // =======================

  gov_enquiry: {
    category: "government",
    name: "Government Enquiry Letter",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "yourAddress", label: "Your Address", required: true },
      { key: "department", label: "Department/Agency", required: true },
      { key: "topic", label: "Topic / Subject", required: true },
      { key: "reference", label: "Reference / Case # (if any)" },
      { key: "details", label: "Details of your enquiry (facts only)", type: "textarea", required: true },
      { key: "desiredOutcome", label: "What response you want", type: "textarea", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "formal" },
    ],
    system: "You are a professional correspondence writer for Australian government communications. Be clear, concise, and strictly factual. Do not provide legal advice.",
    userTemplate: ({fields}) => `
Draft a Government Enquiry Letter.

Facts:
- From: ${fields.yourName}, Address: ${fields.yourAddress}
- To department/agency: ${fields.department}
- Topic: ${fields.topic}
- Reference: ${fields.reference || "(none)"}
- Details: ${fields.details}
- Desired outcome: ${fields.desiredOutcome}
- Tone: ${fields.tone || "formal"}

Constraints:
- Structure: Opening → Background/Details → Questions/Requests → Contact & next steps → Sign-off.
- Use Australian business English. No invented facts; if missing, add [TODO: X].
- 220–380 words.
`.trim()
  },

  gov_followup: {
    category: "government",
    name: "Government Follow-Up Letter",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "department", label: "Department/Agency", required: true },
      { key: "topic", label: "Topic / Subject", required: true },
      { key: "priorDate", label: "Date of prior contact", type: "date", required: true },
      { key: "reference", label: "Reference / Case # (if any)" },
      { key: "summary", label: "Summary of what you asked previously", type: "textarea", required: true },
      { key: "desiredOutcome", label: "What you’re seeking now", type: "textarea", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "neutral" },
    ],
    system: "You write clear government follow-ups. Be courteous, specific, and action-oriented.",
    userTemplate: ({fields}) => `
Draft a Follow-Up to a government department.

Facts:
- From: ${fields.yourName}
- Department/Agency: ${fields.department}
- Topic: ${fields.topic}
- Prior contact date: ${fields.priorDate}
- Reference: ${fields.reference || "(none)"}
- Summary of prior request: ${fields.summary}
- Desired outcome now: ${fields.desiredOutcome}
- Tone: ${fields.tone || "neutral"}

Constraints:
- Structure: Reference prior contact → Restate request → Polite deadline/next steps → Contact details.
- Australian business English; 180–320 words.
`.trim()
  },

  gov_foi_request: {
    category: "government",
    name: "Freedom of Information (FOI) Request (general)",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "department", label: "Department/Agency", required: true },
      { key: "documentsSought", label: "Documents sought (be specific)", type: "textarea", required: true },
      { key: "dateRange", label: "Date range (e.g. 2024-01-01 to 2024-12-31)", required: true },
      { key: "format", label: "Preferred format (PDF/email/etc.)" },
      { key: "feePosition", label: "Fee position", default: "willing to pay reasonable fees" },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "formal" },
    ],
    system: "You write neutral FOI requests in Australian context. This is not legal advice.",
    userTemplate: ({fields}) => `
Draft a neutral FOI request.

Facts:
- Applicant: ${fields.yourName}
- Agency: ${fields.department}
- Documents sought: ${fields.documentsSought}
- Date range: ${fields.dateRange}
- Preferred format: ${fields.format || "(no preference stated)"}
- Fees: ${fields.feePosition}
- Tone: ${fields.tone || "formal"}

Constraints:
- Structure: Intro → Scope of documents → Date range → Format → Fees → Closing.
- Be precise and courteous. 180–300 words.
`.trim()
  },

  tenancy_remedy: {
    category: "government",
    name: "Tenancy Notice to Remedy Breach",
    fields: [
      { key: "landlordName", label: "Landlord/Agent name", required: true },
      { key: "tenantName", label: "Tenant name", required: true },
      { key: "property", label: "Property address", required: true },
      { key: "breach", label: "Breach (facts only)", type: "textarea", required: true },
      { key: "requestedRemedy", label: "Requested remedy", required: true },
      { key: "remedyBy", label: "Remedy by (YYYY-MM-DD)", type: "date", required: true }
    ],
    system: "You are a neutral property correspondence writer (not legal advice).",
    userTemplate: ({fields}) => `
Draft a **Notice to Remedy Breach**.

Facts:
- Landlord/Agent: ${fields.landlordName}
- Tenant: ${fields.tenantName}
- Property: ${fields.property}
- Breach: ${fields.breach}
- Remedy required by: ${fields.remedyBy}
- Requested remedy: ${fields.requestedRemedy}

Constraints:
- Neutral, factual tone; no legal threats or advice.
- Sections: Purpose → Details → Remedy request → Next steps → Contact.
- 200–350 words.
`.trim()
  },

  // =======================
  // BUSINESS
  // =======================

  biz_quote_request: {
    category: "business",
    name: "Request for Quotation (RFQ)",
    fields: [
      { key: "yourName", label: "Your Name/Company", required: true },
      { key: "recipient", label: "Supplier/Company", required: true },
      { key: "requirements", label: "What you need (specs/quantity/etc.)", type: "textarea", required: true },
      { key: "deadline", label: "Quote deadline", type: "date", required: true },
      { key: "deliveryLocation", label: "Delivery/location (if relevant)" },
      { key: "selectionCriteria", label: "Selection criteria (price, quality, lead time…)" },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "neutral" },
    ],
    system: "You write concise, professional RFQs.",
    userTemplate: ({fields}) => `
Draft a Request for Quotation (RFQ).

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- Requirements: ${fields.requirements}
- Deadline for quote: ${fields.deadline}
- Delivery/location: ${fields.deliveryLocation || "(not specified)"}
- Selection criteria: ${fields.selectionCriteria || "(not specified)"}
- Tone: ${fields.tone || "neutral"}

Constraints:
- Structure: Context → Requirements → What to include in quote → Deadline → Contact.
- 180–300 words.
`.trim()
  },

  biz_followup_quote: {
    category: "business",
    name: "Follow-Up on Quotation Request",
    fields: [
      { key: "yourName", label: "Your Name/Company", required: true },
      { key: "recipient", label: "Supplier/Company", required: true },
      { key: "rfqDate", label: "Original RFQ date", type: "date", required: true },
      { key: "topic", label: "RFQ subject", required: true },
      { key: "nudge", label: "Specific nudge or info needed", type: "textarea", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "polite" },
    ],
    system: "You write polite, effective follow-ups.",
    userTemplate: ({fields}) => `
Draft a follow-up about a quotation.

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- RFQ date: ${fields.rfqDate}
- Subject: ${fields.topic}
- Nudge/Info needed: ${fields.nudge}
- Tone: ${fields.tone || "polite"}

Constraints:
- Be courteous; include gentle call-to-action and timeline.
- 140–240 words.
`.trim()
  },

  biz_eoi: {
    category: "business",
    name: "Expression of Interest (EOI) — General",
    fields: [
      { key: "yourName", label: "Your Name/Company", required: true },
      { key: "recipient", label: "Recipient/Organisation", required: true },
      { key: "opportunity", label: "Opportunity / Tender / Role", required: true },
      { 
  key: "valueProp", 
  label: "Topic of Discussion", 
  type: "textarea", 
  required: true,
  example: "e.g., Interest in supplying fresh produce to the school canteen" 
},

      { 
  key: "relevantExperience", 
  label: "Background or Story", 
  type: "textarea", 
  required: true,
  example: "e.g., We have been running a small garden project for 2 years supplying local markets"
},
{ 
  key: "cta", 
  label: "What would you like them to do next?", 
  required: true,
  example: "e.g., Arrange a meeting to discuss further"
},

      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "formal" },
    ],
    system: "You write confident yet concise EOIs.",
    userTemplate: ({fields}) => `
Draft an Expression of Interest (EOI).

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- Opportunity: ${fields.opportunity}
- Value proposition: ${fields.valueProp}
- Relevant experience: ${fields.relevantExperience}
- Call to action: ${fields.cta}
- Tone: ${fields.tone || "formal"}

Constraints:
- Structure: Intro → Fit & value → Experience highlights → CTA.
- 220–360 words.
`.trim()
  },

  employment_offer: {
    category: "business",
    name: "Employment Offer Letter",
    fields: [
      { key: "employerName", label: "Employer name", required: true },
      { key: "employerAddress", label: "Employer address", required: true },
      { key: "candidateName", label: "Candidate name", required: true },
      { key: "position", label: "Position title", required: true },
      { key: "startDate", label: "Start date (YYYY-MM-DD)", type: "date", required: true },
      { key: "workType", label: "Work type (Full-time/Part-time/etc.)", required: true },
      { key: "salary", label: "Salary (e.g. AUD 80,000 + super)", required: true },
      { key: "paymentFreq", label: "Payment frequency (Weekly/Fortnightly/Monthly)", required: true },
      { key: "probation", label: "Probation months", default: "6" },
      { key: "benefits", label: "Key benefits (comma-separated)" },
      { key: "conditions", label: "Conditions (comma-separated)" },
    ],
    system: "You are a professional HR letter writer. Keep it warm and precise.",
    userTemplate: ({fields}) => `
Draft an **Employment Offer Letter**.

Facts:
- Employer: ${fields.employerName}, Address: ${fields.employerAddress}
- Candidate: ${fields.candidateName}
- Role: ${fields.position}
- Start date: ${fields.startDate}, Work type: ${fields.workType}
- Salary: ${fields.salary}, Frequency: ${fields.paymentFreq}
- Probation: ${fields.probation || "6"} months
- Benefits: ${fields.benefits || "(none listed)"}
- Conditions: ${fields.conditions || "(none listed)"}

Constraints:
- No legal advice. Neutral, professional tone.
- Sections: Offer summary → Compensation → Conditions → Acceptance instructions.
- 250–450 words.
`.trim()
  },

  demand_payment: {
    category: "business",
    name: "Demand for Payment",
    fields: [
      { key: "senderName", label: "Your name/Company", required: true },
      { key: "senderAddress", label: "Your address", required: true },
      { key: "recipientName", label: "Recipient name", required: true },
      { key: "recipientAddress", label: "Recipient address", required: true },
      { key: "invoiceNumber", label: "Invoice #", required: true },
      { key: "workDescription", label: "Work/Service description", required: true },
      { key: "amount", label: "Amount (e.g. AUD 2,500)", required: true },
      { key: "dueDate", label: "Original due date", type: "date", required: true },
      { key: "graceDays", label: "Grace days", default: "7" },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "firm" }
    ],
    system: "You are a professional document drafter. Write only using the facts provided.",
    userTemplate: ({fields}) => `
Write a clear, specific **Demand for Payment** letter in Australian business English.

Facts:
- Sender: ${fields.senderName}, Address: ${fields.senderAddress}
- Recipient: ${fields.recipientName}, Address: ${fields.recipientAddress}
- Invoice: ${fields.invoiceNumber} for ${fields.workDescription}
- Amount due: ${fields.amount}
- Original due date: ${fields.dueDate}
- Grace period: ${fields.graceDays || "7"} days
- Tone: ${fields.tone || "firm"}

Constraints:
- No invented facts. If something is missing, write [TODO: add X].
- Structure: Opening → Background → Payment request + deadline → Next steps (neutral) → Sign-off.
- Length target: 250–450 words.
`.trim()
  },

  // =======================
  // GENERAL
  // =======================

  general_complaint: {
    category: "general",
    name: "General Complaint Letter",
    fields: [
      { key: "senderName", label: "Your name", required: true },
      { key: "senderEmail", label: "Your email", required: true },
      { key: "recipientName", label: "Recipient/Company", required: true },
      { key: "subject", label: "Subject", required: true },
      { key: "eventDate", label: "Event date", type: "date", required: true },
      { key: "description", label: "What happened (facts)", type: "textarea", required: true },
      { key: "impact", label: "Impact on you", type: "textarea" },
      { key: "desiredOutcome", label: "Desired outcome", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "polite" }
    ],
    system: "You are a helpful but firm customer service writer.",
    userTemplate: ({fields}) => `
Write a **Complaint Letter**.

Facts:
- From: ${fields.senderName} (${fields.senderEmail})
- To: ${fields.recipientName}
- Subject: ${fields.subject}
- Event date: ${fields.eventDate}
- Description: ${fields.description}
- Impact: ${fields.impact || "(none provided)"}
- Desired outcome: ${fields.desiredOutcome}
- Tone: ${fields.tone || "polite"}

Constraints:
- Stick strictly to provided facts; if missing, add [TODO: X].
- Sections: Issue summary → Details → Impact → Requested outcome.
- 200–350 words.
`.trim()
  },

  general_enquiry: {
    category: "general",
    name: "General Enquiry to a Company",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "recipient", label: "Company/Recipient", required: true },
      { key: "subject", label: "Subject", required: true },
      { key: "details", label: "Details of your enquiry", type: "textarea", required: true },
      { key: "desiredOutcome", label: "What you’d like them to do", type: "textarea", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "polite" },
    ],
    system: "You write clear business enquiries.",
    userTemplate: ({fields}) => `
Draft a general enquiry letter/email.

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- Subject: ${fields.subject}
- Details: ${fields.details}
- Desired outcome: ${fields.desiredOutcome}
- Tone: ${fields.tone || "polite"}

Constraints:
- Friendly, succinct; clear ask and contact details.
- 150–260 words.
`.trim()
  },

  general_meeting_request: {
    category: "general",
    name: "Meeting Request",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "recipient", label: "Recipient", required: true },
      { key: "purpose", label: "Meeting purpose", type: "textarea", required: true },
      { key: "proposedDates", label: "Proposed dates/times", required: true },
      { key: "format", label: "Format", type: "select",
        options: [{value:"in-person",label:"In-person"},{value:"online",label:"Online"}], default: "online" },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "neutral" },
    ],
    system: "You write crisp meeting requests.",
    userTemplate: ({fields}) => `
Draft a meeting request.

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- Purpose: ${fields.purpose}
- Proposed dates/times: ${fields.proposedDates}
- Format: ${fields.format}
- Tone: ${fields.tone || "neutral"}

Constraints:
- Clear purpose, availability, and next step.
- 120–220 words.
`.trim()
  },

  general_extension_request: {
    category: "general",
    name: "Deadline Extension Request",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "recipient", label: "Recipient/Organisation", required: true },
      { key: "task", label: "Task / Submission / Obligation", required: true },
      { key: "dueDate", label: "Current due date", type: "date", required: true },
      { key: "reason", label: "Reason (facts only)", type: "textarea", required: true },
      { key: "newDate", label: "Requested new date", type: "date", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "polite" },
    ],
    system: "You write courteous extension requests.",
    userTemplate: ({fields}) => `
Draft a deadline extension request.

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- Task/Submission: ${fields.task}
- Current due date: ${fields.dueDate}
- Reason: ${fields.reason}
- Requested new date: ${fields.newDate}
- Tone: ${fields.tone || "polite"}

Constraints:
- Be respectful; show accountability and a clear new timeline.
- 150–240 words.
`.trim()
  },

  general_refund_request: {
    category: "general",
    name: "Refund Request",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "company", label: "Company", required: true },
      { key: "orderNumber", label: "Order/Invoice #", required: true },
      { key: "purchaseDate", label: "Purchase date", type: "date", required: true },
      { key: "issue", label: "Issue experienced (facts only)", type: "textarea", required: true },
      { key: "desiredOutcome", label: "Desired outcome (refund/replace/credit)", required: true },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "firm" },
    ],
    system: "You write firm but fair refund requests.",
    userTemplate: ({fields}) => `
Draft a refund request.

Facts:
- From: ${fields.yourName}
- Company: ${fields.company}
- Order/Invoice: ${fields.orderNumber}
- Purchase date: ${fields.purchaseDate}
- Issue: ${fields.issue}
- Desired outcome: ${fields.desiredOutcome}
- Tone: ${fields.tone || "firm"}

Constraints:
- Clear facts; polite but assertive ask.
- 150–240 words.
`.trim()
  },

  general_clarification: {
    category: "general",
    name: "Clarification Request",
    fields: [
      { key: "yourName", label: "Your Name", required: true },
      { key: "recipient", label: "Recipient/Organisation", required: true },
      { key: "subject", label: "Subject needing clarification", required: true },
      { key: "points", label: "Specific points/questions (bulleted or lines)", type: "textarea", required: true },
      { key: "deadline", label: "Preferred reply date", type: "date" },
      { key: "tone", label: "Tone", type: "select", options: common.tones, default: "neutral" },
    ],
    system: "You write structured clarification requests.",
    userTemplate: ({fields}) => `
Draft a clarification request.

Facts:
- From: ${fields.yourName}
- To: ${fields.recipient}
- Subject: ${fields.subject}
- Points/questions: ${fields.points}
- Preferred reply date: ${fields.deadline || "(not specified)"}
- Tone: ${fields.tone || "neutral"}

Constraints:
- Bullet the questions; be easy to answer.
- 140–220 words.
`.trim()
  },
};
