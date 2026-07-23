import Container from "@/components/ui/Container";
import CourseHero from "./CourseHero";
import CourseOverview from "./CourseOverview";
import CourseBulletList, { CourseLearningOutcomes } from "./CourseBulletList";
import CourseSchedule from "./CourseSchedule";
import CourseExamPattern from "./CourseExamPattern";
import CourseSyllabus from "./CourseSyllabus";
import CourseFees from "./CourseFees";
import CourseDemoVideo from "./CourseDemoVideo";
import CourseFaculty from "./CourseFaculty";
import CourseTestimonials from "./CourseTestimonials";
import CourseResults from "./CourseResults";
import CourseFAQ from "./CourseFAQ";
import RelatedCourses from "./RelatedCourses";
import CourseEnquiry from "./CourseEnquiry";
import StickyApplyBar from "./StickyApplyBar";

const NAV_ITEMS = [
  ["overview", "Overview"],
  ["eligibility", "Eligibility"],
  ["schedule", "Schedule"],
  ["fees", "Fees"],
  ["highlights", "Highlights"],
  ["outcomes", "Outcomes"],
  ["syllabus", "Syllabus"],
  ["demo", "Demo Class"],
  ["faculty", "Faculty"],
  ["testimonials", "Testimonials"],
  ["results", "Results"],
  ["faq", "FAQ"],
  ["related", "Related"],
  ["enquire", "Apply"],
];

export default function CourseDetailView({ course, relatedCourses }) {
  return (
    <>
      <CourseHero course={course} />

      <section className="section-padding surface-muted">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <nav
                className="premium-card-layered sticky top-[calc(var(--header-offset)+1rem)] space-y-0.5 p-3"
                aria-label="Course sections"
              >
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  On this page
                </p>
                {NAV_ITEMS.map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-primary-light/60 hover:text-brand-primary"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-12 lg:space-y-14">
              <CourseOverview overview={course.overview} />
              <CourseBulletList
                id="eligibility"
                label="Eligibility"
                title="Who Can Apply"
                description="Check if you meet the requirements for this program."
                items={course.eligibility}
              />
              <CourseSchedule
                duration={course.duration}
                batchTiming={course.batchTiming}
              />
              <CourseFees fees={course.fees} />
              <CourseBulletList
                id="highlights"
                label="Highlights"
                title="Course Highlights"
                description="What makes this program stand out at Prep Up Gwalior."
                items={course.highlights}
              />
              <CourseLearningOutcomes items={course.learningOutcomes} />
              <CourseExamPattern examPattern={course.examPattern} />
              <CourseSyllabus syllabus={course.syllabus} />
              <CourseDemoVideo
                videoUrl={course.demoVideoUrl}
                courseName={course.name}
              />
              <CourseFaculty
                facultyIds={course.facultyIds}
                courseName={course.name}
              />
              <CourseTestimonials courseName={course.name} />
              <CourseResults exam={course.exam} />
              <CourseFAQ faqs={course.faqs} />
              <RelatedCourses courses={relatedCourses} />
            </div>
          </div>
        </Container>
      </section>

      <CourseEnquiry courseName={course.name} />
      <StickyApplyBar
        courseName={course.name}
        brochureUrl={course.brochureUrl}
      />
    </>
  );
}
