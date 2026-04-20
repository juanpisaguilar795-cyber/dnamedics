import { z } from "zod";

export const createAppointmentSchema = z.object({
  appointment_date: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time:       z.string().min(1).regex(/^\d{2}:\d{2}$/),
  notes:            z.string().max(500).optional(),
});

export const updateAppointmentSchema = z.object({
  status:           z.enum(["pending","confirmed","cancelled"]).optional(),
  notes:            z.string().max(500).optional(),
  appointment_date: z.string().optional(),
  start_time:       z.string().optional(),
});

export const blockSlotSchema = z.object({
  blocked_date: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time:   z.string().min(1),
  end_time:     z.string().min(1),
  reason:       z.string().max(200).optional(),
});

export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>;
export type BlockSlotData         = z.infer<typeof blockSlotSchema>;
