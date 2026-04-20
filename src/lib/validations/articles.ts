import { z } from "zod";

export const articleSchema = z.object({
  title:     z.string().min(5, "El título debe tener al menos 5 caracteres").max(200),
  slug:      z.string()
               .min(3, "El slug debe tener al menos 3 caracteres")
               .max(200)
               .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
               .optional()
               .or(z.literal("").transform(() => undefined)),
  excerpt:   z.string().max(500, "El resumen no puede superar 500 caracteres").optional()
               .or(z.literal("").transform(() => undefined)),
  content:   z.string().optional()
               .or(z.literal("").transform(() => undefined)),
  tag:       z.string().max(50).optional()
               .or(z.literal("").transform(() => undefined)),
  // --- AGREGA ESTA LÍNEA ---
  cover_url: z.string().optional().or(z.literal("").transform(() => undefined)), 
  // -------------------------
  published: z.boolean().default(false),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
