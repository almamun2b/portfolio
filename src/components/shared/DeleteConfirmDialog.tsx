"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  id: number;
  title: string;
  description?: string;
  itemType: "project" | "blog" | "category";
  onDelete: (id: number) => Promise<{ success: boolean; message?: string }>;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export function DeleteConfirmDialog({
  id,
  title,
  description,
  itemType,
  onDelete,
  trigger,
  disabled = false,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await onDelete(id);

      if (result.success) {
        toast.success(
          result.message ||
            `${
              itemType.charAt(0).toUpperCase() + itemType.slice(1)
            } deleted successfully!`
        );
        setOpen(false);
      } else {
        toast.error(
          result.message || `Failed to delete ${itemType}. Please try again.`
        );
      }
    } catch (error) {
      console.error(`Failed to delete ${itemType}:`, error);
      toast.error(`Failed to delete ${itemType}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={() => setOpen(true)}
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => !disabled && setOpen(true)}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {description || (
                <>
                  Are you sure you want to delete <strong>{title}</strong>?
                  <br />
                  This action cannot be undone and will permanently remove this{" "}
                  {itemType} from the system.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
