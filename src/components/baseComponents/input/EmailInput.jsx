import { Input } from "antd";
import PropTypes from "prop-types";

export default function EmailInput({
  onChange,
  placeholder,
  addonAfter,
  value,
}) {
  return (
    <Input
      type="email"
      value={value}
      addonAfter={addonAfter}
      onChange={onChange}
      onKeyDown={(e) => {
        const key = e.key;

        // Allow valid characters and navigation keys
        const allowedKeys = [
          "Backspace",
          "Tab",
          "ArrowLeft",
          "ArrowRight",
          "Delete",
          "Home",
          "End",
        ];

        if (!/^[A-Za-z0-9@._+-]$/.test(key) && !allowedKeys.includes(key)) {
          e.preventDefault();
        }

        const value = e.target.value;
        if (key === "." && (value.endsWith(".") || value === "")) {
          e.preventDefault();
        }

        if (key === "@" && (value.includes("@") || value === "")) {
          e.preventDefault();
        }
      }}
      onPaste={(e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text");

        if (!/^[A-Za-z0-9@._+-]+$/.test(pastedText)) {
          e.preventDefault();
        }

        if (pastedText.includes(" ") || /^\.|\.\.|@.*@|\.$/.test(pastedText)) {
          e.preventDefault();
        }
      }}
      maxLength={100}
      placeholder={placeholder}
      size="large"
    />
  );
}
EmailInput.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  addonAfter: PropTypes.node,
};
