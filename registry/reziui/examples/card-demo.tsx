import { Button } from "@/registry/reziui/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/reziui/ui/card";
import { Input } from "@/registry/reziui/ui/input";
import { Label } from "@/registry/reziui/ui/label";

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy a new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1.5">
          <Label htmlFor="card-project-name">Project name</Label>
          <Input id="card-project-name" placeholder="my-project" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}
