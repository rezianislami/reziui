import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/registry/reziui/ui/alert";

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl gap-3">
      <Alert>
        <InfoIcon />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>New version available</AlertTitle>
        <AlertDescription>Rezi UI 1.5 adds Tabs, Kbd and Alert.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Deployment ready</AlertTitle>
        <AlertDescription>Production is serving the latest commit.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Usage at 85%</AlertTitle>
        <AlertDescription>You are close to your monthly build minutes.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleXIcon />
        <AlertTitle>Build failed</AlertTitle>
        <AlertDescription>Type error in app/page.tsx on line 12.</AlertDescription>
      </Alert>
    </div>
  );
}
