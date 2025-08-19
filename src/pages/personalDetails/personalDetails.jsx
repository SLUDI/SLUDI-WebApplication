import { Steps } from "antd";
import { useSelector } from "react-redux";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

export default function PersonalDetails() {
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
                title: "Personal Information",
              },
              {
                title: "Face Capture",
              },
              {
                title: "Fingers Capture",
              },
              {
                title: "Complete",
              },
            ]}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        {completedSteps === 1 && currentStep === 0 && <Step1 />}
        {completedSteps === 2 && currentStep === 1 && <Step2 />}
        {completedSteps === 3 && currentStep === 2 && <Step3 />}
      </div>
    </div>
  );
}
