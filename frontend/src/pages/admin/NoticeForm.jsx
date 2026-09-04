import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminInput, AdminSelect, AdminTextarea, AdminCheckbox } from "@/components/admin";
import { noticeSchema } from "@/lib/schemas";

export default function NoticeForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(noticeSchema),
    defaultValues: { title: "", content: "", category: "General", pinned: false },
  });

  const submit = (data) => {
    onSubmit(data);
    reset({ title: "", content: "", category: "General", pinned: false });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="glass-elevated p-4 sm:p-5 rounded-2xl bg-background/20 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="notice-form">
      <AdminInput label="Notice Title" testId="nn-title" {...register("title")} required />
      <AdminSelect label="Category" testId="nn-cat" value={watch("category")} onValueChange={(val) => setValue("category", val)} options={[{label:"General",value:"General"},{label:"Academic",value:"Academic"},{label:"Exam",value:"Exam"},{label:"Event",value:"Event"}]} />
      <AdminTextarea label="Content" testId="nn-content" placeholder="Notice body content..." {...register("content")} required className="sm:col-span-2" />
      <AdminCheckbox label="Pin dispatch to priority index window" testId="nn-pinned" checked={watch("pinned")} onCheckedChange={(val) => setValue("pinned", val)} />
      <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 self-end cursor-pointer"><Plus size={14} className="mr-1.5" /> Post Notice</Button>
    </form>
  );
}

