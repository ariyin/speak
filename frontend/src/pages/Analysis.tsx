import { useRef, useCallback, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import { addRehearsal, getCurrentSpeech } from "../utils/auth";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";
import type { ContentAnalysis } from "../utils/contentAnalysis";

function Analysis() {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
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

  const handleTimestampClick = (timestamp: string) => {
    if (!playerRef.current) return;
    try {
      const [minutes, seconds] = timestamp.split(":").map(Number);
      const totalSeconds = minutes * 60 + seconds;
      // seek to the timestamp
      playerRef.current.currentTime(totalSeconds);
    } catch (error) {
      console.error("Failure skipping to timestamp:", error);
    }
  };

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
    console.log(deliveryData);
    console.log(contentData);
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
          {deliveryData ? (
            <>
              <h2>Delivery Analysis</h2>
              <details className="rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Filler Words
                </summary>
                <ul className="list-disc pl-4">
                  {deliveryData.filler_words &&
                  Object.keys(deliveryData.filler_words).length > 0 ? (
                    Object.entries(deliveryData.filler_words).map(
                      ([word, count], idx) => (
                        <li key={idx}>
                          {" "}
                          {word}: {count}{" "}
                        </li>
                      ),
                    )
                  ) : (
                    <li>None found</li>
                  )}
                </ul>
              </details>

              <details className="rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Speaking Rate
                </summary>
                <p className="pl-4">{deliveryData.speech_rate_wpm ?? "N/A"}</p>
              </details>
              <details className="mb-4 rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Body Language
                </summary>

                <details className="mt-2 ml-4 rounded-lg border p-2">
                  <summary className="cursor-pointer font-semibold">
                    Pros
                  </summary>
                  <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                    {deliveryData.body_language_analysis.pros.length > 0 ? (
                      deliveryData.body_language_analysis.pros.map(
                        ({ timestamp, description }, idx) => (
                          <li key={idx}>
                            {timestamp.split(",").map((t, i) => (
                              <button
                                key={i}
                                onClick={() => handleTimestampClick(t.trim())}
                                className="mx-1 border-0 bg-transparent p-0 text-blue-600 shadow-none hover:underline"
                                type="button"
                              >
                                <strong>{t.trim()}</strong>
                              </button>
                            ))}
                            : {description}
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
                            {timestamp.split(",").map((t, i) => (
                              <button
                                key={i}
                                onClick={() => handleTimestampClick(t.trim())}
                                className="mx-1 border-0 bg-transparent p-0 text-blue-600 shadow-none hover:underline"
                                type="button"
                              >
                                <strong>{t.trim()}</strong>
                              </button>
                            ))}
                            : {description}
                          </li>
                        ),
                      )
                    ) : (
                      <li>No areas of improvement found, you did perfect!</li>
                    )}
                  </ul>
                </details>
              </details>
            </>
          ) : (
            <p>No delivery analysis available</p>
          )}

          {contentData ? (
            <>
              <h2>Content Analysis</h2>
              {/* Outline Analysis (Pros & Cons) */}
              {contentData.content_analysis && (
                <details className="rounded-lg border p-2">
                  <summary className="cursor-pointer text-lg font-medium">
                    Outline Feedback
                  </summary>

                  <details className="mt-2 ml-4 rounded-lg border p-2">
                    <summary className="cursor-pointer font-semibold">
                      Pros
                    </summary>
                    <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                      {contentData.content_analysis.pros.length > 0 ? (
                        contentData.content_analysis.pros.map((obs, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() =>
                                handleTimestampClick(
                                  obs.timestamp.trim().replace(/\./g, ":"),
                                )
                              }
                              className="mx-1 border-0 bg-transparent p-0 text-blue-600 shadow-none hover:underline"
                              type="button"
                            >
                              <strong>
                                {obs.timestamp.trim().replace(/\./g, ":")}
                              </strong>
                            </button>
                            : <em>{obs.outline_point}</em>
                            <br />
                            <span className="block text-sm italic">
                              Transcript: {obs.transcript_excerpt}
                            </span>
                            <span className="block">
                              Suggestion: {obs.suggestion}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li>No strengths found in outline.</li>
                      )}
                    </ul>
                  </details>

                  <details className="mt-2 ml-4 rounded-lg border p-2">
                    <summary className="cursor-pointer font-semibold">
                      Areas for Improvement
                    </summary>
                    <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                      {contentData.content_analysis.cons.length > 0 ? (
                        contentData.content_analysis.cons.map((obs, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() =>
                                handleTimestampClick(
                                  obs.timestamp.trim().replace(/\./g, ":"),
                                )
                              }
                              className="mx-1 border-0 bg-transparent p-0 text-blue-600 shadow-none hover:underline"
                              type="button"
                            >
                              <strong>
                                {obs.timestamp.trim().replace(/\./g, ":")}
                              </strong>
                            </button>
                            : <em>{obs.outline_point}</em>
                            <br />
                            <span className="block text-sm italic">
                              Issue: {obs.issue}
                            </span>
                            <span className="block">
                              Suggestion: {obs.suggestion}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li>No weaknesses found in outline — great job!</li>
                      )}
                    </ul>
                  </details>
                </details>
              )}

              {/* Script Analysis (Omissions, Additions, Paraphrases) */}
              {contentData.script_analysis && (
                <details className="rounded-lg border p-2">
                  <summary className="cursor-pointer text-lg font-medium">
                    Script Feedback
                  </summary>

                  {(() => {
                    const scriptAnalysis = contentData.script_analysis;
                    if (!scriptAnalysis) return null;

                    return (
                      ["omissions", "additions", "paraphrases"] as const
                    ).map((key) => (
                      <details
                        key={key}
                        className="mt-2 ml-4 rounded-lg border p-2"
                      >
                        <summary className="cursor-pointer font-semibold capitalize">
                          {key}
                        </summary>
                        <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                          {scriptAnalysis[key].length > 0 ? (
                            scriptAnalysis[key].map((obs, idx) => (
                              <li key={idx}>
                                <button
                                  onClick={() =>
                                    handleTimestampClick(
                                      obs.timestamp.trim().replace(/\./g, ":"),
                                    )
                                  }
                                  className="mx-1 border-0 bg-transparent p-0 text-blue-600 shadow-none hover:underline"
                                  type="button"
                                >
                                  <strong>
                                    {obs.timestamp.trim().replace(/\./g, ":")}
                                  </strong>
                                </button>
                                <span className="block text-sm italic">
                                  Script: {obs.script_excerpt}
                                </span>
                                <span className="block text-sm italic">
                                  Transcript: {obs.transcript_excerpt}
                                </span>
                                <span className="block">Note: {obs.note}</span>
                              </li>
                            ))
                          ) : (
                            <li>No {key} found</li>
                          )}
                        </ul>
                      </details>
                    ));
                  })()}
                </details>
              )}
            </>
          ) : (
            <p>No content analysis available</p>
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
