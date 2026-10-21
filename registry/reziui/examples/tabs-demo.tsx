import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="rounded-[0.75rem] bg-card p-5 ring ring-border">
        <p className="text-sm font-medium">Overview</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Deployments, domains and usage at a glance.</p>
      </TabsContent>
      <TabsContent value="analytics" className="rounded-[0.75rem] bg-card p-5 ring ring-border">
        <p className="text-sm font-medium">Analytics</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Requests, bandwidth and errors for the last 24 hours.</p>
      </TabsContent>
      <TabsContent value="settings" className="rounded-[0.75rem] bg-card p-5 ring ring-border">
        <p className="text-sm font-medium">Settings</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Project name, environment variables and members.</p>
      </TabsContent>
    </Tabs>
  );
}
