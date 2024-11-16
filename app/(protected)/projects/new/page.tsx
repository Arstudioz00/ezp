"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectFormValues, projectFormSchema } from "./types";
import { CustomerSection } from "./components/CustomerSection";
import { ProjectDetailsSection } from "./components/ProjectDetailsSection";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function ProjectPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      customerId: "",
      projectCode: "",
      description: "",
      platform: "",
      startDate: null,
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          content: "Project created successfully!",
        });
        form.reset(); // Reset the form after successful submission
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          content: errorData.message || "Failed to create project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        content: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-8">Create Project</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerSection form={form} />
              <ProjectDetailsSection form={form} />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()} // Reset the form when cancel is clicked
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
