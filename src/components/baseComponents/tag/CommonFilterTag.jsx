import { Tag } from "antd";
import { IoClose } from "react-icons/io5";
import T from "../text/T";
import PropTypes from "prop-types";

export default function CommonFilterTag({
  color = "#ffffff",
  closeIcon = (
    <IoClose
      style={{
        fontSize: "16px",
      }}
    />
  ),
  content,
  onClose,
}) {
  return (
    <Tag
      className="px-2 py-1 rounded-lg gap-2 flex items-center justify-center"
      color={color}
      closeIcon={closeIcon}
      closable
      onClose={onClose}
    >
      <T variant="h7" className="font-medium">
        {content}
      </T>
    </Tag>
  );
}
CommonFilterTag.propTypes = {
  color: PropTypes.string,
  closeIcon: PropTypes.elementType,
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
