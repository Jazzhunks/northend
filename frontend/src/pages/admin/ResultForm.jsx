import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminSelect, AdminFileUpload, AdminTextarea } from "@/components/admin";
import { resultSchema } from "@/lib/schemas";

const CATEGORIES = ["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

export default function ResultForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(resultSchema),
    defaultValues: { student_name: "", exam: "", rank: "", year: new Date().getFullYear(), course: "NEET", photo_url: "", quote: "" },
  });

  const submit = (data) => {
    onSubmit({ ...data, year: Number(data.year) });
    reset({ student_name: "", exam: "", rank: "", year: new Date().getFullYear(), course: "NEET", photo_url: "", quote: "" });
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel="Publish Honors Record" data-testid="result-form" title="New Honors Record">
      <AdminInput label="Student Name" testId="nr-name" {...register("student_name")} required />
      <AdminInput label="Examination Scale" testId="nr-exam" {...register("exam")} required />
      <AdminInput label="Score Rank Metric (AIR/State)" testId="nr-rank" className="text-accent font-bold" {...register("rank")} required />
      <AdminInput label="Year" testId="nr-year" type="number" className="font-mono" {...register("year", { valueAsNumber: true })} required />
      <AdminSelect label="Syllabus Track" testId="nr-course" value={watch("course")} onValueChange={(val) => setValue("course", val)} options={CATEGORIES.map((x) => ({ label: x, value: x }))} />
      <AdminFileUpload label="Portrait asset" testId="nr-photo" accept="image/jpeg,image/png,image/webp" onUploaded={(file) => file && setValue("photo_url", file.url)} className="sm:col-span-2" />
      <AdminTextarea label="Learner Reflection" testId="nr-quote" placeholder="Learner reflection quote validation string..." {...register("quote")} className="sm:col-span-2" />
    </AdminForm>
  );
}

