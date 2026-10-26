"use client";

import { Button } from "@/registry/reziui/ui/button";
import { toast } from "@/registry/reziui/ui/toast";

export default function ToastDemo() {
  return (
    <Button
      variant="secondary"
      onClick={() => toast.success("Changes saved", { description: "Your profile is up to date." })}
    >
      Save changes
    </Button>
  );
}
