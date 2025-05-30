import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AnalysisContent from "../components/AnalysisContent";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";
import type { ContentAnalysis } from "../utils/contentAnalysis";
import { addRehearsal, getCurrentSpeech } from "../utils/auth";

function Analysis() {
  const [deliveryData, setDeliveryData] = useState<DeliveryAnalysis | null>(
    null,
  );
  const [contentData, setContentData] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { rehearsalId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const publicId = state?.publicId;
  const secureUrl = state?.secureUrl;

  useEffect(() => {
    const analyze = async () => {
      try {
        // Check type of analysis selected for this rehearsal
        const response = await axios.get(
          `http://localhost:8000/rehearsal/${rehearsalId}`,
        );
        const analysisType = response.data.analysis;
        const content = response.data.content;
        let deliveryAnalysis = response.data.deliveryAnalysis;
        let contentAnalysis = response.data.contentAnalysis;

        // Load analysis if done
        if (deliveryAnalysis) {
          setDeliveryData(deliveryAnalysis);
        }
        if (contentAnalysis) {
          setContentData(contentAnalysis);
        }

        // Check if all wanted data got loaded
        if (
          (deliveryAnalysis || !analysisType.includes("delivery")) &&
          (contentAnalysis || !analysisType.includes("content"))
        ) {
          console.log("Loaded existing analysis!");
          return; // Exit early to avoid updates if already analyzed
        }

        // Need to get analysis for the first time

        // Analyze transcript
        let post_body: Record<string, any> = {};
        post_body["video_url"] = secureUrl;
        if (content && content.type === "outline") {
          post_body["outline"] = content.text;
        }
        if (content && content.type === "script") {
          post_body["script"] = content.text;
        }

        const t_response = await axios.post(
          "http://localhost:9000/analyze_transcript/",
          post_body,
        );

        if (t_response.status !== 200) {
          throw new Error(
            `Error analyzing transcript! status: ${t_response.status}`,
          );
        }

        // Update analysis data
        deliveryAnalysis = {} as DeliveryAnalysis;
        contentAnalysis = {} as ContentAnalysis;

        deliveryAnalysis["speech_rate_wpm"] = t_response.data.speech_rate_wpm;
        deliveryAnalysis["filler_words"] = t_response.data.filler_words;
        if ("content_analysis" in t_response.data) {
          contentAnalysis["content_analysis"] =
            t_response.data.content_analysis;
        }
        if ("script_analysis" in t_response.data) {
          contentAnalysis["script_analysis"] = t_response.data.script_analysis;
        }

        // Analyze body language if needed
        if (analysisType.includes("delivery")) {
          const b_response = await axios.post(
            "http://localhost:9000/analyze_body_language/",
            { video_url: secureUrl },
          );

          if (b_response.status !== 200) {
            throw new Error(
              `Error analyzing transcript! status: ${b_response.status}`,
            );
          }

          deliveryAnalysis["body_language_analysis"] = b_response.data;
        }

        // Update rehearsal with analysis data
        if (analysisType.includes("delivery")) {
          setDeliveryData(deliveryAnalysis);

          const d_update_response = await axios.patch(
            `http://localhost:8000/rehearsal/delivery_analysis/${rehearsalId}`,
            {
              deliveryAnalysis: deliveryAnalysis,
            },
          );

          if (d_update_response.status !== 200) {
            throw new Error(
              `Error updating delivery analysis! status: ${d_update_response.status}`,
            );
          }
        }

        if (analysisType.includes("content")) {
          setContentData(contentAnalysis);

          const c_update_response = await axios.patch(
            `http://localhost:8000/rehearsal/content_analysis/${rehearsalId}`,
            {
              contentAnalysis: contentAnalysis,
            },
          );

          if (c_update_response.status !== 200) {
            throw new Error(
              `Error updating content analysis! status: ${c_update_response.status}`,
            );
          }
        }
      } catch (error) {
        console.error("Error calling analysis API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (secureUrl) analyze();
  }, [secureUrl, rehearsalId]);

  const handleRehearseAgain = async () => {
    try {
      // create a new rehearsal for the same speech
      const speechId = getCurrentSpeech();
      const response = await axios.post("http://localhost:8000/rehearsal/", {
        speech: speechId,
      });
      console.log(response.data);
      // update current rehearsal in localStorage
      addRehearsal(response.data.rehearsal.id);

      // navigate to the type page for the new rehearsal
      navigate(`/rehearsal/${response.data.rehearsal.id}/type`);
    } catch (error) {
      console.error("Error creating new rehearsal:", error);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-center text-gray-400">
        <h2>analyzing video...</h2>
      </div>
    );

  return (
    <div className="layout-tb">
      <NavLink
        to={`/speech/${getCurrentSpeech()}/summary`}
        className="justify-self-end"
      >
        <button>finish</button>
      </NavLink>
      <AnalysisContent
        publicId={publicId}
        deliveryData={deliveryData}
        contentData={contentData}
      />
      <button onClick={handleRehearseAgain} className="justify-self-end">
        rehearse again
      </button>
    </div>
  );
}

export default Analysis;
