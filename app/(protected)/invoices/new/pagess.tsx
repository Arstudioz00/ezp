"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  customer_id: z.string().min(1, { message: "Please select a customer" }),
  project_id: z.string().min(1, { message: "Please select a project" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  status: z.enum(["unpaid", "paid", "overdue"]),
  due_date: z.string().min(1, { message: "Due date is required" }),
});

interface Customer {
  id: number;
  name: string;
}

interface Project {
  id: number;
  project_name: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      project_id: "",
      amount: "",
      status: "unpaid",
      due_date: "",
    },
  });

  useEffect(() => {
    // Fetch customers
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    // Fetch projects for selected customer
    const fetchProjects = async () => {
      if (selectedCustomer) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/customer/${selectedCustomer}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setProjects(data);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();
  }, [selectedCustomer]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
        router.push("/invoices");
      } else {
        throw new Error("Failed to create invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCustomer(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
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
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem
                            key={project.id}
                            value={project.id.toString()}
                          >
                            {project.project_name}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create Invoice</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}