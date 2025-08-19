import { Button } from "antd";
import PropTypes from "prop-types";
import { IoMdArrowRoundBack } from "react-icons/io";

import { useNavigate } from "react-router-dom";

const BackButton = ({
  width = null,
  height = "40px",
  onClick = null,
  disabled = false,
  minWidth = "fit-content",
}) => {
  const navigate = useNavigate();
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
        disabled={disabled}
        // className="w-full h-full flex items-center justify-center rounded-lg border border-[#05154c]"
        size="middle"
        onClick={
          onClick
            ? onClick
            : () => {
                navigate(-1);
              }
        }
        shape="circle"
        icon={<IoMdArrowRoundBack className="text-[20px]" />}
      />
    </div>
  );
};

// Add PropTypes
BackButton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default BackButton;
