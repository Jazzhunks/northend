import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminTextarea } from "@/components/admin";
import { centerSchema } from "@/lib/schemas";

export default function CenterForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(centerSchema),
    defaultValues: { name: "", city: "", address: "", phone: "", timing: "8:00 AM – 8:00 PM", lat: 34.0837, lng: 74.7973 },
  });

  const submit = (data) => {
    onSubmit(data);
    reset({ name: "", city: "", address: "", phone: "", timing: "8:00 AM – 8:00 PM", lat: 34.0837, lng: 74.7973 });
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel="Add Station Hub" data-testid="center-form" title="New Center Hub">
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

