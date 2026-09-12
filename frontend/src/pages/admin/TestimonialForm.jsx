<<<<<<< HEAD
=======
import { useEffect } from "react";
>>>>>>> f5d60c2be (chore: clean branch push)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminTextarea } from "@/components/admin";
import { testimonialSchema } from "@/lib/schemas";

<<<<<<< HEAD
export default function TestimonialForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
=======
export default function TestimonialForm({ onSubmit, initialData = null }) {
  const { register, handleSubmit, reset } = useForm({
>>>>>>> f5d60c2be (chore: clean branch push)
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", role: "", quote: "" },
  });

<<<<<<< HEAD
  const submit = (data) => {
    onSubmit(data);
    reset({ name: "", role: "", quote: "" });
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel="Commit Review" data-testid="testimonial-form" title="New Testimonial">
=======
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
>>>>>>> f5d60c2be (chore: clean branch push)
      <AdminInput label="Endorsee Full Name" testId="nt-name" {...register("name")} required />
      <AdminInput label="Role / Standing Identity" testId="nt-role" {...register("role")} required />
      <AdminTextarea label="Review Quotation" testId="nt-quote" placeholder="Verbatim review quotation string..." {...register("quote")} required className="sm:col-span-2" />
    </AdminForm>
  );
}
<<<<<<< HEAD

=======
>>>>>>> f5d60c2be (chore: clean branch push)
