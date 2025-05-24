import { useRef, useCallback, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import { addRehearsal, getCurrentSpeech } from "../utils/auth";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";

function Analysis() {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryAnalysis | null>(
    null,
  );
  const [contentData, setContentData] = useState(null);
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
        let deliveryAnalysis = response.data.deliveryAnalysis;
        let contentAnalysis = response.data.contentAnalysis;

        // Load analysis if done
        if (deliveryAnalysis) {
          setDeliveryData(deliveryAnalysis);
        }
        if (contentAnalysis) {
          setContentData(contentAnalysis);
        }
        if (deliveryAnalysis || contentAnalysis) {
          console.log("Loaded existing analysis!");
          return; // Exit early to avoid updates if already analyzed
        }

        // Analyze delivery if needed, given no analysis exists
        if (analysisType.includes("delivery")) {
          deliveryAnalysis = {} as DeliveryAnalysis; // reset to fill in

          // Analyze transcript
          const t_response = await axios.post(
            "http://localhost:9000/analyze_transcript/",
            { url: secureUrl },
          );

          if (t_response.status !== 200) {
            throw new Error(
              `Error analyzing transcript! status: ${t_response.status}`,
            );
          }

          deliveryAnalysis["transcript_analysis"] = t_response.data;

          // Analyze body language (placeholder)
          const b_response = await axios.post(
            "http://localhost:9000/analyze_body_language/",
            { url: secureUrl },
          );

          if (b_response.status !== 200) {
            throw new Error(
              `Error analyzing transcript! status: ${b_response.status}`,
            );
          }

          deliveryAnalysis["body_language_analysis"] = b_response.data;

          setDeliveryData(deliveryAnalysis);
        }

        // TODO: Analyze content if needed, given no analysis exists

        // Update rehearsal with analysis data
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
      } catch (error) {
        console.error("Error calling analysis API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (secureUrl) analyze();
  }, [secureUrl]);

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

  const handleReady = useCallback((player: CloudinaryPlayer) => {
    playerRef.current = player;
  }, []);

  if (loading)
    return (
      <div className="layout-t">
        <div className="justify-self-center text-center text-gray-400">
          <h1>Analyzing video...</h1>
        </div>
      </div>
    );

  return (
    <div className="layout-tb">
      <div className="grid h-full grid-cols-2 gap-4">
        <div>
          <VideoPlayer publicId={publicId} onReady={handleReady} />
        </div>
        <div className="space-y-4 rounded-2xl border-2 border-black p-4">
          <h2>Delivery Analysis</h2>
          {deliveryData?.transcript_analysis ? (
            <>
              <details className="rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Filler Words
                </summary>
                <ul className="list-disc pl-4">
                  {deliveryData?.transcript_analysis?.analysis?.filler_words &&
                  Object.keys(
                    deliveryData.transcript_analysis.analysis.filler_words,
                  ).length > 0 ? (
                    Object.entries(
                      deliveryData.transcript_analysis.analysis.filler_words,
                    ).map(([word, count], idx) => (
                      <li key={idx}>
                        {" "}
                        {word}: {count}{" "}
                      </li>
                    ))
                  ) : (
                    <li>None found</li>
                  )}
                </ul>
              </details>

              <details className="rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Speaking Rate
                </summary>
                <p className="pl-4">
                  {deliveryData.transcript_analysis.analysis?.speech_rate_wpm ??
                    "N/A"}
                </p>
              </details>
            </>
          ) : (
            <p>No delivery analysis available.</p>
          )}
          {deliveryData?.body_language_analysis ? (
            <details className="mb-4 rounded-lg border p-2">
              <summary className="cursor-pointer text-lg font-medium">
                Body Language
              </summary>

              <details className="mt-2 ml-4 rounded-lg border p-2">
                <summary className="cursor-pointer font-semibold">Pros</summary>
                <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                  {deliveryData.body_language_analysis.pros.length > 0 ? (
                    deliveryData.body_language_analysis.pros.map(
                      ({ timestamp, description }, idx) => (
                        <li key={idx}>
                          <strong>{timestamp}</strong>: {description}
                        </li>
                      ),
                    )
                  ) : (
                    <li>No pros found</li>
                  )}
                </ul>
              </details>

              <details className="mt-2 ml-4 rounded-lg border p-2">
                <summary className="cursor-pointer font-semibold">
                  Areas of Improvement
                </summary>
                <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                  {deliveryData.body_language_analysis.cons.length > 0 ? (
                    deliveryData.body_language_analysis.cons.map(
                      ({ timestamp, description }, idx) => (
                        <li key={idx}>
                          <strong>{timestamp}</strong>: {description}
                        </li>
                      ),
                    )
                  ) : (
                    <li>No areas of improvement found, you did perfect!</li>
                  )}
                </ul>
              </details>
            </details>
          ) : (
            <p>No body language analysis available</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button onClick={handleRehearseAgain}>rehearse again</button>
        <NavLink to={`/speech/${getCurrentSpeech()}/summary`}>
          <button>finish</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Analysis;
