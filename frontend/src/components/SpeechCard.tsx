import { useNavigate } from "react-router-dom";
import type { Speech } from "../utils/speechService";
import { addSpeech } from "../utils/auth";

function SpeechCard({ speech }: { speech: Speech }) {
  // TODO: implement later
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!speech) return null;
  const navigate = useNavigate();

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
