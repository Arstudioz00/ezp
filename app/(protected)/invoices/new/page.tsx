"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomerProjectSection } from "./components/CustomerProjectSection";
import { InvoiceDetailsSection } from "./components/InvoiceDetailsSection";
import { LineItems } from "./components/LineItems";
import { NotesSection } from "./components/NotesSection";
import { InvoiceFormValues, invoiceFormSchema } from "./types";

export default function InvoicePage() {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: "",
      customerName: "",
      projectName: "",
      invoiceDate: new Date(),
      terms: "",
      dueDate: new Date(),
      items: [{ name: "", cost: "" }],
      customerNotes: "",
      termsAndConditions: "",
      discount: "0",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value && Array.isArray(value.items)) {
        const itemsTotal = value.items.reduce((sum, item) => {
          if (item && typeof item.cost === 'string') {
            return sum + (Number(item.cost) || 0);
          }
          return sum;
        }, 0);
        setSubtotal(itemsTotal);
        const discountAmount = Number(value.discount || 0);
        setTotal(itemsTotal - discountAmount);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  function onSubmit(data: InvoiceFormValues) {
    console.log(data);
    // Handle form submission
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-8">Create Invoice</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerProjectSection form={form} />
              <InvoiceDetailsSection form={form} />
              <LineItems form={form} />

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex justify-end space-x-4 items-center">
                  <span className="font-semibold">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-end space-x-4 items-center">
                  <span className="font-semibold">Discount:</span>
                  <Input
                    type="number"
                    placeholder="Discount"
                    className="w-[150px]"
                    {...form.register("discount")}
                  />
                </div>
                <div className="flex justify-end space-x-4 items-center">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <NotesSection form={form} />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">Create Invoice</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}