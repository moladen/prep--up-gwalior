/**
 * Prep Up Gwalior — course catalogue (client requirements)
 * Categories drive tabs + section layouts on /courses and homepage.
 */

export const courseCategories = [
  {
    id: "ug",
    tabLabel: "UG",
    title: "UG Programs",
    description:
      "Foundation programs for undergraduate law entrances and related pathways.",
    icon: "scale",
    courses: [
      {
        name: "LAW",
        description: "Core law entrance foundation for aspiring NLU and law-school students.",
      },
      {
        name: "CLAT",
        description: "Complete CLAT prep for National Law Universities across India.",
      },
      {
        name: "AILET",
        description: "Focused AILET coaching for NLU Delhi aspirants.",
      },
      {
        name: "SLAT",
        description: "Symbiosis Law Admission Test prep with mocks and mentoring.",
      },
      {
        name: "MHCET",
        description: "Maharashtra CET law entrance coaching with state-focused strategy.",
      },
    ],
  },
  {
    id: "ipmat",
    tabLabel: "IPMAT",
    title: "IPMAT Programs",
    description:
      "Integrated BBA + MBA pathway coaching for top IIMs and leading institutes.",
    icon: "graduation",
    courses: [
      {
        name: "IPM Indore",
        description: "IPMAT Indore prep for IIM Indore’s five-year IPM program.",
      },
      {
        name: "IPM Rohtak",
        description: "Targeted coaching for IIM Rohtak IPM entrance.",
      },
      {
        name: "JIPMAT",
        description: "Joint IPM entrance prep for IIM Jammu and Bodh Gaya.",
      },
      {
        name: "SET",
        description: "Symbiosis Entrance Test prep for undergraduate management seats.",
      },
      {
        name: "NPAT",
        description: "NMIMS NPAT coaching for BBA and allied UG programs.",
      },
      {
        name: "CHRIST",
        description: "Christ University entrance prep with aptitude and interview guidance.",
      },
    ],
  },
  {
    id: "others",
    tabLabel: "Others",
    title: "Other UG Courses",
    description:
      "Additional undergraduate pathways for university and hospitality admissions.",
    icon: "sparkles",
    courses: [
      {
        name: "CUET",
        description: "CUET coaching for central university UG admissions.",
      },
      {
        name: "BBA/HM",
        description: "BBA and Hotel Management entrance prep with career guidance.",
      },
    ],
  },
  {
    id: "pg",
    tabLabel: "PG",
    title: "PG Courses",
    description:
      "MBA and postgraduate entrance programs for IIMs and top B-schools.",
    icon: "book",
    courses: [
      {
        name: "CAT",
        description: "CAT mastery across Quant, VARC and DILR for top IIMs.",
      },
      {
        name: "IIFT",
        description: "IIFT entrance prep for Delhi and Kakinada campuses.",
      },
      {
        name: "XAT",
        description: "XAT coaching with Decision Making and essay readiness.",
      },
      {
        name: "SNAP",
        description: "SNAP prep for Symbiosis MBA institutes nationwide.",
      },
      {
        name: "NMAT",
        description: "NMAT by GMAC coaching for NMIMS and partner schools.",
      },
      {
        name: "CMAT",
        description: "CMAT prep for AICTE-approved MBA and PGDM programs.",
      },
    ],
  },
  {
    id: "govt-jobs",
    tabLabel: "Government Jobs",
    title: "Government Jobs",
    description:
      "Banking and SSC programs built for competitive government recruitment.",
    icon: "briefcase",
    groups: [
      {
        id: "banking",
        title: "Banking",
        courses: [
          {
            name: "RBI Assistant",
            description: "RBI Assistant prep with reasoning, quant and English drills.",
          },
          {
            name: "SBI",
            description: "SBI PO and Clerk coaching with banking awareness focus.",
          },
          {
            name: "IBPS PO",
            description: "IBPS PO prep covering prelims, mains and interview stages.",
          },
          {
            name: "IBPS RRB",
            description: "IBPS RRB Officer and Office Assistant exam coaching.",
          },
          {
            name: "LIC",
            description: "LIC AAO and assistant exam prep with insurance awareness.",
          },
        ],
      },
      {
        id: "ssc",
        title: "SSC",
        courses: [
          {
            name: "SSC CGL",
            description: "SSC CGL tier-wise coaching for graduate-level posts.",
          },
          {
            name: "SSC CHSL",
            description: "SSC CHSL prep for LDC, JSA and DEO roles.",
          },
          {
            name: "SSC Selection Post (Phase X)",
            description: "SSC Selection Post Phase X coaching with post-wise guidance.",
          },
          {
            name: "FCI",
            description: "FCI recruitment prep for food corporation vacancies.",
          },
        ],
      },
    ],
  },
];

/** @deprecated Prefer courseCategories — kept for older imports */
export const courseSections = courseCategories.map((cat) => ({
  id: cat.id,
  title: cat.title,
  groups: cat.groups
    ? cat.groups.map((g) => ({
        id: g.id,
        title: g.title,
        courses: g.courses.map((c) => (typeof c === "string" ? c : c.name)),
      }))
    : undefined,
  courses: cat.courses
    ? cat.courses.map((c) => (typeof c === "string" ? c : c.name))
    : undefined,
}));

export function getAllCourses() {
  const courses = [];

  courseCategories.forEach((category) => {
    if (category.courses) {
      category.courses.forEach((course) => {
        const name = typeof course === "string" ? course : course.name;
        const description =
          typeof course === "string" ? "" : course.description || "";
        courses.push({
          name,
          description,
          section: category.title,
          sectionId: category.id,
          categoryId: category.id,
        });
      });
    }
    category.groups?.forEach((group) => {
      group.courses.forEach((course) => {
        const name = typeof course === "string" ? course : course.name;
        const description =
          typeof course === "string" ? "" : course.description || "";
        courses.push({
          name,
          description,
          section: category.title,
          sectionId: category.id,
          categoryId: category.id,
          group: group.title,
          groupId: group.id,
        });
      });
    });
  });

  return courses;
}

/** Highlighted programs for homepage Popular Courses */
export const popularCourseNames = [
  "CLAT",
  "CAT",
  "IPM Indore",
  "SSC CGL",
  "IBPS PO",
  "CUET",
];
