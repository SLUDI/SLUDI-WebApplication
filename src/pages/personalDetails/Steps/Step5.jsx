import React, { useState, useEffect } from "react";
import { Card, Spin, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { FcCheckmark } from "react-icons/fc";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { MdLocationOn, MdFingerprint } from "react-icons/md";
import { BiCard } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useGenerateCredential, useRegister } from "../../../hooks/idCreate";
import { getLocalStorageData } from "../../../utils/localStorageHelper";
import useNotification from "../../../hooks/useNotification";

export default function Step5() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);
  const location = useLocation();
  const { notifySuccess, notifyError } = useNotification();

  const { userId, fullName, email, phone, address, nic, age, gender } =
    location.state || {};

  const { mutate, isPending } = useRegister();
  const { mutate: generateCredentialMutate, isPending: isGeneratingCredential } = useGenerateCredential();

  const [registrationData, setRegistrationData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);

  // Fetch all collected data
  useEffect(() => {
    const faceEmbedding = getLocalStorageData("face_embedding");
    const fingerprints = localStorage.getItem("fingerprints");

    const data = {
      personalInfo: {
        userId,
        fullName,
        email,
        phone,
        address,
        nic,
        age,
        gender,
      },
      biometrics: {
        faceEmbedding: faceEmbedding ? faceEmbedding : null,
        fingerprints: fingerprints ? JSON.parse(fingerprints) : null,
      },
      collectionTimestamp: new Date().toISOString(),
    };

    setRegistrationData(data);
  }, [userId, fullName, email, phone, address, nic, age, gender]);

  // Complete registration
  const handleCompleteRegistration = async () => {
    if (!registrationData) {
      message.error("Missing registration data");
      return;
    }

    const payload = {
      nic: registrationData.personalInfo.nic,
      deviceInfo: {
        deviceId: "web-frontend",
        deviceType: "browser",
        os: window.navigator.platform,
        ipAddress: "0.0.0.0",
        location: "",
      },
    };



    mutate(payload, {
      onSuccess: (res) => {
        notifySuccess(res?.message);
        message.success(
          res.response?.data?.message || "Registration successful!"
        );



        const didFull = res.data?.didId; // did:sludi:200131161875
        const shortDid = didFull?.split(":")[2]; // 200131161875




        setRegistrationId(didFull);
        setIsRegistering(true);
        setRegistrationComplete(true);

        // Now call credential API automatically
        if (shortDid) {
          generateCredentialMutate(shortDid, {
            onSuccess: (credRes) => {
              notifySuccess("Credential generated successfully!");
              message.success("Credential generated successfully!");
            },
            onError: (err) => {
              notifyError(err?.response?.data?.message || "Credential generation failed");
              message.error("Credential generation failed");
            },
          });
        } else {
          notifyError("Failed to extract DID from registration response");
          message.error("Failed to extract DID from registration response");
        }

        // Clear biometric storage
        setTimeout(() => {
          localStorage.removeItem("face_embedding");
          localStorage.removeItem("embedding_timestamp");
          localStorage.removeItem("fingerprints");
        }, 2000);
      },

      onError: (err) => {
        notifyError(err?.response?.data?.message);
        message.error(err.response?.data?.message || "Registration failed");
      },
    });
  };

  const handleGoToDashboard = () => {
    // Clear step state and navigate to dashboard
    navigate("/usermangemnt");
  };

  if (!registrationData) {
    return (
      <div className="w-2/3 bg-[#ffffff] p-6 mt-10 flex items-center justify-center">
        <Spin size="large" tip="Loading registration data..." />
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="w-2/3 bg-[#ffffff] p-6 mt-10">
        <div className="flex flex-col items-center justify-center mt-10 ">
          {/* Success Animation */}
          <div className="mb-6 animate-bounce ">
            <FcCheckmark className="text-9xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Registration Successful!
          </h1>
          <p className="text-gray-600 text-lg mb-8 text-center">
            Your identity has been verified and registered successfully.
          </p>

          {/* Registration ID Card */}
          <Card
            className="w-full max-w-md mb-8 shadow-xl"
            style={{
              backgroundColor: "#f0f9ff",
              borderTop: "4px solid #13A4B4",
            }}
          >
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Registration ID</p>
              <p className="text-2xl font-bold text-[#13A4B4] font-mono break-all">
                {registrationId}
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="w-full flex gap-3 mt-10">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 px-6 py-3 rounded-lg text-white font-semibold transition bg-[#13A4B4] hover:bg-[#0d7a8a]"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Complete Registration
        </h2>
        <p className="text-gray-600 mb-8">
          Review and submit your registration
        </p>

        {/* Review Card */}
        <Card className="w-full mb-8 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Registration Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AiOutlineUser /> Personal Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.age}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.gender}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AiOutlineMail /> Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BiCard /> Document Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">NIC Number</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.nic}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">
                    {registrationData.personalInfo.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Biometric Status */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MdFingerprint /> Biometric Data
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Face Recognition</p>
                  <p className="font-semibold text-green-600">✓ Captured</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Fingerprints</p>
                  <p className="font-semibold text-green-600">
                    ✓ 10 fingers collected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> By submitting this registration, you
              confirm that all the information provided is accurate and you
              authorize the collection and storage of your biometric data for
              identity verification purposes.
            </p>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="w-full flex items-center justify-end gap-2">
          <MainButton
            buttonText={"Back"}
            height={"35px"}
            width={"15%"}
            minWidth="70px"
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
            buttonText={
              isRegistering ? "Registering..." : "Complete Registration"
            }
            height={"35px"}
            width={"25%"}
            minWidth="130px"
            type="primary"
            color="#ffffff"
            paddingY="2px"
            htmlType={"button"}
            disabled={isRegistering}
            onClick={handleCompleteRegistration}
            loading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
