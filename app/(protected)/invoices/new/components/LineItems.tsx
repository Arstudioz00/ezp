"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "../types";

export function LineItems({ form }: { form: UseFormReturn<InvoiceFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">Line Items</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", cost: "" })}
          className="ml-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-12 gap-4 items-center">
          <FormField
            control={form.control}
            name={`items.${index}.name`}
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormControl>
                  <Input placeholder="Item description" {...field} className="text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.${index}.cost`}
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormControl>
                  <Input type="number" placeholder="Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            className="col-span-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}