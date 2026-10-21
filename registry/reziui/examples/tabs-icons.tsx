import { CodeIcon, EyeIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/registry/reziui/ui/tabs";

export default function TabsIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">
            <EyeIcon />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <CodeIcon />
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team" disabled>
            Team
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
