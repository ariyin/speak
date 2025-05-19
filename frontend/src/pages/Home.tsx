import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId, addSpeech, addRehearsal } from "../utils/auth";

function Home() {
  const navigate = useNavigate();

  const handleCreateSpeech = async () => {
    try {
      const userId = getUserId();
      const response = await axios.post("http://localhost:8000/speech", {
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
      navigate("/type");
    } catch (error) {
      console.error("Error creating speech:", error);
      // TODO: Handle error
    }
  };

  return (
    <div className="layout-t">
      <button className="justify-self-end" onClick={handleCreateSpeech}>
        create new speech
      </button>
      <div className="justify-self-center">
        <h1>no speeches available</h1>
      </div>
    </div>
  );
}

export default Home;
