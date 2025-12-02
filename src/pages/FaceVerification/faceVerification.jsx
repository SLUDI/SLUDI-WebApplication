
import { Steps } from "antd";
import { useSelector } from "react-redux";
import Step3 from "./Steps/Step3";

export default function faceVerification() {
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);

  return (
    <div className="p-6 max-h-screen">
      <h1 className="text-3xl font-bold text-[#000000] mb-2 ">Create ID</h1>

      <div className="flex justify-center mb-2">
        <div className="w-2/3">
          <Steps
            current={currentStep}
            items={[
              {
                title: "Face Verification",
              },
            ]}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        {/* {completedSteps === 1 && currentStep === 0 && <Step1 />}
        {completedSteps === 2 && currentStep === 1 && <Step2 />} */}
        {completedSteps === 1 && currentStep === 0 && <Step3 />}
        {/* {completedSteps === 3 && currentStep === 2 && <Step4 />}
        {completedSteps === 4 && currentStep === 3 && <Step5 />} */}
      </div>
    </div>
  );
}
