import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import { hashPassword } from "./utils/password.js";
import { toCourseSlug } from "./utils/courseSlug.js";
import { buildCourseDetailPayload } from "./data/courseSeedTemplates.js";

dotenv.config();

const seedCourses = [
  { name: "LAW", category: "UG Programs", subCategory: "" },
  { name: "CLAT", category: "UG Programs", subCategory: "" },
  { name: "AILET", category: "UG Programs", subCategory: "" },
  { name: "SLAT", category: "UG Programs", subCategory: "" },
  { name: "MHCET", category: "UG Programs", subCategory: "" },
  { name: "IPM Indore", category: "IPMAT Programs", subCategory: "" },
  { name: "IPM Rohtak", category: "IPMAT Programs", subCategory: "" },
  { name: "JIPMAT", category: "IPMAT Programs", subCategory: "" },
  { name: "SET", category: "IPMAT Programs", subCategory: "" },
  { name: "NPAT", category: "IPMAT Programs", subCategory: "" },
  { name: "CHRIST", category: "IPMAT Programs", subCategory: "" },
  { name: "CUET", category: "Other UG Courses", subCategory: "" },
  { name: "BBA/HM", category: "Other UG Courses", subCategory: "" },
  { name: "CAT", category: "PG Courses", subCategory: "" },
  { name: "IIFT", category: "PG Courses", subCategory: "" },
  { name: "XAT", category: "PG Courses", subCategory: "" },
  { name: "SNAP", category: "PG Courses", subCategory: "" },
  { name: "NMAT", category: "PG Courses", subCategory: "" },
  { name: "CMAT", category: "PG Courses", subCategory: "" },
  { name: "RBI Assistant", category: "Government Jobs", subCategory: "Banking" },
  { name: "SBI", category: "Government Jobs", subCategory: "Banking" },
  { name: "IBPS PO", category: "Government Jobs", subCategory: "Banking" },
  { name: "IBPS RRB", category: "Government Jobs", subCategory: "Banking" },
  { name: "LIC", category: "Government Jobs", subCategory: "Banking" },
  { name: "SSC CGL", category: "Government Jobs", subCategory: "SSC" },
  { name: "SSC CHSL", category: "Government Jobs", subCategory: "SSC" },
  { name: "SSC Selection Post (Phase X)", category: "Government Jobs", subCategory: "SSC" },
  { name: "FCI", category: "Government Jobs", subCategory: "SSC" },
];

const resultImages = [
  "/students/result-1.webp",
  "/students/result-2.webp",
  "/students/result-3.webp",
  "/students/result-4.webp",
  "/students/result-5.webp",
  "/students/result-6.webp",
];

const testimonialImages = [
  "/students/testimonial-1.webp",
  "/students/testimonial-2.webp",
  "/students/testimonial-3.webp",
  "/students/testimonial-4.webp",
  "/students/testimonial-5.webp",
  "/students/testimonial-6.webp",
];

const seedResults = [
  {
    studentName: "Rahul Sharma",
    exam: "CLAT",
    score: "AIR 128",
    year: "2025",
    imageUrl: resultImages[0],
    status: "Published",
  },
  {
    studentName: "Priya Verma",
    exam: "CAT",
    score: "99.2 percentile",
    year: "2025",
    imageUrl: resultImages[1],
    status: "Published",
  },
  {
    studentName: "Amit Singh",
    exam: "SSC CGL",
    score: "Selected",
    year: "2024",
    imageUrl: resultImages[2],
    status: "Published",
  },
  {
    studentName: "Neha Gupta",
    exam: "IPM Indore",
    score: "Shortlisted",
    year: "2025",
    imageUrl: resultImages[3],
    status: "Published",
  },
  {
    studentName: "Karan Yadav",
    exam: "IBPS PO",
    score: "Selected",
    year: "2024",
    imageUrl: resultImages[4],
    status: "Published",
  },
  {
    studentName: "Sneha Patel",
    exam: "AILET",
    score: "Rank 45",
    year: "2025",
    imageUrl: resultImages[5],
    status: "Published",
  },
];

