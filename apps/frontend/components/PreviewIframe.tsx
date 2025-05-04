import { useState, useEffect } from "react";

export function PreviewIframe({ url }: { url: string }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true); // Fallback in case iframe never triggers onLoad
    }, 10000); // 10 seconds

    return () => clearTimeout(timeout);
  }, [url]);

  return (
    <>
      {!isReady && (
        <div className="w-full h-full rounded-lg flex items-center justify-center ">
          Loading...
        </div>
      )}
      <iframe
        src={url}
        className="w-full h-full rounded-lg"
        title="Project Worker"
        onLoad={() => setIsReady(true)}
        style={{ display: isReady ? "block" : "none" }}
      />
    </>
  );
}
