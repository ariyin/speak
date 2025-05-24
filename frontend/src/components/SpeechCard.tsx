import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Speech } from "../utils/speechService";
import axios from "axios";
import type { Rehearsal } from "../utils/rehearsalService";
import { addSpeech } from "../utils/auth";

function SpeechCard({ speech }: { speech: Speech }) {
  // TODO: implement later
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!speech) return null;
  const navigate = useNavigate();
  const [rehearsals, setRehearsals] = useState<(Rehearsal | null)[]>([null]);

  useEffect(() => {
    const fetchRehearsals = async () => {
      const fetched: (Rehearsal | null)[] = [];

      for (const r of speech.rehearsals) {
        try {
          const response = await axios.get(
            `http://localhost:8000/rehearsal/${r}`,
          );
          fetched.push(response.data);
        } catch (err) {
          console.warn("Failed to fetch rehearsal:", err);
          fetched.push(null); // Explicitly push null if fetch fails
        }
      }

      setRehearsals(fetched);
    };

    fetchRehearsals();
  }, [speech.rehearsals]);

  // get the first rehearsal with a video URL for the thumbnail
  const thumbnailRehearsal = rehearsals.find((r) => r?.videoUrl);

  const handleClick = () => {
    addSpeech(speech.id);
    navigate(`/speech/${speech.id}/summary`);
  };

  return (
    <div
      onClick={handleClick}
      className="hover:text-cherry cursor-pointer rounded-lg transition-colors"
    >
      <div className="flex flex-col gap-4">
        <div className="aspect-video rounded bg-gray-200">
          {thumbnailRehearsal ? (
            <img
              src={thumbnailRehearsal.videoUrl!.replace(".mp4", ".jpg")}
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
            <h3>{speech.name}</h3>
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
