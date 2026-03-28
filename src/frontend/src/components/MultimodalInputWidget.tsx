import { useEffect, useRef, useState } from "react";

export interface MultimodalResponse {
  scaleValue: number;
  textResponse: string;
  audioBlob: Blob | null;
  videoBlob: Blob | null;
  transcript: string;
}

interface Props {
  question: string;
  dimensionLabel: string;
  questionNumber: number;
  onResponse: (response: MultimodalResponse) => void;
  currentResponse: MultimodalResponse;
  skipLabel?: string;
}

type InputMode = "scale" | "text" | "audio" | "video";

const LIKERT = [1, 2, 3, 4, 5, 6, 7];
const MAX_QA_SECONDS = 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function stopTracks(stream: MediaStream | null) {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
}

export function MultimodalInputWidget({
  question,
  dimensionLabel,
  questionNumber,
  onResponse,
  currentResponse,
  skipLabel = "Skip this question",
}: Props) {
  const [mode, setMode] = useState<InputMode>("scale");
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_QA_SECONDS);
  const [localAudioBlob, setLocalAudioBlob] = useState<Blob | null>(
    currentResponse.audioBlob,
  );
  const [localVideoBlob, setLocalVideoBlob] = useState<Blob | null>(
    currentResponse.videoBlob,
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState(
    currentResponse.transcript,
  );
  const [textVal, setTextVal] = useState(currentResponse.textResponse);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioUrlRef = useRef<string | null>(null);
  const videoUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopTracks(streamRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    };
  }, []);

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    stopTracks(streamRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setRecording(false);
    setTimeLeft(MAX_QA_SECONDS);
  };

  const startRecording = async (isVideo: boolean) => {
    try {
      const constraints = isVideo
        ? { audio: true, video: { width: 640, height: 480 } }
        : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (isVideo && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
        videoPreviewRef.current.play();
      }

      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const mimeType = isVideo ? "video/webm" : "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        if (isVideo) {
          setLocalVideoBlob(blob);
          setVideoUrl(url);
          videoUrlRef.current = url;
          if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
          onResponse({
            ...currentResponse,
            videoBlob: blob,
            scaleValue: currentResponse.scaleValue || 4,
            transcript: liveTranscript,
          });
        } else {
          setLocalAudioBlob(blob);
          setAudioUrl(url);
          audioUrlRef.current = url;
          onResponse({
            ...currentResponse,
            audioBlob: blob,
            scaleValue: currentResponse.scaleValue || 4,
            transcript: liveTranscript,
          });
        }
      };

      mr.start();
      setRecording(true);
      setTimeLeft(MAX_QA_SECONDS);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          let t = "";
          for (let i = 0; i < event.results.length; i++) {
            t += event.results[i][0].transcript;
          }
          setLiveTranscript(t);
        };
        rec.start();
        recognitionRef.current = rec;
      }
    } catch (err) {
      console.error("Media access error:", err);
      alert(
        `Could not access microphone${isVideo ? "/camera" : ""}. Please check permissions.`,
      );
    }
  };

  const handleScaleClick = (v: number) => {
    onResponse({ ...currentResponse, scaleValue: v });
  };

  const handleTextChange = (t: string) => {
    setTextVal(t);
    onResponse({
      ...currentResponse,
      textResponse: t,
      scaleValue: currentResponse.scaleValue || 4,
    });
  };

  const isAnswered =
    currentResponse.scaleValue > 0 ||
    currentResponse.textResponse.trim().length > 0 ||
    currentResponse.audioBlob !== null ||
    currentResponse.videoBlob !== null;

  const gold = "#C8A24A";

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Question header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(200,162,74,0.15)", color: gold }}
          >
            {dimensionLabel}
          </span>
          <span className="text-white/30 text-xs">Q{questionNumber}</span>
        </div>
        <p className="text-white text-sm leading-relaxed font-medium">
          {question}
        </p>
      </div>

      {/* Mode selector tabs */}
      <div
        className="flex gap-1 mb-4 p-1 rounded-xl"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        {(["scale", "text", "audio"] as InputMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: mode === m ? gold : "transparent",
              color: mode === m ? "#1B4332" : "rgba(255,255,255,0.4)",
            }}
          >
            {m === "scale"
              ? "1\u20137 Scale"
              : m === "text"
                ? "\uD83D\uDCDD Type"
                : "\uD83C\uDFA4 Audio"}
          </button>
        ))}
        {videoEnabled ? (
          <button
            type="button"
            onClick={() => setMode("video")}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: mode === "video" ? gold : "transparent",
              color: mode === "video" ? "#1B4332" : "rgba(255,255,255,0.4)",
            }}
          >
            \uD83C\uDFA5 Video
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setVideoEnabled(true);
              setMode("video");
            }}
            className="flex-1 py-1.5 rounded-lg text-xs transition-all"
            style={{ color: "rgba(200,162,74,0.6)" }}
            title="Video captures more signals for richer analysis \u2014 optional"
          >
            + Video
          </button>
        )}
      </div>

      {/* Video enable notice */}
      {!videoEnabled && mode !== "video" && (
        <p className="text-xs mb-3" style={{ color: "rgba(200,162,74,0.5)" }}>
          \uD83D\uDCA1 Video captures more signals for richer analysis \u2014
          optional
        </p>
      )}

      {/* Scale mode */}
      {mode === "scale" && (
        <div>
          <div className="flex justify-between text-xs text-white/30 mb-2 px-1">
            <span>Strongly Disagree</span>
            <span>Neutral</span>
            <span>Strongly Agree</span>
          </div>
          <div className="flex gap-1">
            {LIKERT.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleScaleClick(v)}
                data-ocid={`assessment.scale_${v}.button`}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor:
                    currentResponse.scaleValue === v
                      ? gold
                      : "rgba(255,255,255,0.07)",
                  color:
                    currentResponse.scaleValue === v
                      ? "#1B4332"
                      : "rgba(255,255,255,0.5)",
                  border: "1px solid",
                  borderColor:
                    currentResponse.scaleValue === v
                      ? gold
                      : "rgba(255,255,255,0.1)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text mode */}
      {mode === "text" && (
        <div>
          <textarea
            value={textVal}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Share your thoughts openly \u2014 the more honest, the better your twin learns..."
            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
            style={{
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              minHeight: 90,
            }}
            data-ocid="assessment.textarea"
          />
          {textVal.length > 0 && (
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(200,162,74,0.6)" }}
            >
              \u2713 Response captured
            </p>
          )}
        </div>
      )}

      {/* Audio mode */}
      {mode === "audio" && (
        <div>
          {recording ? (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: "#ef4444" }}
                />
                <span className="text-white font-semibold">Recording...</span>
                <span className="font-mono" style={{ color: gold }}>
                  {formatTime(timeLeft)} remaining
                </span>
              </div>
              {liveTranscript && (
                <p className="text-white/40 text-xs italic mb-3 px-4">
                  &ldquo;{liveTranscript}&rdquo;
                </p>
              )}
              <button
                type="button"
                onClick={stopRecording}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: "#ef4444", color: "white" }}
                data-ocid="assessment.audio.button"
              >
                \u25a0 Stop Recording
              </button>
            </div>
          ) : localAudioBlob ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400 text-sm">
                  \u2713 Audio recorded
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLocalAudioBlob(null);
                    setAudioUrl(null);
                    onResponse({ ...currentResponse, audioBlob: null });
                  }}
                  className="text-white/30 hover:text-red-400 text-xs"
                >
                  Remove
                </button>
              </div>
              {audioUrl && (
                // biome-ignore lint/a11y/useMediaCaption: transcript displayed as text below
                <audio
                  controls
                  src={audioUrl}
                  className="w-full"
                  style={{ height: 40 }}
                />
              )}
              {liveTranscript && (
                <p className="text-white/40 text-xs italic mt-2">
                  &ldquo;{liveTranscript}&rdquo;
                </p>
              )}
              <button
                type="button"
                onClick={() => startRecording(false)}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: gold,
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                Re-record
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={() => startRecording(false)}
                className="w-16 h-16 rounded-full mb-3 flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105"
                style={{
                  backgroundColor: "rgba(200,162,74,0.2)",
                  border: `2px solid ${gold}`,
                }}
                data-ocid="assessment.audio.button"
              >
                \uD83C\uDFA4
              </button>
              <p className="text-white/50 text-sm">Press to start recording</p>
              <p className="text-white/30 text-xs mt-1">
                Up to {MAX_QA_SECONDS} seconds
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video mode — video element always rendered, shown only when recording */}
      {mode === "video" && (
        <div>
          {/* Always-mounted video preview element — hidden when not recording */}
          <video
            ref={videoPreviewRef}
            className="w-full rounded-xl mb-3"
            style={{
              maxHeight: 200,
              backgroundColor: "#000",
              display: recording ? "block" : "none",
            }}
            autoPlay
            muted
            playsInline
          />

          {recording ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: "#ef4444" }}
                  />
                  <span className="text-white font-semibold text-sm">
                    Recording...
                  </span>
                </div>
                <span className="font-mono" style={{ color: gold }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              {liveTranscript && (
                <p className="text-white/40 text-xs italic mb-3">
                  &ldquo;{liveTranscript}&rdquo;
                </p>
              )}
              <button
                type="button"
                onClick={stopRecording}
                className="w-full py-2.5 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: "#ef4444", color: "white" }}
                data-ocid="assessment.video.button"
              >
                \u25a0 Stop Recording
              </button>
            </div>
          ) : localVideoBlob ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-sm">
                  \u2713 Video recorded
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLocalVideoBlob(null);
                    setVideoUrl(null);
                    onResponse({ ...currentResponse, videoBlob: null });
                  }}
                  className="text-white/30 hover:text-red-400 text-xs"
                >
                  Remove
                </button>
              </div>
              {videoUrl && (
                // biome-ignore lint/a11y/useMediaCaption: transcript displayed as text below
                <video
                  controls
                  src={videoUrl}
                  className="w-full rounded-xl"
                  style={{ maxHeight: 200 }}
                />
              )}
              {liveTranscript && (
                <p className="text-white/40 text-xs italic mt-2">
                  &ldquo;{liveTranscript}&rdquo;
                </p>
              )}
              <button
                type="button"
                onClick={() => startRecording(true)}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: gold,
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                Re-record
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={() => startRecording(true)}
                className="w-16 h-16 rounded-full mb-3 flex items-center justify-center mx-auto text-2xl transition-transform hover:scale-105"
                style={{
                  backgroundColor: "rgba(200,162,74,0.2)",
                  border: `2px solid ${gold}`,
                }}
                data-ocid="assessment.video.button"
              >
                \uD83C\uDFA5
              </button>
              <p className="text-white/50 text-sm">
                Press to start video recording
              </p>
              <p className="text-white/30 text-xs mt-1">
                Up to {MAX_QA_SECONDS} seconds
              </p>
            </div>
          )}
        </div>
      )}

      {/* Skip option */}
      {!isAnswered && (
        <button
          type="button"
          onClick={() =>
            onResponse({
              scaleValue: 4,
              textResponse: "",
              audioBlob: null,
              videoBlob: null,
              transcript: "",
            })
          }
          className="mt-3 text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          {skipLabel} (use neutral)
        </button>
      )}

      {isAnswered && mode === "scale" && currentResponse.scaleValue > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: gold }}
          />
          <span className="text-xs" style={{ color: gold }}>
            Selected: {currentResponse.scaleValue}/7
          </span>
        </div>
      )}
    </div>
  );
}
