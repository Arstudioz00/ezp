"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../components/customers/data-table";
import { columns } from "../components/customers/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { Customer } from "../customer_type"; // Import the centralized type

export default function CustomersPage() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customers", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setCustomers(data);
        } else {
          console.error("Failed to load customers.");
        }
      } catch (error) {
        console.error("An unexpected error occurred.", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Link href="/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
        />
      )}
    </div>
  );
}