const seedTestimonials = [
  {
    name: "Ananya Joshi",
    course: "CLAT",
    message:
      "Prep Up Gwalior helped me build strong fundamentals in legal reasoning. The mock tests and faculty support made all the difference.",
    rating: 5,
    imageUrl: testimonialImages[0],
    status: "Published",
  },
  {
    name: "Vikram Mehta",
    course: "CAT",
    message:
      "The structured batches and regular doubt sessions kept me consistent. I improved my percentile significantly within months.",
    rating: 5,
    imageUrl: testimonialImages[1],
    status: "Published",
  },
  {
    name: "Pooja Rai",
    course: "SSC CGL",
    message:
      "Excellent guidance for tier-wise preparation. Teachers focus on speed and accuracy which is exactly what SSC demands.",
    rating: 5,
    imageUrl: testimonialImages[2],
    status: "Published",
  },
  {
    name: "Rohit Agarwal",
    course: "Banking",
    message:
      "From basics to advanced mocks, everything was well planned. The banking awareness classes were especially helpful.",
    rating: 4,
    imageUrl: testimonialImages[3],
    status: "Published",
  },
  {
    name: "Meera Saxena",
    course: "IPMAT",
    message:
      "Small batch size meant personal attention. Quant and verbal both were covered deeply with great study material.",
    rating: 5,
    imageUrl: testimonialImages[4],
    status: "Published",
  },
  {
    name: "Arjun Tiwari",
    course: "CUET",
    message:
      "Friendly faculty and a motivating environment. Prep Up Gwalior is the best coaching choice in Gwalior.",
    rating: 5,
    imageUrl: testimonialImages[5],
    status: "Published",
  },
];

async function attachMissingImages() {
  const results = await prisma.result.findMany({ orderBy: { createdAt: "asc" } });
  for (let i = 0; i < results.length; i++) {
    if (!results[i].imageUrl) {
      await prisma.result.update({
        where: { id: results[i].id },
        data: { imageUrl: resultImages[i % resultImages.length] },
      });
    }
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "asc" },
  });
  for (let i = 0; i < testimonials.length; i++) {
    if (!testimonials[i].imageUrl) {
      await prisma.testimonial.update({
        where: { id: testimonials[i].id },
        data: { imageUrl: testimonialImages[i % testimonialImages.length] },
      });
    }
  }

  if (results.length || testimonials.length) {
    console.log("Result & testimonial images attached");
  }
}

