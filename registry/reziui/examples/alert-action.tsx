import { CircleXIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/reziui/ui/alert";
import { Button } from "@/registry/reziui/ui/button";

export default function AlertActionDemo() {
  return (
    <Alert variant="destructive" className="max-w-xl">
      <CircleXIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>Update your card to keep the project online.</AlertDescription>
      <AlertAction>
        <Button variant="secondary" size="sm">
          Update
        </Button>
      </AlertAction>
    </Alert>
  );
}
