import { Skeleton } from "@/registry/reziui/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div aria-busy="true" aria-label="Loading post" className="grid w-full max-w-70 gap-3.5 rounded-[1rem] bg-card p-4 ring ring-border">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-3 w-35" />
          <Skeleton className="h-3 w-22" />
        </div>
      </div>
      <Skeleton className="h-24" />
    </div>
  );
}