async function seed() {
  const email = process.env.ADMIN_EMAIL || "admin@prepupgwalior.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "ADMIN_PASSWORD not set in .env — using default. Set ADMIN_PASSWORD in server/.env"
    );
  }

  const hashed = await hashPassword(password);
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: "Admin",
        email,
        password: hashed,
      },
    });
    console.log(`Admin created from .env: ${email}`);
  } else {
    await prisma.admin.update({
      where: { email },
      data: { password: hashed },
    });
    console.log(`Admin password synced from .env: ${email}`);
  }

  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    await prisma.course.createMany({
      data: seedCourses.map((c) => ({
        ...c,
        slug: toCourseSlug(c.name),
        status: "Published",
        ...buildCourseDetailPayload(c),
      })),
    });
    console.log("Courses seeded");
  } else {
    const renames = [
      { from: "IBPS", to: "IBPS PO" },
      { from: "Selection Phase (X)", to: "SSC Selection Post (Phase X)" },
    ];
    for (const { from, to } of renames) {
      const old = await prisma.course.findFirst({ where: { name: from } });
      const target = await prisma.course.findFirst({ where: { name: to } });
      if (old && !target) {
        await prisma.course.update({
          where: { id: old.id },
          data: { name: to, slug: toCourseSlug(to) },
        });
        console.log(`Renamed course: ${from} → ${to}`);
      }
    }

    for (const course of seedCourses) {
      const slug = toCourseSlug(course.name);
      const templateData = buildCourseDetailPayload(course);
      const existing = await prisma.course.findFirst({
        where: { name: course.name },
      });

      if (existing) {
        await prisma.course.update({
          where: { id: existing.id },
          data: {
            slug: existing.slug || slug,
            category: course.category,
            subCategory: course.subCategory || existing.subCategory,
            overview: existing.overview || templateData.overview,
            eligibility:
              !existing.eligibility || existing.eligibility === "[]" || existing.eligibility === ""
                ? templateData.eligibility
                : existing.eligibility,
            examPattern:
              !existing.examPattern || existing.examPattern === "[]" || existing.examPattern === ""
                ? templateData.examPattern
                : existing.examPattern,
            syllabus:
              !existing.syllabus || existing.syllabus === "[]" || existing.syllabus === ""
                ? templateData.syllabus
                : existing.syllabus,
            duration: existing.duration || templateData.duration,
            batchTiming: existing.batchTiming || templateData.batchTiming,
            fees:
              !existing.fees || existing.fees === "{}" || existing.fees === ""
                ? templateData.fees
                : existing.fees,
          },
        });
      } else {
        await prisma.course.create({
          data: {
            ...course,
            slug,
            status: "Published",
            ...templateData,
          },
        });
      }
    }
    console.log("Courses synced with slugs and detail templates");
  }

  const content = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!content) {
    await prisma.siteContent.create({
      data: {
        id: 1,
        about: {
          title: "Welcome to Prep Up Gwalior",
          paragraphs: [
            "We believe that education is the foundation of success. Our mission is to provide quality learning opportunities that empower students with knowledge, skills, and confidence to achieve their academic and career goals.",
            "Founded with a commitment to excellence, we offer comprehensive educational programs, expert guidance, and a student-centered learning environment. Our experienced faculty members use innovative teaching methods to ensure that every student receives personalized attention and support.",
          ],
        },
        vision: {
          title: "Our Vision",
          text: "To become a leading educational institution that inspires lifelong learning, innovation, and academic excellence.",
        },
        mission: {
          title: "Our Mission",
          items: [
            "To provide high-quality education to all learners",
            "To promote critical thinking and problem-solving skills",
            "To prepare students for competitive examinations and future careers",
            "To create a supportive and inclusive learning environment",
          ],
        },
        whyChooseUs: {
          title: "Why Choose Us",
          items: [
            "Experienced and qualified teachers",
            "Modern teaching techniques",
            "Interactive classroom sessions",
            "Regular assessments and feedback",
            "Career counseling and mentorship",
            "Affordable and accessible education",
          ],
        },
        siteInfo: {
          name: "Prep Up Gwalior",
          description:
            "Quality learning opportunities that empower students with knowledge, skills, and confidence to achieve their academic and career goals.",
        },
      },
    });
    console.log("Site content seeded");
  }

  const contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
  if (!contact) {
    await prisma.contactInfo.create({
      data: {
        id: 1,
        email: "info@prepupgwalior.com",
        phones: ["7773090664", "8878868530"],
        address: "First Floor Krishna Tower, Phoolbagh, Gwalior – 474001",
      },
    });
    console.log("Contact info seeded");
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    await prisma.settings.create({
      data: { id: 1, websiteName: "Prep Up Gwalior" },
    });
    console.log("Settings seeded");
  }

  const resultCount = await prisma.result.count();
  if (resultCount === 0) {
    await prisma.result.createMany({ data: seedResults });
    console.log("Results seeded");
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({ data: seedTestimonials });
    console.log("Testimonials seeded");
  }

  await attachMissingImages();

  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          message: "New batches starting soon — limited seats available for CLAT & CAT 2026.",
          link: "/courses",
          linkText: "View Courses",
          status: "Published",
          sortOrder: 1,
        },
      ],
    });
    console.log("Announcements seeded");
  }

  const slideCount = await prisma.resultSlide.count();
  if (slideCount === 0) {
    await prisma.resultSlide.createMany({
      data: [
        {
          studentName: "Mohit Kushwah",
          exam: "CAT 2025",
          achievement: "Final Convert",
          institute: "IIM Amritsar",
          imageUrl: "/students/achievers/mohit-kushwah.webp",
          sortOrder: 0,
          status: "Published",
        },
        {
          studentName: "Sneha Gohadiya",
          exam: "CAT 2025",
          achievement: "Final Convert",
          institute: "IIM Indore",
          imageUrl: "/students/achievers/sneha-gohadiya.webp",
          sortOrder: 1,
          status: "Published",
        },
        {
          studentName: "Manvi Gupta",
          exam: "CAT 2025",
          achievement: "Final Convert",
          institute: "IIFT Delhi",
          imageUrl: "/students/achievers/manvi-gupta.webp",
          sortOrder: 2,
          status: "Published",
        },
        {
          studentName: "Vaishnavi Singh",
          exam: "CAT 2025",
          achievement: "Final Convert",
          institute: "IIM Amritsar & IIM Nagpur",
          imageUrl: "/students/achievers/vaishnavi-singh.webp",
          sortOrder: 3,
          status: "Published",
        },
      ],
    });
    console.log("Hero achievement slides seeded");
  }

  const heroCount = await prisma.heroHighlight.count();
  if (heroCount === 0) {
    await prisma.heroHighlight.createMany({
      data: [
        { label: "UG Programs", description: "CLAT, IPMAT & more", section: "ug", status: "Published", sortOrder: 1 },
        { label: "PG Courses", description: "CAT, XAT, SNAP prep", section: "pg", status: "Published", sortOrder: 2 },
        { label: "Government Jobs", description: "SSC, Banking batches", section: "govt-jobs", status: "Published", sortOrder: 3 },
      ],
    });
    console.log("Hero highlights seeded");
  }

  await prisma.siteSeo.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      homeTitle: "Prep Up Gwalior | Premier Coaching Institute",
      homeDescription:
        "Quality coaching for CLAT, CAT, IPMAT, SSC, Banking and more in Gwalior.",
      googleRating: 4.8,
      googleReviewCount: 120,
    },
    update: {},
  });

  console.log("Seed completed");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
