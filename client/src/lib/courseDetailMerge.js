function hasStructuredContent(items) {
  return Array.isArray(items) && items.length > 0;
}

function hasFeesData(fees) {
  if (!fees || typeof fees !== "object") return false;
  return Boolean(fees.amount || fees.label?.trim() || fees.note?.trim());
}

export function mergeCourseWithApi(staticCourse, apiCourse) {
  if (!apiCourse) return { ...staticCourse, facultyIds: [], brochureUrl: "", featuredImageUrl: "", demoVideoUrl: "" };

  const fees = hasFeesData(apiCourse.fees)
    ? {
        amount: apiCourse.fees.amount ?? null,
        label:
          apiCourse.fees.label ||
          staticCourse.fees?.label ||
          "Fee details available on enquiry",
        note:
          apiCourse.fees.note ||
          staticCourse.fees?.note ||
          "Contact us for current offers and scholarships.",
      }
    : staticCourse.fees;

  return {
    ...staticCourse,
    fullName: apiCourse.fullName?.trim() || staticCourse.fullName,
    tagline: apiCourse.tagline?.trim() || staticCourse.tagline,
    overview: apiCourse.overview?.trim() || staticCourse.overview,
    eligibility: hasStructuredContent(apiCourse.eligibility)
      ? apiCourse.eligibility
      : staticCourse.eligibility,
    examPattern: hasStructuredContent(apiCourse.examPattern)
      ? apiCourse.examPattern
      : staticCourse.examPattern,
    syllabus: hasStructuredContent(apiCourse.syllabus)
      ? apiCourse.syllabus
      : staticCourse.syllabus,
    highlights: hasStructuredContent(apiCourse.highlights)
      ? apiCourse.highlights
      : staticCourse.highlights,
    learningOutcomes: hasStructuredContent(apiCourse.learningOutcomes)
      ? apiCourse.learningOutcomes
      : staticCourse.learningOutcomes,
    faqs: hasStructuredContent(apiCourse.faqs)
      ? apiCourse.faqs
      : staticCourse.faqs,
    duration: apiCourse.duration?.trim() || staticCourse.duration,
    batchTiming: apiCourse.batchTiming?.trim() || staticCourse.batchTiming,
    fees,
    facultyIds: apiCourse.facultyIds || [],
    brochureUrl: apiCourse.brochure?.url || "",
    featuredImageUrl: apiCourse.featuredImage?.url || "",
    demoVideoUrl: apiCourse.demoVideoUrl?.trim() || "",
    exam: apiCourse.exam || staticCourse.exam,
    isFeatured: apiCourse.isFeatured,
    isPopular: apiCourse.isPopular,
    isNewBatch: apiCourse.isNewBatch,
    limitedSeats: apiCourse.limitedSeats,
    seatsRemaining: apiCourse.seatsRemaining,
  };
}
