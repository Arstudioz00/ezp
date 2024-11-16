"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format, addDays, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "../types";
import { useEffect } from "react";

const terms = [
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "end_of_month", label: "End of Month" },
];

export function InvoiceDetailsSection({ form }: { form: UseFormReturn<InvoiceFormValues> }) {
  // Update due date when invoice date or terms change
  useEffect(() => {
    const invoiceDate = form.watch("invoiceDate");
    const selectedTerms = form.watch("terms");

    if (invoiceDate && selectedTerms) {
      let dueDate = new Date(invoiceDate);

      switch (selectedTerms) {
        case "due_on_receipt":
          dueDate = invoiceDate;
          break;
        case "net_15":
          dueDate = addDays(invoiceDate, 15);
          break;
        case "net_30":
          dueDate = addDays(invoiceDate, 30);
          break;
        case "end_of_month":
          dueDate = endOfMonth(invoiceDate);
          break;
      }

      form.setValue("dueDate", dueDate);
    }
  }, [form.watch("invoiceDate"), form.watch("terms")]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <FormField
        control={form.control}
        name="invoiceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input {...field} readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="invoiceDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Terms</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.value} value={term.value}>
                    {term.label}
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
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <Input 
                value={field.value ? format(field.value, "PPP") : ""} 
                readOnly 
                className="bg-muted"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}