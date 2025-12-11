import React, { useState, useEffect, useRef } from "react";
import { Form, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { FcOk } from "react-icons/fc";
import { MdFingerprint } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useSaveBiometricData } from "../../../hooks/idCreate";
import { getLocalStorageData } from "../../../utils/localStorageHelper";
import useNotification from "../../../hooks/useNotification";
import io from "socket.io-client";

const FINGERS = [
  { id: "thumb_left", label: "Left Thumb", position: "left" },
  { id: "index_left", label: "Left Index", position: "left" },
  { id: "middle_left", label: "Left Middle", position: "left" },
  { id: "ring_left", label: "Left Ring", position: "left" },
  { id: "pinky_left", label: "Left Pinky", position: "left" },
  { id: "thumb_right", label: "Right Thumb", position: "right" },
  { id: "index_right", label: "Right Index", position: "right" },
  { id: "middle_right", label: "Right Middle", position: "right" },
  { id: "ring_right", label: "Right Ring", position: "right" },
  { id: "pinky_right", label: "Right Pinky", position: "right" },
];

export default function Step4() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);
  const location = useLocation();
  const { userId } = location.state || {};
  const storedEmbeddingData = getLocalStorageData("face_embedding");
  const { notifySuccess, notifyError } = useNotification();

  console.log("Ab", storedEmbeddingData);
  //   console.log(userId);

  const [collectedFingers, setCollectedFingers] = useState({});
  const [currentFinger, setCurrentFinger] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadingFinger, setUploadingFinger] = useState(null);
  const [allCollected, setAllCollected] = useState(false);

  const socketRef = useRef(null);
  const capturingFingerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("Connected to local fingerprint service");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from local fingerprint service");
    });

    socketRef.current.on("status", (status) => {
      console.log("Device status:", status);
      if (status.startsWith("Error")) {
        message.error(status);
        setIsCapturing(false);
        setUploadingFinger(null);
        capturingFingerRef.current = null;
      }
    });

    socketRef.current.on("finger-detected", (data) => {
      // data: { template, image }
      const fingerIndex = capturingFingerRef.current;

      if (fingerIndex !== null) {
        const finger = FINGERS[fingerIndex];
        const fingerprintData = {
          fingerId: finger.id,
          fingerLabel: finger.label,
          timestamp: new Date().toISOString(),
          data: data.template, // The actual template from SDK
          // image: data.image, // Optional: if we want to display/save the image
          quality: 100, // SDK might not return quality, assuming 100 or need to parse
        };

        // Store in localStorage
        const storedFingerprints = JSON.parse(localStorage.getItem("fingerprints")) || {};
        storedFingerprints[finger.id] = fingerprintData;
        localStorage.setItem("fingerprints", JSON.stringify(storedFingerprints));

        setCollectedFingers((prev) => ({
          ...prev,
          [fingerIndex]: fingerprintData,
        }));

        message.success(`${finger.label} fingerprint collected successfully!`);

        // Reset capturing state
        setIsCapturing(false);
        setUploadingFinger(null);
        capturingFingerRef.current = null;

        // Move to next finger if not at end
        if (fingerIndex < FINGERS.length - 1) {
          setCurrentFinger(fingerIndex + 1);
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Simulate fingerprint capture
  // Start fingerprint capture
  const captureFingerprint = async (fingerIndex) => {
    const finger = FINGERS[fingerIndex];
    setIsCapturing(true);
    setUploadingFinger(fingerIndex);
    capturingFingerRef.current = fingerIndex;

    // Emit init-device to ensure device is ready and listening
    // The server handles multiple init calls gracefully or we can check connection
    if (socketRef.current) {
      socketRef.current.emit("init-device");
      message.info(`Please place your ${finger.label} on the scanner`);
    } else {
      message.error("Fingerprint service not connected");
      setIsCapturing(false);
      setUploadingFinger(null);
      capturingFingerRef.current = null;
    }
  };

  // Check if all fingers are collected
  useEffect(() => {
    if (Object.keys(collectedFingers).length === FINGERS.length) {
      setAllCollected(true);
      message.success("All fingerprints collected!");
    }
  }, [collectedFingers]);

  // Load stored fingerprints on mount
  useEffect(() => {
    const storedFingerprints = localStorage.getItem("fingerprints");
    if (storedFingerprints) {
      const parsed = JSON.parse(storedFingerprints);
      const fingersObj = {};
      FINGERS.forEach((finger, idx) => {
        if (parsed[finger.id]) {
          fingersObj[idx] = parsed[finger.id];
        }
      });
      setCollectedFingers(fingersObj);
    }
  }, []);

  const resetFingerprints = () => {
    setCollectedFingers({});
    setCurrentFinger(0);
    setAllCollected(false);
    localStorage.removeItem("fingerprints");
    message.info("Fingerprint collection reset. Ready to start again.");
  };

  ////////////////////////

  const { mutate, isPending } = useSaveBiometricData();

  const onFinish = () => {
    // Collect all templates
    const templates = Object.values(collectedFingers).map(f => f.data);

    // For now, assuming backend wants a JSON string of the templates array or similar.
    // Based on "fingerprintBase64": "aaaaaaa", it seems to expect a string.
    // If backend expects a single composite template, we might need to merge them, 
    // but usually registration involves sending multiple templates.
    // I will send the array of base64 templates as a JSON string for now.
    const fingerprintPayload = JSON.stringify(templates);

    const payload = {
      userId: userId,
      faceEmbedding: storedEmbeddingData,
      fingerprintBase64: fingerprintPayload,
    };

    console.log("Payload to be sent:", payload);
    mutate(payload, {
      onSuccess: (res) => {
        notifySuccess(res?.message);
        message.success(
          res.response?.data?.message || "Registration successful!"
        );
        dispatch(setCurrentStep(currentStep + 1));
        dispatch(setCompletedSteps(completedSteps + 1));
      },
      onError: (err) => {
        notifyError(err?.response?.data?.message);
        message.error(err.response?.data?.message || "Registration failed");
      },
    });
  };

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Fingerprint Collection
        </h2>
        <p className="text-gray-600 mb-6">Collect all 10 fingerprints</p>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-[#13A4B4]">
              {Object.keys(collectedFingers).length}/{FINGERS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#13A4B4] to-[#0d7a8a] h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(Object.keys(collectedFingers).length / FINGERS.length) * 100
                  }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Fingerprint Collection Area */}
        {!allCollected ? (
          <div className="w-full">
            {/* Left Hand Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-2">👋</span> Left Hand
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {FINGERS.filter((f) => f.position === "left").map((finger) => {
                  const actualIdx = FINGERS.indexOf(finger);
                  const isCollected = !!collectedFingers[actualIdx];
                  const isCurrentFinger = currentFinger === actualIdx;

                  return (
                    <div key={finger.id} className="flex flex-col items-center">
                      <button
                        onClick={() => captureFingerprint(actualIdx)}
                        disabled={isCapturing || uploadingFinger !== null}
                        className={`w-20 h-20 rounded-lg mb-3 flex items-center justify-center transition transform hover:scale-105 ${isCollected
                          ? "bg-green-100 border-2 border-green-500"
                          : isCurrentFinger
                            ? "bg-blue-100 border-2 border-blue-500 animate-pulse"
                            : "bg-gray-100 border-2 border-gray-300 hover:border-[#13A4B4]"
                          } ${isCapturing ? "cursor-wait" : "cursor-pointer"}`}
                      >
                        {uploadingFinger === actualIdx ? (
                          <Spin size="small" />
                        ) : isCollected ? (
                          <FcOk className="text-2xl" />
                        ) : (
                          <MdFingerprint className="text-3xl text-gray-600" />
                        )}
                      </button>
                      <p className="text-xs font-medium text-gray-700 text-center">
                        {finger.label}
                      </p>
                      {isCollected && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Collected
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Hand Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-2">👋</span> Right Hand
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {FINGERS.filter((f) => f.position === "right").map((finger) => {
                  const actualIdx = FINGERS.indexOf(finger);
                  const isCollected = !!collectedFingers[actualIdx];
                  const isCurrentFinger = currentFinger === actualIdx;

                  return (
                    <div key={finger.id} className="flex flex-col items-center">
                      <button
                        onClick={() => captureFingerprint(actualIdx)}
                        disabled={isCapturing || uploadingFinger !== null}
                        className={`w-20 h-20 rounded-lg mb-3 flex items-center justify-center transition transform hover:scale-105 ${isCollected
                          ? "bg-green-100 border-2 border-green-500"
                          : isCurrentFinger
                            ? "bg-blue-100 border-2 border-blue-500 animate-pulse"
                            : "bg-gray-100 border-2 border-gray-300 hover:border-[#13A4B4]"
                          } ${isCapturing ? "cursor-wait" : "cursor-pointer"}`}
                      >
                        {uploadingFinger === actualIdx ? (
                          <Spin size="small" />
                        ) : isCollected ? (
                          <FcOk className="text-2xl" />
                        ) : (
                          <MdFingerprint className="text-3xl text-gray-600" />
                        )}
                      </button>
                      <p className="text-xs font-medium text-gray-700 text-center">
                        {finger.label}
                      </p>
                      {isCollected && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Collected
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-gray-600 mt-8 text-sm">
              {isCapturing
                ? "Capturing fingerprint..."
                : `Current finger: ${FINGERS[currentFinger].label}`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-64 rounded-xl shadow-lg border-2 border-green-200 bg-green-50">
            <FcOk className="text-7xl mb-4" />
            <p className="text-2xl font-bold text-green-600 mb-2">
              All Fingerprints Collected!
            </p>
            <p className="text-gray-600">
              All 10 fingerprints have been successfully captured.
            </p>
            <button
              onClick={resetFingerprints}
              className="mt-6 px-6 py-2 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
            >
              Recapture
            </button>
          </div>
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
          onClick={onFinish}
          loading={isPending}
        />
      </div>
    </div>
  );
}
