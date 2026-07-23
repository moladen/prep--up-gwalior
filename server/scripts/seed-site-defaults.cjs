const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const stats = [
    {
      key: "students",
      label: "Students Trained Since 2021",
      value: 3000,
      suffix: "+",
      icon: "Users",
      sortOrder: 0,
    },
    {
      key: "programs",
      label: "Programs Offered",
      value: 27,
      suffix: "+",
      icon: "Layers",
      sortOrder: 1,
    },
    {
      key: "mentors",
      label: "Team of Experienced Mentors",
      value: 0,
      suffix: "",
      icon: "Award",
      sortOrder: 2,
    },
    {
      key: "years",
      label: "Years of Excellence in Gwalior",
      value: 5,
      suffix: "+",
      icon: "Trophy",
      sortOrder: 3,
    },
  ];

  for (const s of stats) {
    await prisma.siteStat.upsert({
      where: { key: s.key },
      create: s,
      update: s,
    });
  }

  const slideCount = await prisma.resultSlide.count();
  if (slideCount === 0) {
    const results = await prisma.result.findMany({
      take: 6,
      orderBy: { createdAt: "asc" },
    });
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      await prisma.resultSlide.create({
        data: {
          studentName: r.studentName,
          exam: r.exam,
          achievement: r.score || "Selected",
          institute: "Prep Up Gwalior",
          imageUrl: r.imageUrl || "",
          sortOrder: i,
          status: "Published",
          ctaText: "Enquiry Now",
        },
      });
    }
  }

  const nCount = await prisma.notification.count();
  if (nCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          title: "New CAT 2026 Batch Admissions Open",
          category: "Admissions",
          summary: "Limited seats for evening batch.",
          isImportant: true,
          status: "Published",
          sortOrder: 0,
        },
        {
          title: "CLAT Mock Test Series Schedule",
          category: "Exams",
          summary: "Weekly mocks every Sunday.",
          status: "Published",
          sortOrder: 1,
        },
        {
          title: "Scholarship Test for SSC & Banking",
          category: "Scholarship",
          summary: "Register at the Phoolbagh office.",
          status: "Published",
          sortOrder: 2,
        },
      ],
    });
  }

  console.log("Seeded stats, slides, notifications");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
