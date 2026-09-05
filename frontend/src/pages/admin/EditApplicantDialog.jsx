import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Save, User } from "lucide-react";
import { AdminInput } from "@/components/admin";
import { appDetailsSchema } from "@/lib/schemas";

export default function EditApplicantDialog({ open, appNo, appData, onClose, onSave }) {
  const defaults = useMemo(() => appData || { name: "", email: "", phone: "", school: "", standard: "", target_exam: "", city: "", venue: "" }, [appData]);

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(appDetailsSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, appNo, defaults, reset]);

  const submit = (data) => {
    onSave?.(appNo, data);
    onClose?.();
  };

  if (!open) return null;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DrawerContent className="z-[99999]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-lg">
            <User size={18} className="text-accent" /> Edit Applicant Identity &amp; Venue
          </DrawerTitle>
          <DrawerDescription>
            Update applicant details and assigned venue.
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit(submit)} className="px-4 pb-2 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminInput label="Full Name" placeholder="Full Name" testId={`app-name-${appNo}`} {...register("name")} />
            <AdminInput label="Email" placeholder="Email" testId={`app-email-${appNo}`} {...register("email")} />
            <AdminInput label="Phone Number" placeholder="Phone Number" testId={`app-phone-${appNo}`} {...register("phone")} />
            <AdminInput label="School / Institute" placeholder="School / Institute" testId={`app-school-${appNo}`} {...register("school")} />
            <AdminInput label="Standard / Class" placeholder="Standard / Class" testId={`app-standard-${appNo}`} {...register("standard")} />
            <AdminInput label="Target Exam" placeholder="Target Exam" testId={`app-target-${appNo}`} {...register("target_exam")} />
            <AdminInput label="City / Region" placeholder="City / Region" testId={`app-city-${appNo}`} {...register("city")} />
            <AdminInput label="Venue" placeholder="Venue (Can be custom)" testId={`app-venue-${appNo}`} className="border-emerald-500/30 bg-emerald-500/5" {...register("venue")} />
          </div>
        </form>
        <DrawerFooter className="flex-row gap-2">
          <Button type="submit" onClick={handleSubmit(submit)} className="flex-1 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer">
            <Save size={14} className="mr-1.5" /> Save Applicant Details
          </Button>
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
