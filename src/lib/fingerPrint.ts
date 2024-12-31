
export const getDeviceFingerprint = () => {
    if (typeof window !== "undefined" && navigator.userAgent) {
      const userAgent = navigator.userAgent;
      const language = navigator.language;
      const hardwareConcurrency = navigator.hardwareConcurrency;
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const timezoneOffset = new Date().getTimezoneOffset();
  
      const fingerprint = `${userAgent}|${language}|${hardwareConcurrency}|${screenResolution}|${timezoneOffset}`;
      return fingerprint;
    }
    return "rajatdevicefingerprint";
  };