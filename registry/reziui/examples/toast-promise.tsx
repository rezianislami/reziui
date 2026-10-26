"use client";

import { Button } from "@/registry/reziui/ui/button";
import { toast } from "@/registry/reziui/ui/toast";

// Stands in for a real request: settles after 2s.
const upload = () => new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "report.pdf" }), 2000));

export default function ToastPromise() {
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast.promise(upload(), {
          loading: "Uploading report.pdf…",
          success: (file) => `${file.name} uploaded`,
          error: "Upload failed",
        })
      }
    >
      Upload file
    </Button>
  );
}
