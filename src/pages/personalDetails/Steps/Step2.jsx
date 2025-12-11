import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Flex, Form, Progress, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { FcOk } from "react-icons/fc";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../../../utils/localStorageHelper";

export default function Step2() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);
  //const location = useLocation();
  //const { userId } = location.state || {};

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [instruction, setInstruction] = useState("Get ready...");
  const [progress, setProgress] = useState(0);
  //const [chunks, setChunks] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  //const [videoBlob, setVideoBlob] = useState(null);
  const [extractedEmbedding, setExtractedEmbedding] = useState();

  const instructions = [
    "Look straight",
    "Move your face up",
    "Move your face down",
    "Turn your face left",
    "Turn your face right",
    "Smile slightly",
    "Done! Please wait...",
  ];

  // Store embedding in localStorage
  const storeEmbeddingInLocalStorage = (embedding) => {
    try {
      //localStorage.setItem("face_embedding", JSON.stringify(embedding));
      //localStorage.setItem("embedding_timestamp", new Date().toISOString());

      setLocalStorageData("face_embedding", embedding);
      setLocalStorageData("embedding_timestamp", new Date().toISOString());
      // console.log(
      //   "Embedding stored in localStorage:",
      //   embedding.length,
      //   "dimensions"
      // );
      message.success("Face features extracted and stored successfully!");
    } catch (error) {
      console.error("Error storing embedding in localStorage:", error);
      message.error("Failed to store face features locally.");
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

  // Upload video to backend
  const uploadVideoToBackend = async (blob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "face_capture.webm");

      const response = await fetch(
        "https://deepfake.sludi.dpdns.org/extract",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setInstruction("Error video processing again capture");
        throw new Error(`Upload failed with status: ${response.status}`);
      } else {
        setInstruction("Successfully Processed! Go to next step or recapture");
      }

      const result = await response.json();
      // console.log("Upload successful:", result);

      // Extract and store the embedding
      if (result.embedding_b64) {
        // legacy: embedding array
        setExtractedEmbedding(result.embedding_b64);
        storeEmbeddingInLocalStorage(result.embedding_b64);
      } else {
        console.warn("No embedding found in response:", result);
        message.warning("No face features extracted. Please try again.");
      }

      setUploadSuccess(true);
      message.success("Video uploaded and features extracted successfully!");

      // Hide video and show success message
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      return result;
    } catch (error) {
      console.error("Error uploading video:", error);
      message.error("Failed to upload video. Please try again.");
      setUploadSuccess(false);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Process recorded video
  const processRecordedVideo = (recordedChunks) => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    //setVideoBlob(blob);

    // Create URL for download (optional)
    // const url = URL.createObjectURL(blob);

    // Upload to backend
    uploadVideoToBackend(blob);
  };

  // Start recording and show instructions
  const startRecording = async () => {
    setUploadSuccess(false);
    setExtractedEmbedding();
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
      //setChunks(localChunks);
      stream.getTracks().forEach((track) => track.stop());
      processRecordedVideo(localChunks);
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
        setInstruction("Processing video...");
      }
    }, 2000);
  };

  // Reset and start over
  const resetCapture = () => {
    setUploadSuccess(false);
    //setVideoBlob(null);
    setExtractedEmbedding();
    setInstruction("Get ready...");
    setProgress(0);

    // Clear stored embedding
    localStorage.removeItem("face_embedding");
    localStorage.removeItem("embedding_timestamp");

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Check if embedding exists in localStorage on component mount
  React.useEffect(() => {
    const storedEmbedding = getLocalStorageData("face_embedding");
    if (storedEmbedding) {
      try {
        const embedding = storedEmbedding;
        setExtractedEmbedding(embedding);
        setUploadSuccess(true);
        setInstruction(
          "Features already extracted. You can recapture or proceed."
        );
      } catch (error) {
        console.error("Error parsing stored embedding:", error);
      }
    }
  }, []);

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10 ">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-4">
          Face Capture & Feature Extraction
        </h2>

        {uploadSuccess ? (
          <div className="flex flex-col items-center justify-center w-100 h-80 rounded-xl shadow-lg border border-gray-300 bg-green-50">
            <FcOk className="text-6xl mb-4" />
            <p className="text-xl font-semibold text-green-600">
              Features Extracted Successfully!
            </p>
            <p className="text-gray-600 mt-2">
              {extractedEmbedding.length > 0
                ? `Embedding stored: ${extractedEmbedding.length} dimensions`
                : "Face features processed and stored"}
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-110 h-80 rounded-xl shadow-lg border border-gray-300 transform scale-x-[-1]"
          />
        )}

        <div className="mt-4 text-lg font-medium text-black">{instruction}</div>

        <div className="w-80 bg-gray-200 rounded-full h-2.5 mt-3">
          <div
            className={`${uploadSuccess ? "bg-[#48d45b]" : "bg-red-500"
              }  h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {uploadSuccess ? (
          <button
            onClick={resetCapture}
            className="mt-6 px-6 py-2 rounded-lg text-white font-semibold transition bg-green-600 hover:bg-green-700"
          >
            Capture Again
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={recording || uploading}
            className={`mt-6 px-6 py-2 rounded-lg text-white font-semibold transition ${recording || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#13A4B4] "
              }`}
          >
            {uploading
              ? "Uploading..."
              : recording
                ? "Recording..."
                : "Start Capture"}
          </button>
        )}
      </div>

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
          disabled={!uploadSuccess}
          onClick={() => {
            dispatch(setCurrentStep(currentStep + 1));
            dispatch(setCompletedSteps(completedSteps + 1));
          }}
        />
      </div>
    </div>
  );
}