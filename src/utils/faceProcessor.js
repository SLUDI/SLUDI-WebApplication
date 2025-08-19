import * as faceapi from "face-api.js";

let modelsLoaded = false;
let modelsLoading = false;

export async function loadModels() {
  if (modelsLoaded) return true;
  if (modelsLoading) {
    return new Promise((resolve) => {
      const check = () => {
        if (modelsLoaded) resolve(true);
        else setTimeout(check, 100);
      };
      check();
    });
  }

  modelsLoading = true;
  console.log("Loading face-api.js models...");
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"), // Add expression model
    ]);
    modelsLoaded = true;
    modelsLoading = false;
    console.log("All models loaded");
    return true;
  } catch (error) {
    modelsLoading = false;
    console.error("Failed to load models:", error);
    throw error;
  }
}

export async function detectFace(videoElement) {
  if (!modelsLoaded) {
    throw new Error("Models not loaded. Call loadModels() first.");
  }

  try {
    const result = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions(); // Add expressions detection

    return result;
  } catch (error) {
    console.error("Face detection failed:", error);
    return null;
  }
}

export async function detectFaceScore(videoElement) {
  const result = await detectFace(videoElement);
  if (!result) return 0;

  return Math.min(
    100,
    Math.floor(
      result.detection.score * 100 + result.landmarks.positions.length / 10
    )
  );
}

export async function getFaceDescriptor(input) {
  if (!modelsLoaded) {
    throw new Error("Models not loaded. Call loadModels() first.");
  }

  try {
    const result = await faceapi
      .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()
      .withFaceExpressions(); // Add expressions detection

    return result
      ? {
          descriptor: result.descriptor,
          detection: result.detection,
          landmarks: result.landmarks,
          expressions: result.expressions,
        }
      : null;
  } catch (error) {
    console.error("Failed to get face descriptor:", error);
    throw error;
  }
}

export async function compareFaces(descriptor1, descriptor2, threshold = 0.6) {
  if (!descriptor1 || !descriptor2) {
    return { distance: null, isMatch: false };
  }

  try {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    return {
      distance,
      isMatch: distance < threshold,
    };
  } catch (error) {
    console.error("Face comparison failed:", error);
    throw error;
  }
}

// New function to draw face elements on canvas
export function drawFaceElements(canvas, faceData) {
  if (!faceData) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw detection box
  faceapi.draw.drawDetections(canvas, [faceData.detection]);

  // Draw landmarks
  faceapi.draw.drawFaceLandmarks(canvas, [faceData.landmarks]);

  // Draw expressions
  faceapi.draw.drawFaceExpressions(canvas, [
    {
      detection: faceData.detection,
      expressions: faceData.expressions,
    },
  ]);
}
