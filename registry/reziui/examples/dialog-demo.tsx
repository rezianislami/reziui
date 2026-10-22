import { Button } from "@/registry/reziui/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/reziui/ui/dialog";
import { Input } from "@/registry/reziui/ui/input";
import { Label } from "@/registry/reziui/ui/label";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are visible to everyone on your team.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" defaultValue="Rezi" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="profile-username">Username</Label>
            <Input id="profile-username" defaultValue="@rezi" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
