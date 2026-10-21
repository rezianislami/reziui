"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/registry/reziui/ui/input";
import { Label } from "@/registry/reziui/ui/label";

export default function InputSearch() {
  const [query, setQuery] = useState("button");

  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="search-projects">Search</Label>
      <Input
        id="search-projects"
        type="search"
        placeholder="Search projects…"
        startIcon={<SearchIcon />}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
        clearLabel="Clear search"
      />
      <p className="text-xs text-muted-foreground">Search across all projects.</p>
    </div>
  );
}
