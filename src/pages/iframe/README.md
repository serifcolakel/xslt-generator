## ChildApp.tsx

```tsx
import { useEffect, useState } from "react";

/**
 * Child application component that listens for messages from the parent application.
 *
 * LOCAL-TEST: http://localhost:5173
 */
const childOrigin = "http://localhost:5173";

function ChildApp(): JSX.Element {
  const [receivedData, setReceivedData] = useState<{
    message?: unknown;
    count: number;
  } | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      if (event.origin !== childOrigin) return;
      window.console.log("Received data from parent:", event.data);
      setReceivedData((prev) => ({
        message: event.data as unknown,
        count: prev?.count ? prev.count + 1 : 1,
      }));
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!receivedData?.message || receivedData.count < 1) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen gap-y-4">
        <svg
          height={120}
          viewBox="0 0 16 16"
          width={120}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M4.99 12.5V1.7l2.15 2.15c.2.2.51.2.711 0s.2-.51 0-.711l-3.01-3c-.05-.04-.1-.08-.16-.1a.5.5 0 0 0-.38 0c-.06.02-.11.06-.15.1l-3 3c-.2.2-.2.51 0 .711s.51.2.711 0l2.15-2.15v10.8c0 .28.22.5.5.5s.5-.22.5-.5h-.02zM11.3 16a.5.5 0 0 0 .38 0c.06-.03.12-.06.16-.11l3-3c.2-.2.2-.51 0-.711s-.51-.2-.71 0l-2.15 2.15v-10.8c0-.28-.22-.5-.5-.5s-.5.22-.5.5v10.8l-2.15-2.15c-.2-.2-.51-.2-.711 0s-.2.51 0 .711l3 3c.05.04.1.08.16.11z"
            fill="red"
            fillRule="evenodd"
          />
        </svg>
        <p>Awaiting initial message...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 rounded-lg gap-y-4">
      <h2>Child Application</h2>
      <p>Received messages: {receivedData.count}</p>
      <h3>Received data:</h3>
      <div className="data-display">
        <pre className="p-2 text-sm text-gray-600 bg-gray-100 rounded-md">
          {JSON.stringify(receivedData.message, null, 2)}
        </pre>
      </div>
      <code className="p-2 text-sm text-gray-600 bg-gray-100 rounded-md">
        {`window.parent.postMessage("Hello from child", "http://localhost:3001");`}
      </code>
    </div>
  );
}




export default ChildApp;
```

## Usage

https://github.com/user-attachments/assets/4f04efa3-0626-45e8-93ca-fdc6e0e880a8


