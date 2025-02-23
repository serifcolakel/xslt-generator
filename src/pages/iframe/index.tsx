import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Parent application component that listens for messages from the parent application.
 *
 * PROD: https://db-reporting-system.vercel.app/iframe-child
 *
 * LOCAL-TEST: http://localhost:5174/iframe-child
 */
const childOrigin = "https://db-reporting-system.vercel.app/iframe-child";

function SendingIcon(): JSX.Element {
  return (
    <svg
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"
          strokeDasharray="2 4"
          strokeDashoffset={6}
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="0.6s"
            repeatCount="indefinite"
            values="6;0"
          />
        </path>
        <path
          d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
          strokeDasharray={32}
          strokeDashoffset={32}
        >
          <animate
            attributeName="stroke-dashoffset"
            begin="0.1s"
            dur="0.4s"
            fill="freeze"
            values="32;0"
          />
        </path>
        <path d="M12 8v7.5" strokeDasharray={10} strokeDashoffset={10}>
          <animate
            attributeName="stroke-dashoffset"
            begin="0.5s"
            dur="0.2s"
            fill="freeze"
            values="10;0"
          />
        </path>
        <path
          d="M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5"
          strokeDasharray={6}
          strokeDashoffset={6}
        >
          <animate
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.2s"
            fill="freeze"
            values="6;0"
          />
        </path>
      </g>
    </svg>
  );
}

function SendIcon(): JSX.Element {
  return (
    <svg
      height={16}
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none">
        <path
          d="M8.805 8.958L1.994 11l.896-3l-.896-3l6.811 2.042c.95.285.95 1.63 0 1.916"
          fill="url(#fluentColorSend162)"
        />
        <path
          d="M1.724 1.053a.5.5 0 0 0-.714.545l1.403 4.85a.5.5 0 0 0 .397.354l5.69.953c.268.053.268.437 0 .49l-5.69.953a.5.5 0 0 0-.397.354l-1.403 4.85a.5.5 0 0 0 .714.545l13-6.5a.5.5 0 0 0 0-.894z"
          fill="url(#fluentColorSend160)"
        />
        <path
          d="M1.724 1.053a.5.5 0 0 0-.714.545l1.403 4.85a.5.5 0 0 0 .397.354l5.69.953c.268.053.268.437 0 .49l-5.69.953a.5.5 0 0 0-.397.354l-1.403 4.85a.5.5 0 0 0 .714.545l13-6.5a.5.5 0 0 0 0-.894z"
          fill="url(#fluentColorSend161)"
        />
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="fluentColorSend160"
            x1={1}
            x2={12.99}
            y1={-4.688}
            y2={11.244}
          >
            <stop stopColor="#3bd5ff" />
            <stop offset={1} stopColor="#0094f0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="fluentColorSend161"
            x1={8}
            x2={11.641}
            y1={4.773}
            y2={14.624}
          >
            <stop offset={0.125} stopColor="#dcf8ff" stopOpacity={0} />
            <stop offset={0.769} stopColor="#ff6ce8" stopOpacity={0.7} />
          </linearGradient>
          <radialGradient
            cx={0}
            cy={0}
            gradientTransform="matrix(7.43807 0 0 1.12359 .5 8)"
            gradientUnits="userSpaceOnUse"
            id="fluentColorSend162"
            r={1}
          >
            <stop stopColor="#0094f0" />
            <stop offset={1} stopColor="#2052cb" />
          </radialGradient>
        </defs>
      </g>
    </svg>
  );
}

