import {
  parseJsonField,
  stringifyJsonField,
  defaultFees,
} from "./courseFields.js";
import { toCourseSlug } from "./courseSlug.js";

export function withId(record) {
  if (!record) return record;
  const { id, ...rest } = record;
  return { ...rest, _id: id, id };
}

export function withIdList(records) {
  return records.map(withId);
}

export function serializeCourse(course) {
  if (!course) return course;
  return {
    ...withId(course),
    slug: course.slug || toCourseSlug(course.name),
    eligibility: parseJsonField(course.eligibility, []),
    examPattern: parseJsonField(course.examPattern, []),
    syllabus: parseJsonField(course.syllabus, []),
    fees: parseJsonField(course.fees, defaultFees),
    faqs: parseJsonField(course.faqs, []),
    facultyIds: parseJsonField(course.facultyIds, []),
    highlights: parseJsonField(course.highlights, []),
    learningOutcomes: parseJsonField(course.learningOutcomes, []),
    demoVideoUrl: course.demoVideoUrl || "",
    featuredImage: {
      url: course.featuredImageUrl || "",
      publicId: course.featuredImagePublicId || "",
    },
    brochure: {
      url: course.brochureUrl || "",
      publicId: course.brochurePublicId || "",
    },
  };
}

export function serializeCourses(courses) {
  return courses.map(serializeCourse);
}

export function serializeResult(record) {
  if (!record) return record;
  return {
    ...withId(record),
    image: {
      url: record.imageUrl || "",
      publicId: record.imagePublicId || "",
    },
  };
}

export function serializeResults(records) {
  return records.map(serializeResult);
}

export function serializeTestimonial(record) {
  if (!record) return record;
  return {
    ...withId(record),
    image: {
      url: record.imageUrl || "",
      publicId: record.imagePublicId || "",
    },
  };
}

export function serializeTestimonials(records) {
  return records.map(serializeTestimonial);
}

export function serializeFaculty(record) {
  if (!record) return record;
  return {
    ...withId(record),
    slug: record.slug || toCourseSlug(record.name),
    subjects: parseJsonField(record.subjects, []),
    social: parseJsonField(record.social, {}),
    image: {
      url: record.imageUrl || "",
      publicId: record.imagePublicId || "",
    },
  };
}

export function serializeFacultyList(records) {
  return records.map(serializeFaculty);
}

export function serializeBlogPost(record) {
  if (!record) return record;
  return {
    ...withId(record),
    coverImage: {
      url: record.coverImageUrl || "",
      publicId: record.coverImagePublicId || "",
    },
  };
}

export function serializeBlogPosts(records) {
  return records.map(serializeBlogPost);
}

export function serializeFaq(record) {
  return withId(record);
}

export function serializeFaqs(records) {
  return records.map(serializeFaq);
}

export function serializeAnnouncement(record) {
  return withId(record);
}

export function serializeAnnouncements(records) {
  return records.map(serializeAnnouncement);
}

export function serializeHeroHighlight(record) {
  return withId(record);
}

export function serializeHeroHighlights(records) {
  return records.map(serializeHeroHighlight);
}

export function serializeGalleryItem(record) {
  if (!record) return record;
  return {
    ...withId(record),
    image: {
      url: record.imageUrl || "",
      publicId: record.imagePublicId || "",
    },
  };
}

export function serializeGalleryItems(records) {
  return records.map(serializeGalleryItem);
}

export function serializeSuccessStory(record) {
  if (!record) return record;
  return {
    ...withId(record),
    image: {
      url: record.imageUrl || "",
      publicId: record.imagePublicId || "",
    },
  };
}

export function serializeSuccessStories(records) {
  return records.map(serializeSuccessStory);
}

export function serializeCategory(record) {
  return withId(record);
}

export function serializeCategories(records) {
  return records.map(serializeCategory);
}

export function serializeSettings(settings) {
  if (!settings) return settings;
  const base = withId(settings);
  return {
    ...base,
    logo: {
      url: settings.logoUrl || "",
      publicId: settings.logoPublicId || "",
    },
    favicon: {
      url: settings.faviconUrl || "",
      publicId: settings.faviconPublicId || "",
    },
  };
}

export function serializeContent(content) {
  return withId(content);
}

export function serializeContact(contact) {
  return withId(contact);
}

export function serializeSeo(seo) {
  return withId(seo);
}

export function serializeAdmin(admin) {
  if (!admin) return admin;
  const { password, ...safe } = admin;
  return withId(safe);
}

export function buildSearchFilter(search, fields) {
  if (!search) return {};
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    })),
  };
}

export function courseDataFromBody(body, image, brochure) {
  const name = body.name?.trim();
  return {
    name,
    slug: body.slug?.trim() || toCourseSlug(name),
    category: body.category,
    subCategory: body.subCategory || "",
    exam: body.exam || "",
    overview: body.overview || "",
    fullName: body.fullName || "",
    tagline: body.tagline || "",
    highlights: stringifyJsonField(body.highlights, "[]"),
    learningOutcomes: stringifyJsonField(body.learningOutcomes, "[]"),
    demoVideoUrl: body.demoVideoUrl || "",
    eligibility: stringifyJsonField(body.eligibility, "[]"),
    examPattern: stringifyJsonField(body.examPattern, "[]"),
    syllabus: stringifyJsonField(body.syllabus, "[]"),
    duration: body.duration || "",
    batchTiming: body.batchTiming || "",
    fees: stringifyJsonField(body.fees, JSON.stringify(defaultFees)),
    faqs: stringifyJsonField(body.faqs, "[]"),
    facultyIds: stringifyJsonField(body.facultyIds, "[]"),
    isFeatured: body.isFeatured === true || body.isFeatured === "true",
    isPopular: body.isPopular === true || body.isPopular === "true",
    isNewBatch: body.isNewBatch === true || body.isNewBatch === "true",
    limitedSeats:
      body.limitedSeats === true || body.limitedSeats === "true",
    seatsRemaining: body.seatsRemaining
      ? Number(body.seatsRemaining)
      : null,
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Draft",
    ...(body.brochureUrl ? { brochureUrl: body.brochureUrl } : {}),
    ...(image
      ? {
          featuredImageUrl: image.url,
          featuredImagePublicId: image.publicId,
        }
      : {}),
    ...(brochure
      ? {
          brochureUrl: brochure.url,
          brochurePublicId: brochure.publicId,
        }
      : {}),
  };
}
