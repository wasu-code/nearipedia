import { ChevronsUpDown } from "lucide-react";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

function TagSelector({ service }) {
  // const { metadata, toggleTagActive, getTags } = service;
  const [tags, setTags] = useState(service.getTags());
  const metadata = service.getMetadata();

  useEffect(() => {}, [tags]);

  return (
    <Collapsible className="pb-4" defaultOpen={true}>
      <CollapsibleTrigger className="text-left flex flex-row w-full align-center place-content-between">
        <div>
          <p className="small-caps font-bold">{metadata.name}</p>
          <p className="text-sm">{metadata.description}</p>
        </div>
        <ChevronsUpDown size={32} className="self-right" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex gap-2 pt-2">
        {tags.map((tag) => (
          <button
            key={tag.value}
            value={tag.value}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-foreground border-2 hover:animate-pulse p-0.5 px-1 ${
              tag.isActive
                ? "bg-foreground/20 text-foreground"
                : "bg-transparent"
            }`}
            data-tst={tag.isActive}
            onClick={() => {
              setTags(service.toggleTagActive(tag.value));
            }}
          >
            <span className="material-icons mr-1">{tag.icon}</span>
            {tag.label}
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default TagSelector;
