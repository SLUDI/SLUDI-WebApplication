import { Input } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function OtpInput({ onChange, placeholder, addonAfter, value }) {
  const otpInputRef = useRef();
  useEffect(() => {
    otpInputRef.current?.focus();
  }, []);

  return (
    <Input.Password
      ref={otpInputRef}
      type="text"
      value={value}
      addonAfter={addonAfter}
      onChange={onChange}
      placeholder={placeholder}
      size="large"
      maxLength={6}
      onPaste={(e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text");
        if (!/^\d*$/.test(pastedText)) {
          e.preventDefault();
        }
      }}
      onInput={(e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length > 6) {
          value = value.slice(0, 6);
        }
        e.target.value = value;
      }}
    />
  );
}
OtpInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  addonAfter: PropTypes.node,
};
