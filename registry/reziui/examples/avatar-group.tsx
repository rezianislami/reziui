import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/registry/reziui/ui/avatar";

const PEOPLE = [
  { initials: "RZ", name: "Rezi", email: "rezi.k@example.com" },
  { initials: "AL", name: "Alya", email: "alya@example.com" },
  { initials: "MK", name: "Mika", email: "mika.l@example.com" },
];

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup role="group" aria-label="Project members">
      {PEOPLE.map(({ initials, name, email }) => (
        <Avatar key={initials} role="img" aria-label={name}>
          <AvatarFallback seed={email} aria-hidden="true">
            {initials}
          </AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        +3<span className="sr-only"> more people</span>
      </AvatarGroupCount>
    </AvatarGroup>
  );
}
