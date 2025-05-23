import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import type { Speech } from "../utils/speechService";
import axios from "axios";
import type { Rehearsal } from "../utils/rehearsalService";

function SpeechCard({ speech }: { speech: Speech }) {
  // TODO: implement later
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!speech) return null;
  const [rehearsals, setRehearsals] = useState<(Rehearsal|null)[]>([null]);

  useEffect(() => {
    const fetchRehearsals = async () => {
      const fetched: (Rehearsal | null)[] = [];

      for (const r of speech.rehearsals) {
        try {
          const response = await axios.get(`http://localhost:8000/rehearsal/${r}`);
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


  // calculate total practice time in minutes
  const totalPracticeTime =
    rehearsals.reduce(
      (total, rehearsal) => total + (rehearsal?.duration || 0),
      0,
    ) / 60; // convert seconds to minutes

  // get the first rehearsal with a video URL for the thumbnail
  const thumbnailRehearsal = rehearsals.find((r) => r?.videoUrl);

  return (
    // TODO: decide where to route this
    <NavLink
      to={`/speech/${speech.id}/summary`}
      className="hover:text-cherry rounded-lg transition-colors"
    >
      <div className="flex flex-col gap-4">
        <div className="aspect-video rounded bg-gray-200">
          {/* TODO: check file format works */}
          {thumbnailRehearsal ? (
            <img
              src={thumbnailRehearsal.videoUrl!.replace(".mp4", ".jpg")}
              alt="Speech thumbnail"
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
            <h3>{`Speech ${speech.id}`}</h3>
            <p className="text-sm text-gray-600">
              {speech.rehearsals.length} rehearsal
              {speech.rehearsals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {totalPracticeTime.toFixed(1)} minutes of practice
          </p>
        </div>
      </div>
    </NavLink>
  );
}

export default SpeechCard;
