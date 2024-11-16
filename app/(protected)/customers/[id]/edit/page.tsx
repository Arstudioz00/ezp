"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z
    .string()
    .optional()
    .refine((val) => val === undefined || ["Mr", "Miss", "Mrs", "Dr"].includes(val), {
      message: "Invalid title",
    }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined || val === "" || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val),
      {
        message: "Invalid email address",
      }
    ),
  phone: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || val.length >= 10, {
      message: "Phone number should have at least 10 digits",
    }),
  address: z.string().optional(),
  currency: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || ["USD", "EUR", "GBP", "INR"].includes(val), {
      message: "Invalid currency",
    }),
  website: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?$/.test(val),
      {
        message: "Invalid URL",
      }
    ),
  tags: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditCustomerPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      currency: "",
      website: "",
      tags: "",
    },
  });
  
  // Fetch the existing customer data and populate the form
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/customers?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          form.reset(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load customer data.",
            variant: "destructive",
          } as any);
          
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        } as any);
  
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, form, toast]);

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/customers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...values }),
      });
  
      if (response.ok) {
        toast({
          title: "Success",
          content: "Customer updated successfully!", // Replaced `description` with `content`
        });
        router.push("/customers");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          content: errorData.message || "Failed to update customer.", // Replaced `description` with `content`
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        content: "An unexpected error occurred.", // Replaced `description` with `content`
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Customer Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="customer@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Customer Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Currency</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., VIP, Wholesale" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating Customer..." : "Update Customer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
