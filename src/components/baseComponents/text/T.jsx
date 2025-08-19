import { Typography } from "antd";
import PropTypes from "prop-types";

const Text = Typography;

export default function T({ variant, children, className = "", ...props }) {
  const variantClasses = {
    h1: "text-[40px] sm:text-[48px] font-bold", //heroTitle
    h2: "text-[32px] sm:text-[40px] font-bold", //h1
    h3: "text-[28px] sm:text-[32px] font-semibold", //h2
    h4: "text-[24px] sm:text-[28px] font-medium", //h3
    h5: "text-[18px] sm:text-[20px]", //bodyLarge
    h6: "text-[16px] sm:text-[16px]", //bodyRegular
    h7: "text-[14px] sm:text-[14px] font-medium", //bodySmall
    // h7SB: "text-[14px] sm:text-[14px] font-semibold", //bodySmall semi-bold
    h8: "text-[12px] sm:text-[12px]", //caption
    buttonText: "text-[14px] sm:text-[16px] font-semibold", //buttonText
    postDateText: "text-[12px] sm:text-[14px] font-medium",
    approvedText: "text-[14px] sm:text-[14px]",
  };

  const appliedClasses = `${variantClasses[variant]} ${className || ""}`;

  return (
    <Text className={appliedClasses} {...props}>
      {children}
    </Text>
  );
}

T.propTypes = {
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "h7",
    "h8",
    "buttonText",
    "postDateText",
    "approvedText",
  ]).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
};
