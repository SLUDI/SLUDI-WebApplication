import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Flex, Form, Progress, message, Input, Card, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { FcOk, FcHighPriority } from "react-icons/fc";
import { getLocalStorageData } from "../../../utils/localStorageHelper";

export default function Step3() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);

  const [storedEmbedding, setStoredEmbedding] = useState([]);
  const [threshold, setThreshold] = useState(0.8);
  const [verificationResult, setVerificationResult] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [embeddingLoaded, setEmbeddingLoaded] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [instruction, setInstruction] = useState(
    "Get ready for verification..."
  );
  const [progress, setProgress] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const instructions = [
    "Look straight",
    "Hold still for verification",
    "Processing...",
  ];

  // Load embedding from localStorage on component mount
  useEffect(() => {
    loadStoredEmbedding();
  }, []);

  // Load embedding from localStorage
  const loadStoredEmbedding = () => {
    try {
      const storedEmbeddingData = getLocalStorageData("face_embedding");
      const timestamp = getLocalStorageData("embedding_timestamp");

      if (storedEmbeddingData) {
        const embedding = JSON.parse(storedEmbeddingData);
        setStoredEmbedding(embedding);
        setEmbeddingLoaded(true);

        const time = timestamp
          ? new Date(timestamp).toLocaleString()
          : "Unknown";
        message.success(
          `Embedding loaded successfully (${embedding.length} dimensions, stored: ${time})`
        );

        console.log("Loaded embedding sample:", embedding.slice(0, 3));
      } else {
        message.warning(
          "No stored embedding found. Please complete feature extraction first."
        );
        setEmbeddingLoaded(false);
      }
    } catch (error) {
      console.error("Error loading embedding from localStorage:", error);
      message.error("Failed to load stored embedding.");
      setEmbeddingLoaded(false);
    }
  };

  // Access webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      message.error("Failed to access camera. Please check permissions.");
      return null;
    }
  };

  // Verify video with embedding
  const verifyVideoWithEmbedding = async (blob, embedding, thresholdValue) => {
    setVerifying(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "verification_video.webm");
      formData.append("stored_embedding", JSON.stringify(embedding));
      formData.append("threshold", thresholdValue.toString());

      const response = await fetch(
        "https://Tishan-001-deepfake-detector.hf.space/verify-with-embedding",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setInstruction("Error in verification process. Please try again.");
        throw new Error(`Verification failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Verification result:", result);

      // Handle the response based on your API structure
      const isVerified = result.is_match || false;
      const similarity = result.similarity || 0;

      setVerificationResult(isVerified);
      setSimilarityScore(similarity);

      if (isVerified) {
        setInstruction("Verification Successful!");
        setVerificationSuccess(true);
        message.success("Identity verified successfully!");
      } else {
        setInstruction("Verification Failed - Please try again");
        setVerificationSuccess(false);
        message.error(
          `Verification failed. Similarity: ${(similarity * 100).toFixed(2)}%`
        );
      }

      return result;
    } catch (error) {
      console.error("Error during verification:", error);
      message.error("Failed to verify. Please try again.");
      setVerificationSuccess(false);
      setVerificationResult(false);
      throw error;
    } finally {
      setVerifying(false);
    }
  };

  // Process recorded video for verification
  const processVerificationVideo = (recordedChunks) => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    verifyVideoWithEmbedding(blob, storedEmbedding, threshold);
  };

  // Start recording for verification
  const startVerification = async () => {
    // Check if we have stored embedding
    if (!storedEmbedding || storedEmbedding.length === 0) {
      message.error(
        "No embedding available. Please load or use sample embedding."
      );
      return;
    }

    setVerificationSuccess(false);
    setVerificationResult(null);
    setSimilarityScore(null);

    const stream = await startCamera();
    if (!stream) return;

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;
    const localChunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        localChunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      processVerificationVideo(localChunks);
    };

    recorder.start();
    setRecording(true);
    setProgress(0);

    let i = 0;
    const interval = setInterval(() => {
      if (i < instructions.length) {
        setInstruction(instructions[i]);
        setProgress(((i + 1) / instructions.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        recorder.stop();
        setRecording(false);
        setInstruction("Verifying identity...");
      }
    }, 2000);
  };

  // Reset and start over
  const resetVerification = () => {
    setVerificationSuccess(false);
    setVerificationResult(null);
    setSimilarityScore(null);
    setInstruction("Get ready for verification...");
    setProgress(0);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-4">
          Identity Verification
        </h2>

        {/* Embedding Configuration */}
        <Card className="w-full mb-6" title="Embedding Management">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stored Embedding Status
              </label>
              <div className="flex items-center gap-2 mb-2">
                <Tag color={embeddingLoaded ? "green" : "red"}>
                  {embeddingLoaded ? "LOADED" : "NOT LOADED"}
                </Tag>
                <span className="text-sm text-gray-600">
                  {embeddingLoaded
                    ? `${storedEmbedding.length} dimensions`
                    : "No embedding available"}
                </span>
              </div>

              {embeddingLoaded && storedEmbedding.length > 0 && (
                <div className="p-2 bg-gray-50 rounded border text-xs">
                  <strong>Sample:</strong> [
                  {storedEmbedding.slice(0, 3).map((num, idx) => (
                    <span key={idx}>
                      {num.toFixed(6)}
                      {idx < 2 ? ", " : ""}
                    </span>
                  ))}
                  ...]
                </div>
              )}
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
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-110 h-80 rounded-xl shadow-lg border border-gray-300"
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
                : "bg-blue-500"
            } h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Action Buttons */}
        {verificationSuccess || verificationResult === false ? (
          <button
            onClick={resetVerification}
            className="mt-6 px-6 py-2 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
          >
            Verify Again
          </button>
        ) : (
          <button
            onClick={startVerification}
            disabled={recording || verifying || !embeddingLoaded}
            className={`mt-6 px-6 py-2 rounded-lg text-white font-semibold transition ${
              recording || verifying || !embeddingLoaded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#13A4B4] hover:bg-[#0f8a98]"
            }`}
          >
            {verifying
              ? "Verifying..."
              : recording
              ? "Recording..."
              : !embeddingLoaded
              ? "Load Embedding First"
              : "Start Verification"}
          </button>
        )}

        {/* Results Display */}
        {similarityScore !== null && (
          <Card className="w-full mt-6" title="Verification Results">
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <strong>Confidence:</strong>
                <span
                  className={
                    similarityScore > 0.9
                      ? "text-green-600 ml-2"
                      : similarityScore > 0.7
                      ? "text-yellow-600 ml-2"
                      : "text-red-600 ml-2"
                  }
                >
                  {similarityScore > 0.9
                    ? "HIGH"
                    : similarityScore > 0.7
                    ? "MEDIUM"
                    : "LOW"}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex items-center justify-end gap-2 mt-10">
        <MainButton
          buttonText={"Back"}
          height={"30px"}
          width={"15%"}
          minWidth="63px"
          type="primary"
          color="#ffffff"
          paddingY="2px"
          htmlType={"button"}
          onClick={() => {
            dispatch(setCurrentStep(currentStep - 1));
            dispatch(setCompletedSteps(completedSteps - 1));
          }}
        />

        <MainButton
          buttonText={"Next"}
          height={"30px"}
          width={"15%"}
          minWidth="63px"
          type="primary"
          color="#ffffff"
          paddingY="2px"
          htmlType={"button"}
          disabled={!verificationSuccess}
          onClick={() => {
            dispatch(setCurrentStep(currentStep + 1));
            dispatch(setCompletedSteps(completedSteps + 1));
          }}
        />
      </div>
    </div>
  );
}
