import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminTextarea } from "@/components/admin";
import { testimonialSchema } from "@/lib/schemas";

export default function TestimonialForm({ onSubmit, initialData = null }) {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", role: "", quote: "" },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        role: initialData.role || "",
        quote: initialData.quote || "",
      });
    }
  }, [initialData, reset]);

  const submit = (data) => {
    onSubmit(data);
    if (!initialData) {
      reset({ name: "", role: "", quote: "" });
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel={initialData ? "Update Review" : "Commit Review"} data-testid="testimonial-form" title={initialData ? "Edit Testimonial" : "New Testimonial"}>
      <AdminInput label="Endorsee Full Name" testId="nt-name" {...register("name")} required />
      <AdminInput label="Role / Standing Identity" testId="nt-role" {...register("role")} required />
      <AdminTextarea label="Review Quotation" testId="nt-quote" placeholder="Verbatim review quotation string..." {...register("quote")} required className="sm:col-span-2" />
    </AdminForm>
  );
}
