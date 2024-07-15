import { toast } from "sonner";

class APIService {
  constructor() {
    this.tags = [];
    this.metadata = {};
  }

  getMetadata() {
    return this.metadata;
  }

  setMetadata(metadata) {
    this.metadata = metadata;
  }

  getTags() {
    return this.tags;
  }

  setTags(tags) {
    this.tags = tags;
  }

  addTag(tag) {
    if (!this.tags.find((t) => t.value === tag.value)) {
      this.tags.push(tag);
    } else {
      toast.warning(
        `Tag with this value already exists under label: ${
          this.tags.find((t) => t.value === tag.value).label
        }`
      );
    }
    return this.tags;
  }

  removeTag(value) {
    this.tags = this.tags.filter((tag) => tag.value !== value);
    return this.tags;
  }

  updateTag(value, updates) {
    this.tags = this.tags.map((tag) =>
      tag.value === value ? { ...tag, ...updates } : tag
    );
    return this.tags;
  }

  toggleTagActive(value) {
    this.tags = this.tags.map((tag) =>
      tag.value === value ? { ...tag, isActive: !tag.isActive } : tag
    );
    return this.tags;
  }
}

export default APIService;