function ParentApp(): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const [hasInterval, setHasInterval] = useState(false);
  const [errorEvent, setErrorEvent] = useState<string | null>(null);
  const [interValTime, setIntervalTime] = useState(1000);

  const checkInterval = useCallback((): void => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
      setHasInterval(false);
    }
  }, [setHasInterval]);

  const sendMessageToChild = useCallback((): boolean => {
    try {
      const data = {
        secretKey: crypto.randomUUID(),
        type: "MESSAGE",
        token: crypto.randomUUID(),
        user: {
          name: "Serif Colakel",
          role: "ADMIN",
          age: Math.floor(Math.random() * 100),
        },
        receivedAt: {
          formatted: new Date().toLocaleString(),
          timestamp: Date.now(),
          locale: new Date().toLocaleString(navigator.language),
        },
        intervalTime: interValTime,
      };
      iframeRef.current?.contentWindow?.postMessage(data, childOrigin);
      if (hasInterval) {
        checkInterval();
      }
      return true;
    } catch (error) {
      setErrorEvent(
        `Failed to send data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  }, [setErrorEvent, checkInterval, hasInterval, interValTime]);

  const sendMessageToChildWithInterval = (): void => {
    if (interval.current && hasInterval) {
      checkInterval();
    } else {
      setHasInterval(true);
      const result = sendMessageToChild();
      if (!result) {
        return;
      }
      interval.current = setInterval(() => {
        sendMessageToChild();
      }, interValTime);
    }
  };

  const onIFrameLoad = useCallback((): void => {
    try {
      let hasContent = false;
      try {
        hasContent =
          (iframeRef.current?.contentWindow?.document.body.children.length ||
            0) > 0;
      } catch (error) {
        if (error instanceof DOMException) {
          window.console.warn("Cross-origin access denied:", error);
        } else {
          window.console.error("Unexpected error:", error);
        }
      }
      if (!hasContent) {
        window.console.error("Iframe content not found");
      }
    } catch (error) {
      if (error instanceof DOMException) {
        setErrorEvent(error.message);
      } else if (error instanceof TypeError) {
        setErrorEvent(error.message);
      } else if (error instanceof Error) {
        setErrorEvent(error.message);
      }
    }
  }, [setErrorEvent]);

  useEffect(() => {
    const handleIframeLoad = (): void => {
      try {
        const currentUrl = iframeRef.current?.contentWindow?.location.href;
        if (currentUrl) {
          window.console.log("Iframe URL:", currentUrl);
        }
      } catch (error) {
        window.console.warn("Cross-origin access denied:", error);
      }
    };

    const iframeElement = iframeRef.current;
    if (iframeElement) {
      iframeElement.addEventListener("load", handleIframeLoad);
    }

    return () => {
      if (iframeElement) {
        iframeElement.removeEventListener("load", handleIframeLoad);
      }
    };
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Parent App</h1>
      <header className="flex items-end justify-center w-full gap-4 mb-4">
        <Button
          id="sendDataToChild"
          onClick={sendMessageToChild}
          type="button"
          variant={hasInterval ? "secondary" : "default"}
        >
          Send Single Message {hasInterval ? " Clear Interval" : ""}
          <SendIcon />
        </Button>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="intervalTime">Interval Time (ms):</label>
          <Input
            disabled={hasInterval}
            id="intervalTime"
            min={100}
            onChange={(e) => {
              setIntervalTime(Math.max(100, Number(e.target.value)));
            }}
            placeholder="Interval Time"
            step={100}
            type="number"
            value={interValTime}
          />
        </div>
        <Button
          id="sendDataToChild"
          variant={hasInterval ? "outline" : "default"}
          onClick={sendMessageToChildWithInterval}
          type="button"
        >
          {hasInterval ? "Stop Sending Data" : "Start Sending Data"}
          {hasInterval ? <SendingIcon /> : null}
        </Button>
      </header>
      {errorEvent ? (
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          {errorEvent}
        </div>
      ) : null}
      <iframe
        hidden={Boolean(errorEvent)}
        onError={(e) => {
          window.console.error("Iframe error:", e);
        }}
        onLoad={onIFrameLoad}
        ref={iframeRef}
        src={childOrigin}
        className="h-[75vh] w-full block mx-auto border-none shadow-md p-4 rounded-md overflow-hidden items-center justify-center"
        title="Child App"
      />
    </div>
  );
}

export default ParentApp;
