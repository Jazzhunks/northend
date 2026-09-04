import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminForm, AdminInput, AdminTextarea, AdminChipInput, AdminCheckbox } from "@/components/admin";
import { jobSchema } from "@/lib/schemas";

export default function JobForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: "", department: "", location: "", type: "Full-time", description: "", requirements: [], active: true },
  });

  const submit = (data) => {
    const payload = { ...data, requirements: data.requirements.length ? data.requirements : ["Graduate"] };
    onSubmit(payload);
    reset({ title: "", department: "", location: "", type: "Full-time", description: "", requirements: [], active: true });
  };

  return (
    <AdminForm
      onSubmit={handleSubmit(submit)}
      submitLabel="Deploy Career Index"
      data-testid="job-form"
      title="New Job Opening"
    >
      <AdminInput label="Job Title" testId="nj-title" {...register("title")} required />
      <AdminInput label="Department" testId="nj-dept" {...register("department")} required />
      <AdminInput label="Location" testId="nj-loc" {...register("location")} required />
      <AdminTextarea label="Description" testId="nj-desc" className="sm:col-span-3" {...register("description")} required />
      <AdminChipInput label="Prerequisite Qualifications Requirements" testId="nj-req" value={watch("requirements")} onChange={(v) => setValue("requirements", v)} className="sm:col-span-3" />
      <AdminCheckbox label="Active / Open for applications" testId="nj-active" checked={watch("active")} onCheckedChange={(val) => setValue("active", val)} />
    </AdminForm>
  );
}

