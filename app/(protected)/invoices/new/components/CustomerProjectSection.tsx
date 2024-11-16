"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "../types";
import { useEffect } from "react";

const customers = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Stark Industries" },
  { id: "3", name: "Wayne Enterprises" },
];

const projects = [
  { id: "1", name: "Website Redesign" },
  { id: "2", name: "Mobile App Development" },
  { id: "3", name: "Cloud Migration" },
];

export function CustomerProjectSection({ form }: { form: UseFormReturn<InvoiceFormValues> }) {
  // Generate invoice number when customer and project are selected
  useEffect(() => {
    const customerName = form.watch("customerName");
    const projectName = form.watch("projectName");
    
    if (customerName && projectName) {
      const selectedProject = projects.find(p => p.id === projectName);
      if (selectedProject) {
        const projectPrefix = selectedProject.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 3);
        const invoiceNumber = `INV-${projectPrefix}001`;
        form.setValue("invoiceNumber", invoiceNumber);
      }
    }
  }, [form.watch("customerName"), form.watch("projectName")]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="customerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}