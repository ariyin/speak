import { NavLink } from "react-router-dom";
import type { Rehearsal } from "../utils/rehearsalService";

interface RehearsalCardProps {
  rehearsal: Rehearsal;
}

function RehearsalCard({ rehearsal }: RehearsalCardProps) {
  if (!rehearsal) return null;

  return (
    <NavLink
      to={`/rehearsal/${rehearsal.id}`}
      className="flex flex-col gap-4 rounded-lg"
    >
      <div className="aspect-video rounded bg-gray-200">
        {rehearsal.videoUrl ? (
          <img
            src={rehearsal.videoUrl.replace(".mp4", ".jpg")}
            alt="rehearsal thumbnail"
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="flex h-full w-full items-center justify-center text-gray-400">
            no video available
          </p>
        )}
      </div>
      <p className="text-sm text-gray-600">
        date | {(rehearsal.duration / 60).toFixed(1)} min
      </p>
    </NavLink>
  );
}

export default RehearsalCard;
