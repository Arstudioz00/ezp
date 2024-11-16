"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentInvoices = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    status: "Paid",
    date: "Dec 21, 2023",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    status: "Pending",
    date: "Dec 21, 2023",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    status: "Paid",
    date: "Dec 20, 2023",
  },
  {
    id: "4",
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    status: "Pending",
    date: "Dec 19, 2023",
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$2,499.00",
    status: "Paid",
    date: "Dec 19, 2023",
  },
];

export function RecentInvoices() {
  return (
    <div className="space-y-8">
      {recentInvoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invoice.name}`} alt="Avatar" />
            <AvatarFallback>
              {invoice.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{invoice.name}</p>
            <p className="text-sm text-muted-foreground">{invoice.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <span className={invoice.status === "Paid" ? "text-green-500" : "text-yellow-500"}>
              {invoice.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}