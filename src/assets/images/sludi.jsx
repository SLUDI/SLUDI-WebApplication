import PropTypes from "prop-types";

export default function HeaderImage({
    size = "medium",
    className = "",
    style = {},
    ...props
}) {
    // Size configurations
    const sizeConfig = {
        small: {
            fontSize: "1.25rem",
            letterSpacing: "0.15em",
            padding: "4px 8px",
            blurRadius: "10px",
        },
        medium: {
            fontSize: "1.75rem",
            letterSpacing: "0.2em",
            padding: "6px 12px",
            blurRadius: "15px",
        },
        large: {
            fontSize: "2.5rem",
            letterSpacing: "0.25em",
            padding: "8px 16px",
            blurRadius: "20px",
        },
        xl: {
            fontSize: "4rem",
            letterSpacing: "0.3em",
            padding: "10px 20px",
            blurRadius: "25px",
        },
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: config.padding,
        borderRadius: "12px",
        boxShadow: `0 0 ${config.blurRadius} rgba(19, 164, 180, 0.3)`,
        background: "transparent",
        ...style,
    };

    const textStyle = {
        fontSize: style.fontSize || config.fontSize,
        fontWeight: "bold",
        letterSpacing: config.letterSpacing,
        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        fontFamily: "'Poppins', sans-serif",
    };

    const tealColor = "#13A4B4";
    const goldColor = "#FFD700";

    return (
        <div style={containerStyle} className={className} {...props}>
            <span style={{ ...textStyle, color: tealColor }}>SL</span>
            <span style={{ ...textStyle, color: goldColor }}>U</span>
            <span style={{ ...textStyle, color: tealColor }}>DI</span>
        </div>
    );
}

HeaderImage.propTypes = {
    size: PropTypes.oneOf(["small", "medium", "large"]),
    className: PropTypes.string,
    style: PropTypes.object,
};
