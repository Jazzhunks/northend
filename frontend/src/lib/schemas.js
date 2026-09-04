import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title required"),
  category: z.string().min(1, "Category required"),
  duration: z.string().min(1, "Duration required"),
  fee: z.coerce.number().min(0),
  description: z.string().min(1, "Description required"),
  syllabus: z.array(z.string()).default([]),
  faculty: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  scholarship_available: z.boolean().default(true),
  featured: z.boolean().default(false),
  image_url: z.string().optional(),
});

export const noticeSchema = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
  category: z.string().default("General"),
  pinned: z.boolean().default(false),
});

export const jobSchema = z.object({
  title: z.string().min(1, "Title required"),
  department: z.string().min(1, "Department required"),
  location: z.string().min(1, "Location required"),
  description: z.string().min(1, "Description required"),
  requirements: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export const centerSchema = z.object({
  name: z.string().min(1, "Name required"),
  city: z.string().min(1, "City required"),
  address: z.string().min(1, "Address required"),
  phone: z.string().min(1, "Phone required"),
  timing: z.string().default("8:00 AM – 8:00 PM"),
  lat: z.coerce.number().default(34.0837),
  lng: z.coerce.number().default(74.7973),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name required"),
  role: z.string().min(1, "Role required"),
  quote: z.string().min(1, "Quote required"),
});

export const resultSchema = z.object({
  student_name: z.string().min(1, "Student name required"),
  exam: z.string().min(1, "Exam required"),
  rank: z.string().min(1, "Rank required"),
  year: z.coerce.number(),
  course: z.string().default("NEET"),
  photo_url: z.string().optional(),
  quote: z.string().optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  media_type: z.string().default("image"),
  media_url: z.string().optional(),
  category: z.string().optional(),
  order: z.coerce.number().default(0),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content required"),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().default("Admin"),
  featured_image_url: z.string().optional(),
  image_alt: z.string().optional(),
  og_image_url: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  status: z.string().default("draft"),
  visibility: z.string().default("public"),
  published_at: z.string().optional(),
});

export const campaignSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  exam_date: z.string().optional(),
  deadline: z.string().optional(),
  eligibility: z.string().optional(),
  venue: z.string().optional(),
  available_venues: z.array(z.string()).default([]),
  whatsapp_community_url: z.string().optional(),
  exam_time: z.string().default("10:00 AM"),
  total_marks: z.coerce.number().default(100),
  active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  type: z.string().default("general"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  eligible_classes: z.array(z.string()).default([]),
  time_slots: z.array(z.object({
    from_time: z.string(),
    to_time: z.string(),
    enabled: z.boolean().default(true),
  })).default([]),
});

export const appDetailsSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  school: z.string().optional(),
  standard: z.string().optional(),
  target_exam: z.string().optional(),
  city: z.string().optional(),
  venue: z.string().optional(),
});

export const resultEditorSchema = z.object({
  marks_obtained: z.union([z.string(), z.number()]),
  total_marks: z.union([z.string(), z.number()]),
  rank: z.union([z.string(), z.number()]).optional(),
  percentile: z.union([z.string(), z.number()]).optional(),
  scholarship_percentage: z.union([z.string(), z.number()]),
  remarks: z.string().optional(),
  publish: z.boolean().default(false),
});
