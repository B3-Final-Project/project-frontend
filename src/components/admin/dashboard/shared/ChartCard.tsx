import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactElement;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
