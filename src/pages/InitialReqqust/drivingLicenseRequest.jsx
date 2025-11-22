import React, { useState, useEffect } from "react";
import { QrCode, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLicenseRequest } from "../../hooks/licenseIssue";
import { checkLicenseStatus } from "../../services/licenseIssued/licenseIssued";
import { setLicenseVerificationData } from "../../redux/licenseVerificationSlice"; // adjust path
import { message } from "antd";

export default function DrivingLicenseRequest() {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [expiryTime, setExpiryTime] = useState(15);
  const [sessionId, setSessionId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isPending } = useLicenseRequest();

  const handleGenerateQR = () => {
    setQrGenerated(true);
    setVerificationStatus("waiting");

    mutate(undefined, {
      onSuccess: (res) => {
        console.log("API Response:", res);

        const data = res?.data;

        setSessionId(data?.sessionId);

        if (data?.qrCode) {
          setQrImageUrl(`data:image/png;base64,${data.qrCode}`);
        }

        if (data?.expiresAt) {
          const expiryDate = new Date(data.expiresAt);
          const now = new Date();
          const diffMin = Math.floor((expiryDate - now) / 60000);
          setExpiryTime(diffMin);
        }

        message.success("QR generated successfully!");
      },

      onError: (error) => {
        console.error("Error:", error);
        message.error(error?.response?.data?.message || "Request failed");
      },
    });
  };

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await checkLicenseStatus(sessionId);

        console.log("STATUS :", res.data.status);

        if (res?.data?.status === "FULFILLED") {
          setVerificationStatus("complete");

          // Dispatch verification data to Redux
          dispatch(
            setLicenseVerificationData({
              sessionId: res.data.sessionId,
              sharedAttributes: res.data.sharedAttributes,
              status: res.data.status,
              canProceed: res.data.canProceed,
              fulfilledAt: res.data.fulfilledAt,
              expiresAt: res.data.expiresAt,
            })
          );

          clearInterval(interval);
        }
      } catch (err) {
        console.error("Status check failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, dispatch]);

  const handleProceedToIssuance = () => {
    navigate("/licenseIssue");
  };

  return (
    <div className="min-h-screen  p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Initiate Driving License Request
          </h1>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Instructions
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Generate QR Code
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Click the button below to create a new verification request
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Citizen Scans QR
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Ask the citizen to scan the QR code with their digital
                  identity wallet
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Wait for Approval
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Citizen reviews and approves sharing their identity
                  credentials
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Proceed to Issuance
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Once verified, proceed with license issuance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate QR Code Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generate QR Code
          </h2>

          {!qrGenerated ? (
            <div>
              <p className="text-gray-600 text-sm mb-4">
                Click the button below to generate a QR code that the citizen
                can scan with their identity wallet to submit their information.
              </p>
              <button
                onClick={handleGenerateQR}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                disabled={isPending}
              >
                <QrCode className="w-5 h-5" />
                Generate QR Code
              </button>
            </div>
          ) : (
            !isPending && (
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    QR Code
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Expires in {expiryTime} mins</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <img src={qrImageUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-gray-600 text-sm mt-4 text-center">
                    Ask citizen to scan this QR code with their digital wallet
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Verification Status Section */}
        {qrGenerated && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Verification Status
            </h2>

            {verificationStatus === "waiting" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <Loader2 className="w-5 h-5 text-yellow-600 animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Waiting for Citizen
                  </h3>
                  <p className="text-yellow-800 text-sm mt-1">
                    Checking for verification response...
                  </p>
                </div>
              </div>
            )}

            {verificationStatus === "complete" && (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Verification Complete
                    </h3>
                    <p className="text-green-800 text-sm mt-1">
                      Citizen data received successfully
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToIssuance}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Proceed to License Issuance
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
