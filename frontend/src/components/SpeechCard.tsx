import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Speech } from "../utils/speechService";
import { addSpeech } from "../utils/auth";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

function SpeechCard({
  speech,
  onSpeechUpdate,
}: {
  speech: Speech;
  onSpeechUpdate?: () => void;
}) {
  // TODO: implement later
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!speech) return null;
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClick = () => {
    addSpeech(speech.id);
    navigate(`/speech/${speech.id}/summary`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/speech/${speech.id}`);
      if (onSpeechUpdate) {
        onSpeechUpdate(); // refresh the speeches list
      }
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting speech:", error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="hover:text-cherry cursor-pointer rounded-lg transition-colors"
    >
      <div className="flex flex-col gap-4">
        <div className="aspect-video rounded bg-gray-200">
          {speech.thumbnailUrl ? (
            <img
              src={speech.thumbnailUrl}
              alt="speech thumbnail"
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="flex h-full w-full items-center justify-center text-gray-400">
              no video available
            </p>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3>{speech.name}</h3>
              <div onClick={(e) => e.stopPropagation()}>
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                  <DialogTrigger asChild>
                    <Trash2
                      color="gray"
                      size={16}
                      className="hover:stroke-cherry cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>delete speech</DialogTitle>
                      <DialogDescription>
                        are you sure you want to delete "{speech.name}"? this
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                      >
                        delete
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {speech.rehearsals.length} rehearsal
              {speech.rehearsals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {(speech.practiceTime / 60).toFixed(1)} minutes of practice
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpeechCard;
