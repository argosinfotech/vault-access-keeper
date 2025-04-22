
import { Button } from "@/components/ui/button";

interface FormActionButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function FormActionButtons({ onCancel, isSubmitting }: FormActionButtonsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Grant Access"}
      </Button>
    </div>
  );
}
