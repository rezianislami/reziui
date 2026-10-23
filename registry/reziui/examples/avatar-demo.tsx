import { Avatar, AvatarFallback } from "@/registry/reziui/ui/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback seed="mika.l@example.com">MK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback seed="mika.l@example.com">MK</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback seed="mika.l@example.com">MK</AvatarFallback>
      </Avatar>
    </div>
  );
}
