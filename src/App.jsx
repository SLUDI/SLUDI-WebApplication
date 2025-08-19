import { ConfigProvider, theme } from "antd";
import RouterSet from "./routes/RouterSet";

function App() {
  const algorithm = "light";
  const primary = "#13A4B4";
  const themeColor = "#FFFFFF";

  return (
    <ConfigProvider
      theme={{
        algorithm:
          algorithm === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: primary,
          fontFamily: "Mona-Sans",
          colorInfo: primary,
        },
        components: {
          Table: {
            headerBg: "var(--table-header)",
            colorBgContainer: "var(--surface-bg-white)",
            rowHoverBg: "var(--surface-bg-white)",
          },
          Menu: {
            itemSelectedColor: algorithm === "dark" ? "#1D242D" : "#05164C",
            itemSelectedBg: algorithm === "dark" ? "#1D242D" : "#FFFFFF",
            itemBg: algorithm === "dark" ? "#1D242D" : "FFFFFF",
            iconSize: 32,
            collapsedIconSize: 32,
            activeBarBorderWidth: 0,
          },
          Spin: {
            colorPrimary: "var(--color-primary)",
          },
          Drawer: {
            colorBgElevated: themeColor,
          },
          Input: {
            colorBgContainer: algorithm === "dark" ? "#1D242D" : "#FFFFFF",
            fontSizeSM: 10,
            fontSize: 12,
            fontSizeLG: 14,
            activeShadow: "0 0 0 0.2px rgba(5, 145, 255, 0.1)",
          },
          DatePicker: {
            colorBgContainer: algorithm === "dark" ? "#1D242D" : "#FFFFFF",
            fontSizeSM: 10,
            fontSize: 12,
            fontSizeLG: 14,
          },
          Checkbox: {
            colorBgContainer: algorithm === "dark" ? "#1D242D" : "#FFFFFF",
          },
          Select: {
            colorBgContainer: algorithm === "dark" ? "#1D242D" : "#FFFFFF",
            fontSizeSM: 10,
            fontSize: 12,
            fontSizeLG: 14,
          },
          Modal: {
            colorBgElevated: themeColor,
          },
          Form: {
            fontSizeSM: 10,
            fontSize: 12,
            fontSizeLG: 14,
          },
          Radio: {
            colorBgContainer: algorithm === "dark" ? "#1D242D" : "#FFFFFF",
          },
          Pagination: {
            itemActiveBg: algorithm === "dark" ? "#1D242D" : "#05164C",
            colorPrimary: algorithm === "dark" ? "#1D242D" : "#ffffff",
            colorPrimaryBorder: algorithm === "dark" ? "#1D242D" : "#05164C",
            controlOutline: algorithm === "dark" ? "#1D242D" : "#05164C",
            borderRadius: 20,
            borderRadiusSM: 20,
            fontSize: 11,
            colorPrimaryHover: algorithm === "dark" ? "#1D242D" : "#05164C",
          },
        },
      }}
    >
      <div
        className={`${
          algorithm === "dark" ? "dark-mode-color" : "light-mode-color"
        }`}
      >
        <RouterSet />
      </div>
    </ConfigProvider>
  );
}

export default App;
