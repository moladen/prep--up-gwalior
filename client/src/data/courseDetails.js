import { getCourseEntryBySlug } from "@/lib/courseUtils";

const sharedLearningOutcomes = [
  "Master core concepts with structured classroom teaching",
  "Build exam speed and accuracy through regular practice",
  "Develop problem-solving strategies for competitive exams",
  "Gain confidence via mock tests and performance tracking",
  "Receive personalized mentorship and doubt resolution",
];

const sharedHighlights = [
  "Expert faculty with proven track record",
  "Small batch sizes for personalized attention",
  "Regular mock tests and performance analysis",
  "Doubt-solving sessions and mentorship",
  "Updated study material and current affairs",
  "Flexible batch timings to suit your schedule",
];

const sharedFaqs = (courseName) => [
  {
    question: `When do new batches for ${courseName} start?`,
    answer:
      "New batches start regularly throughout the year. Contact our team for the latest batch schedule and seat availability.",
  },
  {
    question: "Is study material included in the course fee?",
    answer:
      "Yes, comprehensive study material, practice sheets, and online resources are included as part of the program.",
  },
  {
    question: "Do you offer online and offline classes?",
    answer:
      "We offer classroom coaching at our Gwalior center along with hybrid support options. Speak with our counselors for details.",
  },
  {
    question: "How can I enroll?",
    answer:
      "Fill out the enquiry form below or visit our institute. Our team will guide you through enrollment and batch selection.",
  },
];

