import { Kbd, KbdGroup } from "@/registry/reziui/ui/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>↵</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>Tab</Kbd>
      </div>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd>
      </KbdGroup>
      <p className="text-sm text-muted-foreground">
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search the docs.
      </p>
    </div>
  );
}
