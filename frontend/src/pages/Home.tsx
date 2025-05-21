import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpeechCard from "../components/SpeechCard";
import { getUserId, addSpeech, addRehearsal } from "../utils/auth";
import type { Speech } from "../utils/speechService";

function Home() {
  const navigate = useNavigate();
  const mockSpeeches: Speech[] = [
    {
      id: "1",
      rehearsals: [
        {
          id: "r1",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 180,
        },
        {
          id: "r2",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 165,
        },
      ],
    },
    {
      id: "2",
      rehearsals: [
        {
          id: "r3",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 90,
        },
      ],
    },
    {
      id: "3",
      rehearsals: [
        {
          id: "r4",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 600,
        },
        {
          id: "r5",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 585,
        },
        {
          id: "r6",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 595,
        },
      ],
    },
    {
      id: "4",
      rehearsals: [
        {
          id: "r7",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 300,
        },
        {
          id: "r8",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 285,
        },
      ],
    },
    {
      id: "5",
      rehearsals: [
        {
          id: "r9",
          duration: 240,
        },
      ],
    },
    {
      id: "6",
      rehearsals: [
        {
          id: "r10",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 120,
        },
        {
          id: "r11",
          videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          duration: 115,
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchSpeeches = async () => {
      try {
        const userId = getUserId();
        const response = await axios.get(
          `http://localhost:8000/speech/user/${userId}`,
        );
        setSpeeches(response.data.speeches.map((speech: Speech) => speech));
      } catch (err) {
        // setError("Failed to load speeches");
        console.error("Error fetching speeches:", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchSpeeches();
  }, []);

  const [speeches, setSpeeches] = useState<Speech[]>(mockSpeeches);

  // TODO: implement later
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const handleCreateSpeech = async () => {
    try {
      const userId = getUserId();
      const response = await axios.post("http://localhost:8000/speech/", {
        speech: {
          userId: userId,
          rehearsals: [],
        },
        rehearsal: {
          analysis: [],
          speech: "", // temporary ObjectId
          videoUrl: "",
        },
      });
      addSpeech(response.data.speech.id);
      addRehearsal(response.data.rehearsal.id);
      navigate(`/rehearsal/${response.data.rehearsal.id}/type`);
    } catch (error) {
      console.error("Error creating speech:", error);
    }
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  return (
    <div className="layout-t">
      <button className="justify-self-end" onClick={handleCreateSpeech}>
        create new speech
      </button>
      {speeches.length === 0 ? (
        <div className="justify-self-center text-center text-gray-400">
          <h1>no speeches available</h1>
          <p className="mt-2">create your first speech to get started!</p>
        </div>
      ) : (
        <div className="grid h-full grid-cols-3 gap-10">
          {speeches.map((speech) => (
            <SpeechCard key={speech.id} speech={speech} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
