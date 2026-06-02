"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
