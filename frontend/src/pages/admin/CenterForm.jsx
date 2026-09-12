<<<<<<< HEAD
=======
import { useEffect } from "react";
>>>>>>> f5d60c2be (chore: clean branch push)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminTextarea } from "@/components/admin";
import { centerSchema } from "@/lib/schemas";

<<<<<<< HEAD
export default function CenterForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
=======
export default function CenterForm({ onSubmit, initialData = null }) {
  const { register, handleSubmit, reset } = useForm({
>>>>>>> f5d60c2be (chore: clean branch push)
    resolver: zodResolver(centerSchema),
    defaultValues: { name: "", city: "", address: "", phone: "", timing: "8:00 AM – 8:00 PM", lat: 34.0837, lng: 74.7973 },
  });

<<<<<<< HEAD
  const submit = (data) => {
    onSubmit(data);
    reset({ name: "", city: "", address: "", phone: "", timing: "8:00 AM – 8:00 PM", lat: 34.0837, lng: 74.7973 });
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel="Add Station Hub" data-testid="center-form" title="New Center Hub">
=======
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        city: initialData.city || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        timing: initialData.timing || "8:00 AM – 8:00 PM",
        lat: initialData.lat ?? 34.0837,
        lng: initialData.lng ?? 74.7973,
      });
    }
  }, [initialData, reset]);

  const submit = (data) => {
    onSubmit(data);
    if (!initialData) {
      reset({ name: "", city: "", address: "", phone: "", timing: "8:00 AM – 8:00 PM", lat: 34.0837, lng: 74.7973 });
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel={initialData ? "Update Station Hub" : "Add Station Hub"} data-testid="center-form" title={initialData ? "Edit Center Hub" : "New Center Hub"}>
>>>>>>> f5d60c2be (chore: clean branch push)
      <AdminInput label="Center Hub Name" testId="nc2-name" {...register("name")} required />
      <AdminInput label="City Scope" testId="nc2-city" {...register("city")} required />
      <AdminInput label="Contact Support Line" testId="nc2-phone" className="font-mono text-xs" {...register("phone")} required />
      <AdminTextarea label="Complete Physical Address" testId="nc2-addr" className="sm:col-span-2" {...register("address")} required />
      <AdminInput label="Timing Boundaries" testId="nc2-timing" {...register("timing")} />
      <AdminInput label="Latitude" testId="nc2-lat" type="number" step="any" className="font-mono" {...register("lat", { valueAsNumber: true })} />
      <AdminInput label="Longitude" testId="nc2-lng" type="number" step="any" className="font-mono" {...register("lng", { valueAsNumber: true })} />
    </AdminForm>
  );
}
<<<<<<< HEAD

=======
>>>>>>> f5d60c2be (chore: clean branch push)
