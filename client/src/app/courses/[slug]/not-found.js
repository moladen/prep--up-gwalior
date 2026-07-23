import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function CourseNotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-24">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-primary-dark sm:text-4xl">
          Course Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          The course you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8">
          <Button href="/courses">Browse All Courses</Button>
        </div>
        <p className="mt-4">
          <Link href="/" className="text-sm font-medium text-accent hover:underline">
            Back to Home
          </Link>
        </p>
      </Container>
    </section>
  );
}