const templates = {
  law: {
    fullName: "Law Entrance Examination",
    tagline: "Build a strong foundation for top National Law Universities.",
    overview:
      "Our law entrance program is designed to help aspirants master legal reasoning, logical ability, English comprehension, and current affairs. With structured classroom sessions, sectional tests, and full-length mocks, students develop the speed and accuracy needed to crack competitive law exams.",
    eligibility: [
      "Candidates who have passed or are appearing in Class 12 (or equivalent)",
      "Minimum age criteria as per the respective exam notification",
      "General aptitude and interest in legal studies",
    ],
    examPattern: [
      { label: "Mode", value: "Computer-Based Test (CBT)" },
      { label: "Duration", value: "2 hours" },
      { label: "Sections", value: "English, GK, Legal Reasoning, Logical Reasoning, Quant" },
      { label: "Question Type", value: "MCQs" },
    ],
    syllabus: [
      {
        title: "English Language",
        topics: ["Reading comprehension", "Grammar and vocabulary", "Para jumbles"],
      },
      {
        title: "Current Affairs & GK",
        topics: ["National and international events", "Static GK", "Legal current affairs"],
      },
      {
        title: "Legal Reasoning",
        topics: ["Legal principles", "Fact-based reasoning", "Passage-based questions"],
      },
      {
        title: "Logical Reasoning",
        topics: ["Analytical reasoning", "Puzzles", "Syllogisms", "Series"],
      },
      {
        title: "Quantitative Techniques",
        topics: ["Basic arithmetic", "Data interpretation", "Mensuration"],
      },
    ],
    duration: "10–12 Months",
    batchTiming: "Morning: 8:00 AM – 11:00 AM | Evening: 5:00 PM – 8:00 PM",
  },
  ipmat: {
    fullName: "Integrated Program in Management Aptitude Test",
    tagline: "Your pathway to premier IIMs and management institutes.",
    overview:
      "Prepare for IPMAT and allied undergraduate management entrance exams with a focused curriculum covering quantitative ability, verbal ability, and logical reasoning. Our program blends concept building, shortcut techniques, and intensive practice for top B-school admissions.",
    eligibility: [
      "Students who have passed or are appearing in Class 12",
      "Age limit as per the respective institute's notification",
      "Strong foundation in mathematics and English recommended",
    ],
    examPattern: [
      { label: "Mode", value: "Computer-Based Test (CBT)" },
      { label: "Duration", value: "2 hours (varies by institute)" },
      { label: "Sections", value: "Quantitative Ability, Verbal Ability, Logical Reasoning" },
      { label: "Selection", value: "Written test + Personal Interview (where applicable)" },
    ],
    syllabus: [
      {
        title: "Quantitative Ability",
        topics: ["Algebra", "Number system", "Geometry", "Probability", "Data interpretation"],
      },
      {
        title: "Verbal Ability",
        topics: ["Reading comprehension", "Vocabulary", "Para completion", "Grammar"],
      },
      {
        title: "Logical Reasoning",
        topics: ["Arrangements", "Blood relations", "Coding-decoding", "Series"],
      },
    ],
    duration: "8–10 Months",
    batchTiming: "Morning: 7:30 AM – 10:30 AM | Evening: 4:30 PM – 7:30 PM",
  },
  "ug-others": {
    fullName: "Undergraduate Entrance Program",
    tagline: "Comprehensive preparation for undergraduate admissions.",
    overview:
      "This program covers domain-specific and aptitude-based preparation for undergraduate entrance examinations. Students receive concept clarity, sectional practice, and exam strategy guidance tailored to their target exam.",
    eligibility: [
      "Class 12 passed or appearing students",
      "Eligibility criteria as per the target university or exam",
    ],
    examPattern: [
      { label: "Mode", value: "Online / Offline (exam-specific)" },
      { label: "Duration", value: "Varies by examination" },
      { label: "Sections", value: "Domain aptitude, language, reasoning, and GK" },
    ],
    syllabus: [
      {
        title: "Core Aptitude",
        topics: ["Quantitative ability", "Logical reasoning", "English language"],
      },
      {
        title: "Domain Knowledge",
        topics: ["Subject-specific concepts", "Application-based questions"],
      },
      {
        title: "General Awareness",
        topics: ["Current affairs", "Static GK", "Business awareness"],
      },
    ],
    duration: "6–10 Months",
    batchTiming: "Morning & Evening batches available",
  },
  pg: {
    fullName: "Post Graduate Management Entrance",
    tagline: "Ace CAT and premier MBA entrance exams with expert guidance.",
    overview:
      "Our PG management program is built for serious MBA aspirants targeting CAT, XAT, SNAP, and other top B-school entrances. From fundamentals to advanced problem-solving, we cover QA, VARC, DILR with rigorous mocks and personalized feedback.",
    eligibility: [
      "Bachelor's degree (or final year students as per exam rules)",
      "Minimum percentage criteria as per target B-school",
      "Valid score accepted by respective institutes",
    ],
    examPattern: [
      { label: "Mode", value: "Computer-Based Test (CBT)" },
      { label: "Duration", value: "2 hours" },
      { label: "Sections", value: "VARC, DILR, QA (with sectional time limits)" },
      { label: "Marking", value: "MCQs with negative marking" },
    ],
    syllabus: [
      {
        title: "Verbal Ability & Reading Comprehension",
        topics: ["RC passages", "Para jumbles", "Summary", "Critical reasoning"],
      },
      {
        title: "Data Interpretation & Logical Reasoning",
        topics: ["Charts and tables", "Puzzles", "Games and tournaments", "Arrangements"],
      },
      {
        title: "Quantitative Ability",
        topics: ["Arithmetic", "Algebra", "Geometry", "Modern math", "Number system"],
      },
    ],
    duration: "12–18 Months",
    batchTiming: "Morning: 8:00 AM – 11:30 AM | Evening: 6:00 PM – 9:00 PM",
  },
  bank: {
    fullName: "Banking Examination Program",
    tagline: "Structured coaching for RBI, SBI, IBPS, and insurance exams.",
    overview:
      "Prepare for banking and insurance recruitment exams with section-wise coverage of reasoning, quantitative aptitude, English, and general awareness. Our approach combines speed-building drills, banking awareness modules, and full-length mock tests.",
    eligibility: [
      "Graduation (or as per specific exam notification)",
      "Age limit as prescribed by the recruiting body",
      "Computer literacy as required for online exams",
    ],
    examPattern: [
      { label: "Mode", value: "Online CBT (Prelims + Mains)" },
      { label: "Stages", value: "Preliminary, Main, Interview (where applicable)" },
      { label: "Sections", value: "Reasoning, Quant, English, GA, Descriptive (Mains)" },
    ],
    syllabus: [
      {
        title: "Reasoning Ability",
        topics: ["Puzzles", "Seating arrangement", "Syllogism", "Inequality", "Coding"],
      },
      {
        title: "Quantitative Aptitude",
        topics: ["Simplification", "DI", "Arithmetic", "Quadratic equations"],
      },
      {
        title: "English Language",
        topics: ["Reading comprehension", "Cloze test", "Error spotting", "Para jumbles"],
      },
      {
        title: "General Awareness",
        topics: ["Banking awareness", "Current affairs", "Static GK", "Economy"],
      },
    ],
    duration: "6–9 Months",
    batchTiming: "Morning: 9:00 AM – 12:00 PM | Evening: 5:00 PM – 8:00 PM",
  },
  ssc: {
    fullName: "SSC Competitive Examination Program",
    tagline: "Focused preparation for SSC CGL, CHSL, and allied exams.",
    overview:
      "Our SSC program covers the complete syllabus with emphasis on speed, accuracy, and previous-year question trends. Students benefit from tier-wise preparation, shortcut methods, and regular test series aligned with SSC exam patterns.",
    eligibility: [
      "Educational qualification as per the specific SSC notification",
      "Age limit as defined for each post and category",
      "Nationality and other criteria per official notification",
    ],
    examPattern: [
      { label: "Mode", value: "Online CBT (Tier I, II, III)" },
      { label: "Subjects", value: "Reasoning, GA, Quant, English" },
      { label: "Selection", value: "Multi-tier examination process" },
    ],
    syllabus: [
      {
        title: "General Intelligence & Reasoning",
        topics: ["Analogy", "Classification", "Series", "Matrix", "Non-verbal reasoning"],
      },
      {
        title: "General Awareness",
        topics: ["History", "Polity", "Geography", "Economy", "Science", "Current affairs"],
      },
      {
        title: "Quantitative Aptitude",
        topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "DI"],
      },
      {
        title: "English Comprehension",
        topics: ["Grammar", "Vocabulary", "Comprehension", "Error detection"],
      },
    ],
    duration: "8–12 Months",
    batchTiming: "Morning & Evening batches | Weekend batches available",
  },
};

