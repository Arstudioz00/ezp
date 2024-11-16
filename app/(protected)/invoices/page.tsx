import { DataTable } from "../components/invoices/data-table";
import { columns } from "../components/invoices/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const invoices = [
  {
    id: "INV001",
    customer: "Acme Corp",
    amount: 1250.00,
    status: "paid",
    date: "2024-01-15",
  },
  {
    id: "INV002",
    customer: "Globex Inc",
    amount: 850.00,
    status: "pending",
    date: "2024-01-16",
  },
  {
    id: "INV003",
    customer: "Wayne Enterprises",
    amount: 2340.00,
    status: "overdue",
    date: "2024-01-10",
  },
];

export default function InvoicesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <div className="flex items-center space-x-2">
          <Link href="/invoices/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={invoices} />
    </div>
  );
}