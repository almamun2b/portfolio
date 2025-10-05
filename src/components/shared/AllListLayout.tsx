"use client";

import Link from "next/link";
import * as React from "react";

import PaginationCommon from "@/components/shared/pagination-common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AllListLayoutProps {
  meta: PaginationMeta;
  children: React.ReactNode;
  title?: string;
  createHref?: string;
  createLabel?: string;
}

export default function AllListLayout({
  meta,
  children,
  title = "All Items",
  createHref,
  createLabel = "New Item",
}: AllListLayoutProps) {
  return (
    <main className="p-6">
      <Card>
        {/* Header */}
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>

          {createHref && (
            <Button asChild variant="default" size="lg">
              <Link href={createHref}>{createLabel}</Link>
            </Button>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-6">
          {children}

          {meta.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <PaginationCommon
                currentPage={meta.page}
                totalPages={meta.totalPages}
                paginationItemsToDisplay={5}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
