<<<<<<< HEAD
=======
import { useEffect } from "react";
>>>>>>> f5d60c2be (chore: clean branch push)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminSelect, AdminFileUpload, AdminTextarea, AdminChipInput } from "@/components/admin";
import { postSchema } from "@/lib/schemas";

const slugify = (text) => {
  const str = String(text || "").trim().toLowerCase();
  const cleaned = str.replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "post";
};

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];
const VISIBILITY_OPTIONS = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

<<<<<<< HEAD
export default function BlogPostForm({ onSubmit }) {
=======
export default function BlogPostForm({ onSubmit, initial = null }) {
>>>>>>> f5d60c2be (chore: clean branch push)
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "", slug: "", excerpt: "", content: "", category: "", tags: [],
      author: "Admin", featured_image_url: "", image_alt: "", og_image_url: "",
      meta_title: "", meta_description: "", status: "draft", visibility: "public", published_at: "",
    },
  });

<<<<<<< HEAD
=======
  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title || "", slug: initial.slug || "", excerpt: initial.excerpt || "", 
        content: initial.content || "", category: initial.category || "", tags: initial.tags || [],
        author: initial.author || "Admin", featured_image_url: initial.featured_image_url || "", 
        image_alt: initial.image_alt || "", og_image_url: initial.og_image_url || "",
        meta_title: initial.meta_title || "", meta_description: initial.meta_description || "", 
        status: initial.status || "draft", visibility: initial.visibility || "public", 
        published_at: initial.published_at || "",
      });
    }
  }, [initial, reset]);

>>>>>>> f5d60c2be (chore: clean branch push)
  const submit = (data) => {
    const payload = { ...data, tags: (data.tags || []).filter(Boolean) };
    if (!payload.slug) payload.slug = slugify(payload.title);
    if (!payload.meta_title) payload.meta_title = payload.title.slice(0, 60);
    if (!payload.meta_description) payload.meta_description = payload.excerpt || payload.title.slice(0, 160);
    onSubmit(payload);
<<<<<<< HEAD
    reset({
      title: "", slug: "", excerpt: "", content: "", category: "", tags: [],
      author: "Admin", featured_image_url: "", image_alt: "", og_image_url: "",
      meta_title: "", meta_description: "", status: "draft", visibility: "public", published_at: "",
    });
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel="Save Post" data-testid="blog-post-form" title="New Blog Post">
=======
    if (!initial) {
      reset({
        title: "", slug: "", excerpt: "", content: "", category: "", tags: [],
        author: "Admin", featured_image_url: "", image_alt: "", og_image_url: "",
        meta_title: "", meta_description: "", status: "draft", visibility: "public", published_at: "",
      });
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel={initial ? "Update Post" : "Save Post"} data-testid="blog-post-form" title={initial ? "Edit Blog Post" : "New Blog Post"}>
>>>>>>> f5d60c2be (chore: clean branch push)
      <AdminInput label="Post Title" testId="np-title" {...register("title")} required />
      <AdminInput label="Slug / Permalink" testId="np-slug" className="font-mono" {...register("slug")} required />
      <AdminInput label="Category" testId="np-category" {...register("category")} />
      <AdminInput label="Author" testId="np-author" {...register("author")} />
      <AdminTextarea label="Content" testId="np-content" className="sm:col-span-2 min-h-48 font-mono" {...register("content")} required />
      <AdminTextarea label="Excerpt / Summary" testId="np-excerpt" className="sm:col-span-2" {...register("excerpt")} />
      <AdminFileUpload label="Featured image" testId="post-featured-image" accept="image/jpeg,image/png,image/webp" onUploaded={(file) => file && setValue("featured_image_url", file.url)} className="sm:col-span-2" />
      <AdminInput label="Image Alt Text" testId="np-image-alt" {...register("image_alt")} />
      <AdminInput label="OG Image URL" testId="np-og-image" {...register("og_image_url")} />
      <AdminInput label="Meta Title" testId="np-meta-title" {...register("meta_title")} />
      <AdminInput label="Meta Description" testId="np-meta-desc" {...register("meta_description")} />
      <AdminSelect label="Status" testId="np-status" value={watch("status")} onValueChange={(val) => setValue("status", val)} options={STATUS_OPTIONS} />
      <AdminSelect label="Visibility" testId="np-visibility" value={watch("visibility")} onValueChange={(val) => setValue("visibility", val)} options={VISIBILITY_OPTIONS} />
    </AdminForm>
  );
}
<<<<<<< HEAD

=======
>>>>>>> f5d60c2be (chore: clean branch push)
