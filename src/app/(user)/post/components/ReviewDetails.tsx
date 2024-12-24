"use client";

import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ReviewDetailsProps {
  title: string;
  category: string;
  description: string;
  location: string;
  thumbnailUrl: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onThumbnailUpload: (url: string, file: File) => void;
}

export function ReviewDetails({
  title,
  category,
  description,
  location,
  thumbnailUrl,
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
  onLocationChange,
  onThumbnailUpload,
}: ReviewDetailsProps) {
  const handleThumbnailUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onThumbnailUpload(reader.result as string, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Video Title</Label>
        <Input
          id="title"
          placeholder="Enter a title for your review"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="service">Services</SelectItem>
            <SelectItem value="place">Places</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your experience"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Photo</Label>
        <div
          className="border-2 border-dashed rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleThumbnailUpload(file);
            };
            input.click();
          }}
        >
          {thumbnailUrl ? (
            <div className="aspect-video relative">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload a cover photo
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Enter the location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </div>
  );
}