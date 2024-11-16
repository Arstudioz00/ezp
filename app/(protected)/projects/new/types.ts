"use client";

import { z } from "zod";

export const projectFormSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required" }),
  customerId: z.string().min(1, { message: "Please select a customer" }),
  projectCode: z.string().optional(),
  description: z.string().optional(),
  platform: z.string().optional(),
  startDate: z.date().optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;