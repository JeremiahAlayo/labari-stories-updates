"use client";

import { useEffect, useRef, useState } from "react";

export default function AdminActionNotice() {
  const timeoutRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleClick(event) {
      const button = event.target.closest("button");

      if (!button || button.disabled || button.dataset.liveAction === "true") {
        return;
      }

      event.preventDefault();
      setMessage(
        "This control is ready in the interface, but needs backend integration before it can save real data."
      );

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => setMessage(""), 4200);
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`admin-action-toast ${message ? "show" : ""}`} role="status">
      {message}
    </div>
  );
}
