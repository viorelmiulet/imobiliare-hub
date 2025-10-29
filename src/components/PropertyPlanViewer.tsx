import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";

interface PropertyPlanViewerProps {
  imageUrl?: string;
  propertyName: string;
}

export const PropertyPlanViewer = ({ imageUrl, propertyName }: PropertyPlanViewerProps) => {
  const [open, setOpen] = useState(false);

  if (!imageUrl) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Image className="h-4 w-4" />
        <span className="hidden sm:inline">Plan</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Plan Proprietate - {propertyName}</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <img
              src={imageUrl}
              alt={`Plan ${propertyName}`}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
