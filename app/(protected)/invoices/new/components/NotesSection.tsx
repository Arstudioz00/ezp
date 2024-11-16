"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "../types";
import { useState } from "react";
import { Plus } from "lucide-react";

export function NotesSection({ form }: { form: UseFormReturn<InvoiceFormValues> }) {
  const [showNotes, setShowNotes] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNotes(!showNotes)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {showNotes ? "Hide Notes" : "Add Notes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowTerms(!showTerms)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {showTerms ? "Hide Terms" : "Add Terms"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {showNotes && (
          <FormField
            control={form.control}
            name="customerNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes for the customer..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showTerms && (
          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms and Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add terms and conditions..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}