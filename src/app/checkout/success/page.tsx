"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");

  const sessionId = searchParams.get("session_id");
  const tier = searchParams.get("tier");
  const apiKey = searchParams.get("apiKey");

  useEffect(() => {
    // MVP: 直接显示成功，实际应该调用 webhook 验证
    setStatus("success");
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {status === "processing" ? (
          <>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Processing Payment...</h1>
            <p className="text-gray-400">Please wait while we confirm your subscription.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to {tier?.toUpperCase()}!</h1>
            <p className="text-gray-400 mb-6">
              Your subscription is active. You can now use your API key without limits.
            </p>
            {apiKey && (
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-400 mb-2">Your API Key</p>
                <code className="text-blue-400 font-mono text-sm break-all">{apiKey}</code>
              </div>
            )}
            <a
              href="/playground"
              className="inline-block bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold"
            >
              Go to Playground
            </a>
          </>
        )}
      </div>
    </main>
  );
}
