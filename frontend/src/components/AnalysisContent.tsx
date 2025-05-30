import { useRef, useCallback } from "react";
import VideoPlayer from "./VideoPlayer";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";
import type { ContentAnalysis } from "../utils/contentAnalysis";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalysisContentProps {
  publicId: string;
  deliveryData: DeliveryAnalysis | null;
  contentData: ContentAnalysis | null;
}

export default function AnalysisContent({
  publicId,
  deliveryData,
  contentData,
}: AnalysisContentProps) {
  const playerRef = useRef<CloudinaryPlayer | null>(null);

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

  const handleReady = useCallback((player: CloudinaryPlayer) => {
    playerRef.current = player;
  }, []);

  return (
    <div className="grid h-full grid-cols-2 gap-10">
      <div className="flex aspect-video items-center justify-center">
        <VideoPlayer publicId={publicId} onReady={handleReady} />
      </div>
      <div className="h-[calc(100vh-8rem)] space-y-4 overflow-y-scroll">
        {deliveryData ? (
          <>
            <h2>delivery analysis</h2>
            <h3>filler words</h3>
            <div className="flex gap-3">
              {deliveryData.filler_words &&
              Object.keys(deliveryData.filler_words).length > 0 ? (
                Object.entries(deliveryData.filler_words).map(
                  ([word, count], idx) => (
                    <div
                      key={idx}
                      className="border-cherry rounded-xl border-2 px-3 py-2"
                    >
                      <span className="text-black">{word}</span> ({count})
                    </div>
                  ),
                )
              ) : (
                <p>none found</p>
              )}
            </div>
            <h3>speaking rate</h3>
            <p>{deliveryData.speech_rate_wpm ?? "N/A"} words per minute</p>
            <h3>body language</h3>
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>pros</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3">
                  {deliveryData.body_language_analysis.pros.length > 0 ? (
                    deliveryData.body_language_analysis.pros.map(
                      ({ timestamp, description }, idx) => (
                        <div key={idx} className="font-gs">
                          {timestamp.split(",").map((t, i, arr) => (
                            <button
                              key={i}
                              onClick={() => handleTimestampClick(t.trim())}
                              className={`timestamp ${
                                arr.length > 1 && i < arr.length - 1
                                  ? "mr-2"
                                  : ""
                              }`}
                              type="button"
                            >
                              <strong>{t.trim()}</strong>
                            </button>
                          ))}
                          : {description}
                        </div>
                      ),
                    )
                  ) : (
                    <p>no pros found</p>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>areas of improvement</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3">
                  {deliveryData.body_language_analysis.cons.length > 0 ? (
                    deliveryData.body_language_analysis.cons.map(
                      ({ timestamp, description }, idx) => (
                        <div key={idx} className="font-gs">
                          {timestamp.split(",").map((t, i, arr) => (
                            <button
                              key={i}
                              onClick={() => handleTimestampClick(t.trim())}
                              className={`timestamp ${
                                arr.length > 1 && i < arr.length - 1
                                  ? "mr-2"
                                  : ""
                              }`}
                              type="button"
                            >
                              <strong>{t.trim()}</strong>
                            </button>
                          ))}
                          : {description}
                        </div>
                      ),
                    )
                  ) : (
                    <p>no areas of improvement found, you did perfect!</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <p>no delivery analysis available</p>
        )}

        {contentData ? (
          <>
            <h2>content analysis</h2>
            {/* Outline Analysis (Pros & Cons) */}
            {contentData.content_analysis && (
              <>
                <h3>outline feedback</h3>
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>pros</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3">
                      {contentData.content_analysis.pros.length > 0 ? (
                        contentData.content_analysis.pros.map((obs, idx) => (
                          <div key={idx} className="font-gs">
                            <button
                              onClick={() =>
                                handleTimestampClick(
                                  obs.timestamp.trim().replace(/\./g, ":"),
                                )
                              }
                              className="timestamp mb-3"
                              type="button"
                            >
                              <strong>
                                {obs.timestamp.trim().replace(/\./g, ":")}
                              </strong>
                            </button>
                            : {obs.outline_point}
                            <div className="flex flex-col gap-2">
                              <p className="font-medium">
                                {obs.transcript_excerpt}
                              </p>
                              <p>{obs.suggestion}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>no strengths found in outline.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>areas of improvement</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3">
                      {contentData.content_analysis.cons.length > 0 ? (
                        contentData.content_analysis.cons.map((obs, idx) => (
                          <div key={idx} className="font-gs">
                            <button
                              onClick={() =>
                                handleTimestampClick(
                                  obs.timestamp.trim().replace(/\./g, ":"),
                                )
                              }
                              className="timestamp mb-3"
                              type="button"
                            >
                              <strong>
                                {obs.timestamp.trim().replace(/\./g, ":")}
                              </strong>
                            </button>
                            : {obs.outline_point}
                            <div className="flex flex-col gap-2">
                              <p className="font-medium">{obs.issue}</p>
                              <p>{obs.suggestion}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>no weaknesses found in outline — great job!</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}

            {/* Script Analysis (Omissions, Additions, Paraphrases) */}
            {contentData.script_analysis && (
              <>
                <h3>script feedback</h3>
                <Accordion type="multiple">
                  {(() => {
                    const scriptAnalysis = contentData.script_analysis;
                    if (!scriptAnalysis) return null;

                    const scriptTypes = [
                      "omissions",
                      "additions",
                      "paraphrases",
                    ] as const;
                    type ScriptType = (typeof scriptTypes)[number];

                    return scriptTypes.map((key: ScriptType) => (
                      <AccordionItem key={key} value={`item-${key}`}>
                        <AccordionTrigger>{key}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-3">
                          {scriptAnalysis[key].length > 0 ? (
                            scriptAnalysis[key].map((obs: any, idx: number) => (
                              <div key={idx} className="font-gs">
                                <button
                                  onClick={() =>
                                    handleTimestampClick(
                                      obs.timestamp.trim().replace(/\./g, ":"),
                                    )
                                  }
                                  className="timestamp mb-3"
                                  type="button"
                                >
                                  <strong>
                                    {obs.timestamp.trim().replace(/\./g, ":")}
                                  </strong>
                                </button>
                                <div className="flex flex-col gap-2">
                                  <p>
                                    <span className="font-medium">script</span>:{" "}
                                    {obs.script_excerpt}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      transcript
                                    </span>
                                    : {obs.transcript_excerpt}
                                  </p>
                                  <p>
                                    <span className="font-medium">note</span>:{" "}
                                    {obs.note}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>no {key} found</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ));
                  })()}
                </Accordion>
              </>
            )}
          </>
        ) : (
          <p>no content analysis available</p>
        )}
      </div>
    </div>
  );
}
