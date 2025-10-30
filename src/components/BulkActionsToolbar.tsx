import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Image, Calculator } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onUploadPlan: () => void;
  onSetCommission: () => void;
}

export const BulkActionsToolbar = ({
  selectedCount,
  onClearSelection,
  onUploadPlan,
  onSetCommission,
}: BulkActionsToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-xl">
      <div className="flex items-center gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">
            {selectedCount} {selectedCount === 1 ? 'proprietate selectată' : 'proprietăți selectate'}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Deselectează
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onUploadPlan}
            className="h-8"
          >
            <Image className="h-4 w-4 mr-1" />
            Încarcă Plan
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onSetCommission}
            className="h-8"
          >
            <Calculator className="h-4 w-4 mr-1" />
            Setează Comision
          </Button>
        </div>
      </div>
    </Card>
  );
};
