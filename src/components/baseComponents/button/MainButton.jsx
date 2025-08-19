import { Button } from "antd";
import PropTypes from "prop-types";
import T from "../text/T";

const MainButton = ({
  width,
  height,
  buttonText,
  onClick,
  loading,
  disabled,
  minWidth,
  icon,
  type = "primary",
  color = "#ffffff",
  paddingY = "8px",
  htmlType,
  font,
  borderColor = "#05154c",
  buttonColor = "",
  varient = "h7",
  rounded = "lg",
  variant = "filled",
}) => {
  return (
    <div
      className={`flex justify-center items-center`}
      style={{
        width: width !== null ? width : "fit-content",
        height: height,
        minWidth: minWidth,
      }}
    >
      <Button
        color={buttonColor}
        variant={variant}
        disabled={disabled}
        type={type}
        className={`w-full h-full flex items-center justify-center rounded-${rounded} border`}
        size="large"
        htmlType={htmlType}
        onClick={onClick}
        loading={loading}
        style={{
          paddingBottom: paddingY,
          paddingTop: paddingY,
          borderColor: borderColor,
          backgroundColor: buttonColor,
        }}
      >
        {icon}
        <T
          variant={varient}
          className={`${font ? font : "font-semibold"} ${
            buttonText === "" ? "px-0" : "px-[4px]"
          }`}
          style={{
            color: color,
            // paddingBottom: paddingY,
            // paddingTop: paddingY,
          }}
        >
          {buttonText}
        </T>
      </Button>
    </div>
  );
};
MainButton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  minWidth: PropTypes.string,
  icon: PropTypes.element,
  type: PropTypes.oneOf(["primary", "default", "dashed", "text", "link"]),
  color: PropTypes.string,
  paddingY: PropTypes.string,
  htmlType: PropTypes.oneOf(["button", "submit", "reset"]),
  font: PropTypes.string,
  borderColor: PropTypes.string,
  buttonColor: PropTypes.string,
  varient: PropTypes.string,
  rounded: PropTypes.string,
  variant: PropTypes.oneOf(["filled", "outlined", "text"]),
};
export default MainButton;
