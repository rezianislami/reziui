import { Button } from "@/registry/ziui/ui/button";

export default function ButtonLoading() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button loading>Saving…</Button>
      <Button variant="secondary" loading>
        Loading…
      </Button>
    </div>
  );
}
