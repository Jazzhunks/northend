import { useState } from "react";
import { Save } from "lucide-react";
import { AdminForm, AdminInput, AdminSelect, AdminTextarea, AdminCheckbox, AdminChipInput } from "@/components/admin";
import { courseSchema } from "@/lib/schemas";

const CATEGORIES = ["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

const emptyCourse = {
  title: "", category: "NEET", duration: "", fee: 0, description: "",
  syllabus: [], faculty: [], features: [], scholarship_available: true, featured: false, image_url: "",
};

export default function CourseForm({ initial, onCancel, onSave, busy }) {
  const [c, setC] = useState(initial || emptyCourse);
  const submit = (e) => {
    e.preventDefault();
    const parsed = courseSchema.safeParse({ ...c, fee: Number(c.fee) });
    if (!parsed.success) return;
    onSave(parsed.data);
  };
  return (
    <AdminForm
      onSubmit={submit}
      onCancel={onCancel}
      submitLabel={initial?.id ? "Save Changes" : "Create Course"}
      busy={busy}
      data-testid="course-form"
      title={initial?.id ? "Edit Course" : "New Course"}
    >
      <AdminInput label="Course Title" testId="cf-title" value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} required />
      <AdminSelect
        label="Category"
        testId="cf-cat"
        value={c.category}
        onChange={(val) => setC({ ...c, category: val })}
        options={CATEGORIES.map((x) => ({ label: x, value: x }))}
      />
      <AdminInput label="Duration" testId="cf-dur" placeholder="Duration (e.g. 12 months)" value={c.duration} onChange={(e) => setC({ ...c, duration: e.target.value })} required />
      <AdminInput label="Fee in ₹" testId="cf-fee" placeholder="Fee in ₹" type="number" value={c.fee} onChange={(e) => setC({ ...c, fee: e.target.value })} required />
      <AdminInput label="Banner Image URL" testId="cf-img" placeholder="Banner Image URL" value={c.image_url || ""} onChange={(e) => setC({ ...c, image_url: e.target.value })} className="sm:col-span-2" />
      <AdminTextarea label="Description" testId="cf-desc" placeholder="Description details..." value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} required className="sm:col-span-2" />
      <AdminChipInput label="Syllabus Highlights" testId="cf-syllabus" value={c.syllabus || []} onChange={(v) => setC({ ...c, syllabus: v })} placeholder="e.g. Physics, Chemistry, NCERT Mastery" className="sm:col-span-2" />
      <AdminChipInput label="Faculty Members" testId="cf-faculty" value={c.faculty || []} onChange={(v) => setC({ ...c, faculty: v })} placeholder="e.g. Dr. A. Wani (Physics)" className="sm:col-span-2" />
      <AdminChipInput label="Key Features" testId="cf-features" value={c.features || []} onChange={(v) => setC({ ...c, features: v })} placeholder="e.g. Daily doubt sessions, Weekly mock tests" className="sm:col-span-2" />
      <AdminCheckbox label="Scholarship Available" testId="cf-sch" checked={c.scholarship_available} onCheckedChange={(checked) => setC({ ...c, scholarship_available: checked })} />
      <AdminCheckbox label="Featured on Home" testId="cf-feat" checked={c.featured} onCheckedChange={(checked) => setC({ ...c, featured: checked })} />
    </AdminForm>
  );
}