const courseOverrides = {
  CLAT: {
    fullName: "Common Law Admission Test (CLAT)",
    tagline: "India's gateway to 24+ National Law Universities.",
    overview:
      "CLAT is the most sought-after law entrance exam in India. Our CLAT program offers rigorous training in legal reasoning, English, logical reasoning, and GK — with CLAT-specific mocks, previous-year analysis, and NLU-focused mentorship.",
  },
  CAT: {
    fullName: "Common Admission Test (CAT)",
    tagline: "Crack CAT and secure admission to IIMs and top MBA colleges.",
    overview:
      "CAT demands consistency, speed, and strategic thinking. Our CAT batch includes foundational modules, advanced workshops, 50+ mock tests, GD-PI preparation, and one-on-one mentoring for serious MBA aspirants.",
    duration: "12–18 Months (Foundation to Advanced)",
  },
  "IPM Indore": {
    fullName: "IPM Indore — IIM Indore Integrated Program",
    tagline: "Five-year integrated management program at IIM Indore.",
  },
  "SSC CGL": {
    fullName: "SSC Combined Graduate Level (CGL)",
    tagline: "Prepare for Group B and Group C posts in government departments.",
  },
  SBI: {
    fullName: "SBI PO / Clerk Examination",
    tagline: "Target State Bank of India probationary officer and clerk posts.",
  },
  "IBPS PO": {
    fullName: "IBPS PO Examination",
    tagline: "Complete preparation for IBPS Probationary Officer recruitments.",
  },
  "SSC Selection Post (Phase X)": {
    fullName: "SSC Selection Post (Phase X)",
    tagline: "Post-wise coaching for SSC Selection Post Phase X.",
  },
  LAW: {
    fullName: "Law Entrance Foundation",
    tagline: "Core law entrance foundation for NLU and law-school aspirants.",
  },
  FCI: {
    fullName: "Food Corporation of India (FCI)",
    tagline: "FCI recruitment prep for food corporation vacancies.",
  },
};

function resolveTemplateKey(entry) {
  if (entry.categoryId === "ug" || entry.sectionId === "ug") return "law";
  if (entry.categoryId === "ipmat" || entry.sectionId === "ipmat") return "ipmat";
  if (entry.categoryId === "others" || entry.sectionId === "others") return "ug-others";
  if (entry.categoryId === "pg" || entry.sectionId === "pg") return "pg";
  if (entry.groupId === "banking" || entry.groupId === "bank") return "bank";
  if (entry.groupId === "ssc") return "ssc";
  return "ug-others";
}

export function getCourseDetail(slug) {
  const entry = getCourseEntryBySlug(slug);
  if (!entry) return null;

  const templateKey = resolveTemplateKey(entry);
  const template = templates[templateKey];
  const override = courseOverrides[entry.name] || {};

  const name = entry.name;
  const fullName = override.fullName || `${name} — ${template.fullName}`;

  return {
    ...entry,
    fullName,
    tagline: override.tagline || template.tagline,
    overview: override.overview || template.overview.replace(/competitive law exams/gi, name),
    eligibility: override.eligibility || template.eligibility,
    examPattern: override.examPattern || template.examPattern,
    syllabus: override.syllabus || template.syllabus,
    highlights: override.highlights || sharedHighlights,
    learningOutcomes: override.learningOutcomes || sharedLearningOutcomes,
    duration: override.duration || template.duration,
    batchTiming: override.batchTiming || template.batchTiming,
    fees: {
      amount: override.fees?.amount ?? null,
      label: override.fees?.label ?? "Fee details available on enquiry",
      note: "Final fee structure will be updated soon. Contact us for current offers and scholarships.",
    },
    faqs: override.faqs || sharedFaqs(name),
  };
}
