import { DataTable } from "../components/invoices/data-table";
import { columns } from "../components/invoices/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    id: "PROJ001",
    name: "Website Redesign",
    customer: "Acme Corp",
    status: "in-progress",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
  },
  {
    id: "PROJ002",
    name: "Mobile App Development",
    customer: "Globex Inc",
    status: "planning",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
  },
  {
    id: "PROJ003",
    name: "Cloud Migration",
    customer: "Wayne Enterprises",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={projects} />
    </div>
  );
}