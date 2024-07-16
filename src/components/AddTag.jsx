import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

function AddTag({ services }) {
  const [targetService, setTargetService] = useState(null);
  const [tag, setTag] = useState({
    value: "",
    label: "",
    icon: "bookmark",
    isActive: true,
  });

  const handleAddTag = (e) => {
    if (!targetService || !tag.value || !tag.label) {
      e.preventDefault();
      return toast.warning("You didn't fill all required fields", {
        duration: 2000,
      });
    }

    console.log(targetService.addTag(tag));
    setTag({
      value: "",
      label: "",
      icon: "bookmark",
      isActive: true,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="material-icons text-2xl">
          add_box
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
          <DialogDescription>
            Make a new tag. Tak value have to follow service-specific format.
          </DialogDescription>
        </DialogHeader>

        <Select onValueChange={(v) => setTargetService(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.getMetadata().id} value={service}>
                {service.getMetadata().name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-3 items-center gap-2 mt-4">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            placeholder="Value of tag"
            value={tag.value}
            onChange={(e) => setTag((p) => ({ ...p, value: e.target.value }))}
            className="col-span-2"
          />

          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            placeholder="Useful name"
            value={tag.label}
            onChange={(e) => setTag((p) => ({ ...p, label: e.target.value }))}
            className="col-span-2"
          />

          <Label htmlFor="icon">Icon</Label>
          <div className="relative flex col-span-2">
            <div className="material-icons absolute right-1 self-center max-w-20 truncate">
              {tag.icon}
            </div>
            <Input
              id="icon"
              placeholder="Emote or Material Icon"
              value={tag.icon}
              onChange={(e) => setTag((p) => ({ ...p, icon: e.target.value }))}
              className="max-w-full truncate"
            />
          </div>
        </div>

        <hr />
        <DialogFooter className="flex justify-between sm:justify-between">
          <button
            value={tag.value}
            className="min-w-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-foreground border-2 hover:animate-pulse p-0.5 px-1 bg-foreground/20 text-foreground"
            data-tst={tag.isActive}
          >
            <span className="material-icons mr-1">{tag.icon}</span>
            {tag.label}
          </button>

          <DialogClose asChild>
            <Button type="submit" onClick={handleAddTag}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTag;
