"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../types";

const customers = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Stark Industries" },
  { id: "3", name: "Wayne Enterprises" },
];

export function CustomerSection({ form }: { form: UseFormReturn<ProjectFormValues> }) {
  return (
    <div>
      <FormField
        control={form.control}
        name="customerId"
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
    </div>
  );
}