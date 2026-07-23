import PageBanner from "@/components/ui/PageBanner";
import CoursesExplorer from "@/components/courses/CoursesExplorer";

export const metadata = {
  title: "Courses",
  description:
    "Explore UG, IPMAT, PG, and Government Job courses at Prep Up Gwalior — CLAT, CAT, SSC, Banking and more.",
};

export default function CoursesPage() {
  return (
    <>
      <PageBanner
        title="Courses"
        subtitle="Browse by category — UG, IPMAT, PG & Government Jobs."
      />
      <CoursesExplorer showHeading={false} />
    </>
  );
}
