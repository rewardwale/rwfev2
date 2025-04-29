import { useState } from "react";
import { deletePost } from "@/apis/profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Spinner icon

interface DeleteModalProps {
  videoId: string;
}

export default function DeleteModal({ videoId }: DeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      let res = await deletePost(videoId);
      if (res.message === "Success.") {
        toast.success("Video deleted successfully.");
        window.location.reload();
      } else {
        toast.error("Failed to delete video.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="default" className="bg-black/50">
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Do you really want to delete this video?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      
      </DialogContent>
    </Dialog>
  );
}
