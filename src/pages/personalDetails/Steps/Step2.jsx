import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  loadModels,
  detectFaceScore,
  getFaceDescriptor,
  compareFaces,
  drawFaceElements,
} from "../../../utils/faceProcessor";
import { Flex, Form, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import MainButton from "../../../components/baseComponents/button/MainButton";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

export default function Step2() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [score, setScore] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState("Waiting");
  const [loading, setLoading] = useState(true);
  const [modelsReady, setModelsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [faceData, setFaceData] = useState(null);

  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);

  // Load face-api.js models
  useEffect(() => {
    async function initialize() {
      try {
        await loadModels();
        setModelsReady(true);
        setLoading(false);
        startFaceDetection();
      } catch (error) {
        console.error("Failed to load models:", error);
        setStatus("Error loading face detection");
        setLoading(false);
      }
    }
    initialize();
  }, []);

  // Start face detection on webcam stream
  const startFaceDetection = () => {
    if (!modelsReady) return;

    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detect = async () => {
      try {
        const result = await detectFaceScore(video);
        setFaceData(result);

        if (result) {
          drawFaceElements(canvas, result);
          const resultScore = Math.min(
            100,
            Math.floor(
              result.detection.score * 100 +
                result.landmarks.positions.length / 10
            )
          );
          setScore(resultScore);
        } else {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  // Auto-capture after clicking "Capture"
  useEffect(() => {
    if (!isCapturing || !modelsReady || imageSrc) return;

    const interval = setInterval(async () => {
      if (score >= 80) {
        const image = webcamRef.current.getScreenshot();
        setImageSrc(image);
        setStatus("Success");
        setIsCapturing(false);
        clearInterval(interval);

        // Compute face descriptor
        const img = new Image();
        img.src = image;
        img.onload = async () => {
          try {
            const result = await getFaceDescriptor(img);
            if (result) {
              setFaceData(result);
              if (referenceDescriptor) {
                const comparison = await compareFaces(
                  referenceDescriptor.descriptor,
                  result.descriptor
                );
                setStatus(
                  comparison.isMatch ? "Verified" : "Verification Failed"
                );
              } else {
                setReferenceDescriptor(result);
                setStatus("Face captured successfully");
              }
            }
          } catch (error) {
            console.error("Error processing face descriptor:", error);
            setStatus("Error processing face");
          }
        };
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCapturing, modelsReady, imageSrc, referenceDescriptor, score]);

  const startCapture = () => {
    if (!modelsReady) {
      setStatus("Face detection not ready yet");
      return;
    }

    setScore(null);
    setImageSrc(null);
    setStatus("Processing...");
    setIsCapturing(true);
  };

  const reset = () => {
    setScore(null);
    setImageSrc(null);
    setStatus("Waiting");
    setIsCapturing(false);
    setFaceData(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10 ">
      {loading ? (
        <div className="text-center py-8">Loading face detection models...</div>
      ) : (
        <div className="grid grid-cols-2 gap-8  p-6">
          {/* Webcam or Image Section */}
          <div className="flex flex-col items-center justify-center mt-4  bg-[#D9D9D9] py-8 relative">
            {!imageSrc ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="rounded-md border w-[350px] h-[350px]"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ width: "350px", height: "350px" }}
                />
              </>
            ) : (
              <div className="relative">
                <img
                  src={imageSrc}
                  alt="Captured face"
                  className="rounded-md w-[350px] h-[350px]"
                />
                {faceData && (
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ width: "350px", height: "350px" }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center text-center ">
            <div className="flex items-center justify-center mt-10">
              <Flex gap="large" wrap className="mt-10">
                <Progress type="circle" percent={score ?? 0} />
              </Flex>
            </div>

            <p className="mt-4 font-semibold text-gray-700">
              Picture Capture Status - {status === "Success" ? "OK" : status}
            </p>

            {/* Buttons */}
            <div className="mt-8 space-x-4 flex flex-row">
              <MainButton
                buttonText={" Reset"}
                height={"30px"}
                width={"80%"}
                minWidth="63px"
                type="primary"
                color="#ffffff"
                paddingY="2px"
                htmlType={"submit"}
                onClick={reset}
                buttonColor="#DC0000"
              />

              <MainButton
                buttonText={"Capture"}
                height={"30px"}
                width={"80%"}
                minWidth="63px"
                type="primary"
                color="#ffffff"
                paddingY="2px"
                htmlType={"submit"}
                onClick={startCapture}
                disabled={isCapturing || imageSrc}
                buttonColor="#1FC41A"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-end gap-2 mt-10">
        <MainButton
          buttonText={"Back"}
          height={"30px"}
          width={"15%"}
          minWidth="63px"
          type="primary"
          color="#ffffff"
          paddingY="2px"
          htmlType={"submit"}
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
          htmlType={"submit"}
          onClick={() => {
            dispatch(setCurrentStep(currentStep + 1));
            dispatch(setCompletedSteps(completedSteps + 1));
          }}
        />
      </div>
    </div>
  );
}
