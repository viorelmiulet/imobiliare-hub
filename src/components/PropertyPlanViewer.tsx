import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileImage, Download } from "lucide-react";

interface PropertyPlanViewerProps {
  imageUrl?: string;
  propertyName: string;
}

export const PropertyPlanViewer = ({ imageUrl, propertyName }: PropertyPlanViewerProps) => {
  const [open, setOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schita-${propertyName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!imageUrl) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
      >
        <FileImage className="h-4 w-4" />
        <span>Vezi schița</span>
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
          <DialogFooter>
            <Button
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Descarcă schița</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
