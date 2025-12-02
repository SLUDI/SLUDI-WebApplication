import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Flex, Form, Progress, message, Input, Card, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { useFaceVerification } from "../../../hooks/idCreate";
import { FcOk, FcHighPriority } from "react-icons/fc";
import { getLocalStorageData } from "../../../utils/localStorageHelper";

export default function Step3() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);

  const [threshold, setThreshold] = useState(0.8);
  const [verificationResult, setVerificationResult] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState(null);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [instruction, setInstruction] = useState(
    "Get ready for verification..."
  );
  const [progress, setProgress] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [citizenId, setCitizenId] = useState("");
  const [cameraStream, setCameraStream] = useState(null);

  const instructions = [
    "Look straight",
    "Hold still for verification",
    "Processing...",
  ];

  const { mutate, isPending } = useFaceVerification();

  useEffect(() => {
    // Try to load citizen ID from localStorage on component mount
    try {
      const storedData = getLocalStorageData("data");
      const didFromStorage = storedData?.didId || storedData?.did || storedData?.citizenId;
      if (didFromStorage) setCitizenId(didFromStorage);
    } catch (e) {
      console.log("No stored citizen ID found");
    }

    // Cleanup on unmount
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Verify video with embedding
  const verifyVideoWithEmbedding = async (blob) => {
    setVerifying(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "verification_video.webm");
      
      // Add citizenId if available
      if (citizenId) {
        formData.append("did", citizenId);
      }

      console.log("Sending verification request with citizenId:", citizenId);

      mutate(formData, {
        onSuccess: (res) => {
          console.log("Face verification response:", res);

          const isMatch = res?.data?.verification?.match ?? res?.success ?? false;
          const similarity = res?.data?.verification?.similarity ?? 0;
          const messageText = res?.data?.verification?.message ?? res?.result ?? "";
          const deepfake = res?.data?.verification?.deepfakeDetected ?? false;
          const liveness = res?.data?.verification?.livenessCheckPassed ?? null;
          const blinks = res?.data?.verification?.blinksDetected ?? null;
          const processingTimeMs = res?.data?.verification?.processingTimeMs ?? null;
          const thresholdUsed = res?.data?.verification?.thresholdUsed ?? null;

          setVerificationResult(isMatch);
          setSimilarityScore(similarity);
          setVerificationDetails({
            isMatch,
            similarity,
            message: messageText,
            deepfake,
            liveness,
            blinks,
            processingTimeMs,
            thresholdUsed,
          });
          setVerificationSuccess(Boolean(isMatch));
          setInstruction(isMatch ? "Verification Successful!" : "Verification Failed - Please try again");

          // show messages
          if (isMatch) {
            message.success(messageText || "Identity verified successfully!");
          } else {
            message.error(messageText || `Verification failed. Similarity: ${(similarity * 100).toFixed(2)}%`);
          }
        },
        onError: (err) => {
          console.error("Face verification error:", err);
          const errMsg = err?.response?.data?.message || err?.message || "Verification failed";
          message.error(errMsg);
          setVerificationSuccess(false);
          setVerificationResult(false);
        },
        onSettled: () => {
          setVerifying(false);
        },
      });
    } catch (error) {
      console.error("Error during verification:", error);
      message.error("Failed to verify. Please try again.");
      setVerificationSuccess(false);
      setVerificationResult(false);
      setVerifying(false);
      throw error;
    }
  };

  // Process recorded video for verification
  const processVerificationVideo = (recordedChunks) => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    verifyVideoWithEmbedding(blob);
  };

  // Start recording for verification
  const startVerification = async () => {
    try {
      setVerificationSuccess(false);
      setVerificationResult(null);
      setSimilarityScore(null);
      setVerificationDetails(null);

      // Check if citizenId is provided
      if (!citizenId.trim()) {
        message.error("Please enter a Citizen ID / DID for verification");
        return;
      }

      // Access webcam stream through the Webcam component
      if (!webcamRef.current) {
        message.error("Webcam not available");
        return;
      }

      const stream = webcamRef.current.video?.srcObject;
      if (!stream) {
        message.error("Camera is not active. Please allow camera permissions and try again.");
        return;
      }

      // Stop any existing recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Try different MIME types for better compatibility
      const mimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
        'video/mp4'
      ];

      let selectedMimeType = 'video/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log(`Using MIME type: ${mimeType}`);
          break;
        }
      }

      // Create new MediaRecorder
      const recorder = new MediaRecorder(stream, { 
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
      });
      
      mediaRecorderRef.current = recorder;
      const localChunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log(`Chunk received: ${e.data.size} bytes`);
          localChunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log("Recording stopped, chunks collected:", localChunks.length);
        if (localChunks.length > 0) {
          const totalSize = localChunks.reduce((acc, chunk) => acc + chunk.size, 0);
          console.log(`Total video size: ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
          processVerificationVideo(localChunks);
        } else {
          message.error("No video data recorded. Please try again.");
          setVerifying(false);
        }
      };

      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        message.error(`Recording error: ${event.error?.message || "Unknown error"}`);
        setRecording(false);
        setVerifying(false);
      };

      // Start recording
      recorder.start(100); // Collect data every 100ms
      setRecording(true);
      setProgress(0);
      setInstruction("Starting recording...");
      console.log("Recording started");

      let i = 0;
      const interval = setInterval(() => {
        if (i < instructions.length) {
          setInstruction(instructions[i]);
          setProgress(((i + 1) / instructions.length) * 100);
          i++;
        } else {
          clearInterval(interval);
          if (recorder.state !== 'inactive') {
            console.log("Stopping recorder after instructions");
            recorder.stop();
          }
          setRecording(false);
          setInstruction("Verifying identity...");
        }
      }, 2000);

      // Safety timeout to stop recording after 8 seconds
      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          console.log("Safety timeout - stopping recorder");
          recorder.stop();
          clearInterval(interval);
          setRecording(false);
          setInstruction("Maximum recording time reached. Processing...");
        }
      }, 8000);

    } catch (error) {
      console.error("Error in startVerification:", error);
      message.error(`Failed to start verification: ${error.message}`);
      setRecording(false);
      setVerifying(false);
    }
  };

  // Reset and start over
  const resetVerification = () => {
    setVerificationSuccess(false);
    setVerificationResult(null);
    setSimilarityScore(null);
    setVerificationDetails(null);
    setInstruction("Get ready for verification...");
    setProgress(0);
    setRecording(false);
    setVerifying(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-4">
          Identity Verification
        </h2>

        {/* Citizen ID Input Card */}
        <Card className="w-full mb-6" title="Verification Details">
          <div className="flex flex-col gap-4">
            {/* Citizen / DID Input - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Citizen ID / DID *
              </label>
              <Input
                placeholder="Enter citizenId or DID"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Required for verification. This will be sent to the verification endpoint.
              </p>
            </div>

            {/* Threshold Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Threshold
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  placeholder="0.8"
                  className="w-32"
                />
                <span className="text-sm text-gray-600">
                  Current: {(threshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Higher threshold = stricter matching (0.0 - 1.0)
              </p>
            </div>

            {/* Status Information */}
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Instructions:</strong> Click "Start Verification" to begin. The system will:
              </p>
              <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
                <li>Start recording video for 6 seconds</li>
                <li>Send the video along with your Citizen ID to the verification service</li>
                <li>Compare with stored facial embeddings</li>
                <li>Display verification results</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Video Capture Area */}
        {verificationSuccess ? (
          <div className="flex flex-col items-center justify-center w-100 h-80 rounded-xl shadow-lg border border-gray-300 bg-green-50">
            <FcOk className="text-6xl mb-4" />
            <p className="text-xl font-semibold text-green-600">
              Verification Successful!
            </p>
            {similarityScore && (
              <p className="text-gray-600 mt-2">
                Similarity Score: {(similarityScore * 100).toFixed(2)}%
              </p>
            )}
          </div>
        ) : verificationResult === false ? (
          <div className="flex flex-col items-center justify-center w-100 h-80 rounded-xl shadow-lg border border-gray-300 bg-red-50">
            <FcHighPriority className="text-6xl mb-4" />
            <p className="text-xl font-semibold text-red-600">
              Verification Failed
            </p>
            {similarityScore && (
              <p className="text-gray-600 mt-2">
                Similarity Score: {(similarityScore * 100).toFixed(2)}%
              </p>
            )}
          </div>
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            }}
            className="w-110 h-80 rounded-xl shadow-lg border border-gray-300 object-cover"
            onUserMedia={(stream) => {
              setCameraStream(stream);
              console.log("Camera stream started successfully");
            }}
            onUserMediaError={(error) => {
              console.error("Camera error:", error);
              message.error(`Camera error: ${error.message}. Please check permissions.`);
            }}
          />
        )}

        <div className="mt-4 text-lg font-medium text-black">{instruction}</div>

        {/* Progress Bar */}
        <div className="w-80 bg-gray-200 rounded-full h-2.5 mt-3">
          <div
            className={`${
              verificationSuccess
                ? "bg-green-500"
                : verificationResult === false
                ? "bg-red-500"
                : recording || verifying
                ? "bg-blue-500"
                : "bg-gray-300"
            } h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Action Buttons */}
        {verificationSuccess || verificationResult === false ? (
          <button
            onClick={() => resetVerification()}
            className="mt-6 px-6 py-2 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
            type="button"
          >
            Verify Again
          </button>
        ) : (
          <button
            onClick={() => startVerification()}
            className={`mt-6 px-6 py-2 rounded-lg text-white font-semibold transition ${
              verifying || recording
                ? "bg-gray-400 cursor-not-allowed"
                : !citizenId.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#13A4B4] hover:bg-[#0f8a98]"
            }`}
            disabled={verifying || recording || !citizenId.trim()}
            type="button"
          >
            {recording ? "Recording..." : verifying ? "Verifying..." : "Start Verification"}
          </button>
        )}

        {/* Results Display */}
        {similarityScore !== null && (
          <Card className="w-full mt-6" title="Verification Results">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Citizen ID:</strong> {citizenId}
              </div>
              <div>
                <strong>Similarity Score:</strong>{" "}
                {(similarityScore * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Threshold:</strong> {(threshold * 100).toFixed(0)}%
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  className={
                    verificationResult
                      ? "text-green-600 ml-2"
                      : "text-red-600 ml-2"
                  }
                >
                  {verificationResult ? "VERIFIED" : "NOT VERIFIED"}
                </span>
              </div>
            </div>
            {/* Additional details if available */}
            {verificationDetails && (
              <div className="mt-4 text-sm text-gray-700">
                {verificationDetails.message && (
                  <div>
                    <strong>Message:</strong> {verificationDetails.message}
                  </div>
                )}
                <div>
                  <strong>Deepfake Detected:</strong>{" "}
                  {verificationDetails.deepfake ? (
                    <span className="text-red-600">YES</span>
                  ) : (
                    <span className="text-green-600">NO</span>
                  )}
                </div>
                {verificationDetails.liveness !== null && (
                  <div>
                    <strong>Liveness Check:</strong>{" "}
                    {verificationDetails.liveness ? (
                      <span className="text-green-600">PASSED</span>
                    ) : (
                      <span className="text-red-600">FAILED</span>
                    )}
                  </div>
                )}
                {verificationDetails.blinks !== null && (
                  <div>
                    <strong>Blinks Detected:</strong> {verificationDetails.blinks}
                  </div>
                )}
                {verificationDetails.processingTimeMs && (
                  <div>
                    <strong>Processing Time:</strong> {verificationDetails.processingTimeMs} ms
                  </div>
                )}
                {verificationDetails.thresholdUsed && (
                  <div>
                    <strong>Threshold Used:</strong> {verificationDetails.thresholdUsed}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}