import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { AdminInput, AdminSelect, AdminFileUpload, AdminTextarea } from "@/components/admin";
import { gallerySchema } from "@/lib/schemas";

const MEDIA_TYPES = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Text / Paragraph", value: "text" },
];

export default function GalleryForm({ onSubmit, onUpdate, editingId, galleryCategories, previewMediaUrl, mediaType, onMediaTypeChange, onMediaUrlClear }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: { title: "", description: "", media_type: "image", media_url: "", category: "", order: 0 },
  });

  const currentMediaType = watch("media_type");

  const submit = (data) => {
    const payload = { ...data, category: data.category || "Uncategorised" };
    if (!payload.media_url && payload.media_type !== "text") delete payload.media_url;
    if (editingId) {
      onUpdate?.(editingId, payload);
    } else {
      onSubmit?.(payload);
    }
    reset({ title: "", description: "", media_type: "image", media_url: "", category: "", order: 0 });
    onMediaUrlClear?.();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="glass-elevated p-4 sm:p-5 rounded-2xl bg-background/20 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="gallery-form">
      <AdminInput label="Title" testId="ng-title" {...register("title")} required />
      <AdminInput label="Category" testId="ng-category" list="gallery-categories" {...register("category")} />
      <datalist id="gallery-categories">
        {galleryCategories.map((c) => <option key={c} value={c} />)}
      </datalist>
      <AdminSelect label="Media Type" testId="ng-media-type" value={currentMediaType} onValueChange={(val) => { setValue("media_type", val); onMediaTypeChange?.(val); }} options={MEDIA_TYPES} />
      <AdminFileUpload
        label={currentMediaType === "video" ? "Upload video" : currentMediaType === "text" ? "Optional image for text post" : "Upload image"}
        testId="gallery-upload"
        accept={currentMediaType === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp"}
        onUploaded={(file) => file && setValue("media_url", file.url)}
        className="sm:col-span-2"
      />
      {previewMediaUrl && (
        <div className="sm:col-span-2">
          <div className="relative inline-block">
            {currentMediaType === "video" ? (
              <video src={previewMediaUrl} controls className="max-h-40 rounded-xl" />
            ) : (
              <img src={previewMediaUrl} alt="Preview" className="max-h-40 rounded-xl object-cover" />
            )}
            <button type="button" onClick={onMediaUrlClear} className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg cursor-pointer">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      <AdminTextarea label="Description" testId="ng-description" placeholder="Caption or paragraph text..." {...register("description")} className="sm:col-span-2" />
      <div className="sm:col-span-2 flex gap-3">
        <button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer hover:bg-primary/90 transition-colors">
          {editingId ? "Update Item" : "Add to gallery"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { reset({ title: "", description: "", media_type: "image", media_url: "", category: "", order: 0 }); onMediaUrlClear?.(); }} className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

