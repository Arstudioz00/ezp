"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Customer } from "../../customer_type"

export const columns: ColumnDef<Customer, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("email")}
        </span>
      </div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    enableHiding: true,
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string;
      return tags ? (
        tags.split(",").map((tag) => (
          <Badge key={tag} className="mr-1">
            {tag.trim()}
          </Badge>
        ))
      ) : null;
    },
    enableHiding: true,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    enableHiding: true,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    enableHiding: true,
  },
  {
    accessorKey: "website",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Website" />
    ),
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      return website ? (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {website}
        </a>
      ) : null;
    },
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | number | Date;
      return createdAt ? new Date(createdAt).toLocaleDateString() : "N/A";
    },
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onCustomerDelete={(id) => {
          // Pass the delete function here
          console.log("Delete customer ID:", id);
        }}
      />
    ),
    enableHiding: false,
  },
];
