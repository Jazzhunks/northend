import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminTextarea, AdminChipInput, AdminCheckbox } from "@/components/admin";
import { jobSchema } from "@/lib/schemas";

export default function JobForm({ onSubmit, initialData = null }) {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { 
      title: "", 
      department: "", 
      location: "", 
      type: "Full-time", 
      description: "", 
      requirements: [], 
      active: true 
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        department: initialData.department || "",
        location: initialData.location || "",
        type: initialData.type || "Full-time",
        description: initialData.description || "",
        requirements: initialData.requirements || [],
        active: initialData.active ?? true
      });
    }
  }, [initialData, reset]);

  const submit = (data) => {
    const payload = { ...data, requirements: data.requirements.length ? data.requirements : ["Graduate"] };
    onSubmit(payload);
    if (!initialData) {
      reset({ title: "", department: "", location: "", type: "Full-time", description: "", requirements: [], active: true });
    }
  };

  return (
    <AdminForm
      onSubmit={handleSubmit(submit)}
      submitLabel={initialData ? "Update Job Opening" : "Deploy Career Index"}
      data-testid="job-form"
      title={initialData ? "Edit Job Opening" : "New Job Opening"}
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
