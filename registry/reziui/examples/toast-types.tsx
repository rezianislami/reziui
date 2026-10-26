"use client";

import { Button } from "@/registry/reziui/ui/button";
import { toast } from "@/registry/reziui/ui/toast";

export default function ToastTypes() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="secondary" onClick={() => toast("Event created", { description: "Monday at 9:00." })}>
        Default
      </Button>
      <Button variant="secondary" onClick={() => toast.success("Changes saved")}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.info("New version available", { description: "Reload to update." })}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("Storage almost full", { description: "92% of 5 GB used." })}>
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Upload failed", {
            description: "report.pdf is over 10 MB.",
            action: { label: "Retry", onClick: () => toast("Retrying…") },
          })
        }
      >
        Error
      </Button>
    </div>
  );
}
