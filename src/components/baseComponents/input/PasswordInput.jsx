import { Input } from "antd";
import PropTypes from "prop-types";

export default function PasswordInput({
  onChange,
  placeholder,
  addonAfter,
  value,
}) {
  return (
    <Input.Password
      type="password"
      value={value}
      addonAfter={addonAfter}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={60}
      onKeyDown={(e) => {
        const key = e.key;
        if (/^[\s]*$/.test(key) && key !== "Backspace") {
          e.preventDefault();
        }
      }}
      onPaste={(e) => {
        const pastedText = e.clipboardData.getData("text/plain");
        if (/\s/.test(pastedText)) {
          e.preventDefault();
        }
      }}
      size="large"
      className=" tracking-[.15em]"
    />
  );
}
PasswordInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  addonAfter: PropTypes.node,
};
