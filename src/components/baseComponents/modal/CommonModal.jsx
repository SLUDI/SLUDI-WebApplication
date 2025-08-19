import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import PropTypes from "prop-types";

export default function CommonModal({
  isCloseIcon = true,
  onCancel,
  open,
  children,
  width = 600,
  customFooter = null,
  centered = true,
  maskClosable = false,
  modalStyle = {},
  closeIconStyle = {},
  padding,
}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={width}
      footer={customFooter}
      destroyOnClose={true}
      maskClosable={maskClosable}
      centered={centered}
      className="custom-modal"
      style={modalStyle}
      closeIcon={
        isCloseIcon ? (
          <div
            className={`flex items-center justify-center rounded-full bg-[#05164C]`}
            style={{
              width: "20px",
              height: "20px",
              ...closeIconStyle,
            }}
          >
            <CloseOutlined style={{ color: "white" }} className="text-[10px]" />
          </div>
        ) : null
      }
    >
      {/* Content */}
      <div
        style={{
          padding: padding,
        }}
      >
        {children}
      </div>
    </Modal>
  );
}
CommonModal.propTypes = {
  isCloseIcon: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  customFooter: PropTypes.node,
  centered: PropTypes.bool,
  maskClosable: PropTypes.bool,
  modalStyle: PropTypes.object,
  closeIconStyle: PropTypes.object,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
