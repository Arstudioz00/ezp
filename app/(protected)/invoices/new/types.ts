import { z } from "zod";

export const invoiceFormSchema = z.object({
  invoiceNumber: z.string(),
  customerName: z.string().min(1, { message: "Please select a customer" }),
  projectName: z.string().min(1, { message: "Please select a project" }),
  invoiceDate: z.date(),
  terms: z.string().min(1, { message: "Please select payment terms" }),
  dueDate: z.date(),
  items: z.array(z.object({
    name: z.string().min(1, { message: "Item name is required" }),
    cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Cost must be a positive number",
    }),
  })),
  customerNotes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  discount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Discount must be a non-negative number",
  }).optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;