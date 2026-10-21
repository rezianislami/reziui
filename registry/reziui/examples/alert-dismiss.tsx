"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";
import { Alert, AlertDescription, AlertDismiss, AlertTitle } from "@/registry/reziui/ui/alert";
import { Button } from "@/registry/reziui/ui/button";

export default function AlertDismissDemo() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Show alert again
      </Button>
    );
  }

  return (
    <Alert variant="info" className="max-w-xl">
      <SparklesIcon />
      <AlertTitle>New in Rezi UI 1.5</AlertTitle>
      <AlertDescription>Tabs, Kbd and Alert are ready to install.</AlertDescription>
      <AlertDismiss onDismiss={() => setOpen(false)} />
    </Alert>
  );
}
