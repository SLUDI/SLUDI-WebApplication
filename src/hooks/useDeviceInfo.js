import { useState, useEffect } from "react";

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    os: "",
    deviceId: "",
    ipAddress: "0.0.0.0",
    deviceType: "",
    location: "Web Browser",
  });

  useEffect(() => {
    const getBasicDeviceInfo = () => {
      const os = window.navigator.platform;
      const userAgent = window.navigator.userAgent;
      //   const language = window.navigator.language;
      //   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      //   const screenResolution = `${window.screen.width}x${window.screen.height}`;

      // Determine browser
      let browser = "Unknown";
      if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
        browser = "Chrome";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
        browser = "Safari";
      else if (userAgent.includes("Edg")) browser = "Edge";

      // Determine device type
      let deviceType = "desktop";
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        )
      ) {
        deviceType = "mobile";
      } else if (/Tablet|iPad/i.test(userAgent)) {
        deviceType = "tablet";
      }

      // Generate device ID without IP dependency
      const deviceId = `web-${browser.toLowerCase()}-${os
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Math.random().toString(36).substr(2, 9)}`;

      // Get IP without blocking on errors
      getIPAddress().then((ipAddress) => {
        setDeviceInfo({
          os,
          deviceId,
          ipAddress,
          deviceType,
          location: "Web Browser", // Simplified location
        });
      });
    };

    getBasicDeviceInfo();
  }, []);

  return deviceInfo;
};

// Non-blocking IP address fetch
const getIPAddress = async () => {
  try {
    // Use the most reliable free IP service
    const response = await fetch("https://api.ipify.org?format=json");
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.warn("IP address fetch failed, using fallback");
    console.error(error);   
  }
  return "0.0.0.0";
};
