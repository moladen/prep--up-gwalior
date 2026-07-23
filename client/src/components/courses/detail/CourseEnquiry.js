import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import CourseWhatsAppCTA from "./CourseWhatsAppCTA";

export default function CourseEnquiry({ courseName }) {
  return (
    <>
      <section id="enquire" className="scroll-mt-28 border-t border-slate-200/80 surface-muted py-16 sm:py-20">
        <Container>
          <SectionHeading
            label="Enquiry"
            title="Apply for This Course"
            description="Fill out the form and our counselors will contact you with batch details, fees, and enrollment steps."
          />
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="lg:col-span-3">
              <div className="premium-card-layered p-6 sm:p-8">
                <ContactForm defaultCourse={courseName} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <ContactInfo unified />
            </div>
          </div>
        </Container>
      </section>
      <section className="surface-white pb-16 pt-0 sm:pb-20">
        <Container>
          <CourseWhatsAppCTA courseName={courseName} />
        </Container>
      </section>
    </>
  );
}
