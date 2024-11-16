"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  [key: string]: any;
}

interface DataTableRowActionsProps {
  row: Row<Customer>;
  onCustomerDelete: (customerId: string) => void;
}

export function DataTableRowActions({
  row,
  onCustomerDelete,
}: DataTableRowActionsProps) {
  const customer = row.original;
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers?id=${customer.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        toast({
          title: "Error",
          content: "Failed to delete the customer.", // Replaced `description` with `content`
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        content: "Customer deleted successfully.", // Replaced `description` with `content`
      });

      onCustomerDelete(customer.id); // Trigger callback to update the parent component
      setIsDialogOpen(false); // Close the confirmation dialog
      router.refresh(); // Refresh the customer list
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        content: "An unexpected error occurred. Please try again.", // Replaced `description` with `content`
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={() => console.log("View More", customer)}>
            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            View More
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push(`/customers/${customer.id}/edit`)}
          >
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setIsDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
