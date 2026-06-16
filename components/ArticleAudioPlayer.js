"use client";

import { useEffect, useMemo, useState } from "react";

export default function ArticleAudioPlayer({ post }) {
  const [isSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const articleText = useMemo(
    () =>
      [
        post.title,
        post.description,
        ...post.content.flatMap((section) => [
          section.heading,
          ...section.paragraphs
        ])
      ].join(". "),
    [post]
  );

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function playArticle() {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(articleText);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function pauseArticle() {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
  }

  function stopArticle() {
    window.speechSynthesis.cancel();
    setIsPaused(false);
    setIsSpeaking(false);
  }

  return (
    <section className="audio-reader" aria-label="Listen to article">
      <div>
        <span>Listen to article</span>
        <strong>
          {isSupported ? "Text-to-speech available" : "Audio not supported"}
        </strong>
      </div>
      <div className="audio-actions">
        <button type="button" onClick={playArticle} disabled={!isSupported}>
          {isPaused ? "Resume" : isSpeaking ? "Restart" : "Play"}
        </button>
        <button
          type="button"
          onClick={pauseArticle}
          disabled={!isSupported || !isSpeaking}
        >
          Pause
        </button>
        <button
          type="button"
          onClick={stopArticle}
          disabled={!isSupported || (!isSpeaking && !isPaused)}
        >
          Stop
        </button>
      </div>
    </section>
  );
}
