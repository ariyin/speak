import { NavLink } from "react-router-dom";
import type { Rehearsal } from "../utils/rehearsalService";
import { addRehearsal } from "../utils/auth";

interface RehearsalCardProps {
  rehearsal: Rehearsal;
}

function RehearsalCard({ rehearsal }: RehearsalCardProps) {
  if (!rehearsal) return null;

  return (
    <NavLink
      to={`/rehearsal/${rehearsal.id}/saved`}
      onClick={() => addRehearsal(rehearsal.id)}
      className="group relative"
    >
      {rehearsal.thumbnailUrl ? (
        <img
          src={rehearsal.thumbnailUrl}
          alt="rehearsal thumbnail"
          className="aspect-video h-full w-full object-cover"
        />
      ) : (
        <p className="flex aspect-video w-full items-center justify-center bg-gray-200 text-gray-400">
          no video available
        </p>
      )}
      <p className="absolute bottom-4 left-4 rounded-lg bg-white px-2 py-1 text-sm">
        {rehearsal.date}
      </p>
      <p className="absolute right-4 bottom-4 rounded-lg bg-white px-2 py-1 text-sm">
        {(rehearsal.duration / 60).toFixed(1)} min
      </p>
      <div className="absolute inset-0 h-full w-full bg-black opacity-0 transition group-hover:opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
        <span className="rounded-lg bg-white px-3 py-1 text-sm font-medium">
          view rehearsal →
        </span>
      </div>
    </NavLink>
  );
}

export default RehearsalCard;
