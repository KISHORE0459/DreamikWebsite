import { useState, useCallback } from "react";

const TextBehindImage = () => {
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
  }, []);

  return (
    <div className="relative min-h-screen">
      {iframeLoading && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-white/90">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
        </div>
      )}

      <iframe
        src="https://inked-frame.vercel.app/app"
        onLoad={handleIframeLoad}
        title="AI Editor"
        loading="lazy"
        className="h-screen w-full border-none p-2!"
      />
    </div>
  );
};

export default TextBehindImage;
