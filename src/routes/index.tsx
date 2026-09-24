import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { loadTikTokPixel } from "@/lib/tiktok-pixel";

const LANDING_BASE =
  "https://track.tryappstoday.com/visit/6de03a02-bcd7-4818-abc8-a96605f5857b";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Continue" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "For the best experience, this page needs to open in your browser.",
      },
      { property: "og:title", content: "Continue" },
      {
        property: "og:description",
        content: "For the best experience, this page needs to open in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function buildDestUrl() {
  const params = new URLSearchParams(window.location.search);
  let url = LANDING_BASE;
  let hasQuery = url.indexOf("?") > -1;

  params.forEach((value, key) => {
    url +=
      (hasQuery ? "&" : "?") +
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(value);
    hasQuery = true;
  });

  return url;
}

function toExternalUrl(url: string) {
  const isAndroid = /Android/i.test(navigator.userAgent || navigator.vendor || "");
  try {
    const urlObj = new URL(url);
    const pathAndQuery = urlObj.pathname + urlObj.search + urlObj.hash;
    if (isAndroid) {
      return "intent://" + urlObj.hostname + pathAndQuery + "#Intent;scheme=https;end;";
    }
    return url
      .replace(/^https:\/\//, "x-safari-https://")
      .replace(/^http:\/\//, "x-safari-http://");
  } catch {
    return url;
  }
}

function track(event: string, payload: Record<string, unknown>) {
  const ttq = (window as unknown as { ttq?: { track: (e: string, p: unknown) => void } }).ttq;
  if (ttq) {
    try {
      ttq.track(event, payload);
    } catch {
      /* noop */
    }
  }
}

function Index() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    loadTikTokPixel();
    track("ViewContent", { content_name: "Continue Page" });
  }, []);

  const proceed = () => {
    window.location.href = toExternalUrl(buildDestUrl());
  };

  const onContinue = () => {
    if (clicked) return;
    setClicked(true);
    track("ClickButton", { content_name: "Continue Button" });
    proceed();
  };

  return (
    <div className="ob-body">
      <div className="ob-wrapper">
        <div className="ob-icon-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>

        <h1 className="ob-title">
          Open in <span>browser</span>
        </h1>
        <p className="ob-subtitle">
          For the best experience, this page needs to open in your browser.
        </p>

        <button className="ob-cta" onClick={onContinue} disabled={clicked}>
          {clicked ? "Loading..." : "Continue →"}
        </button>
        <p className="ob-subtext">Opens in Safari or Chrome</p>
        <p className={`ob-fallback${clicked ? " visible" : ""}`}>
          Not working?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              proceed();
            }}
          >
            Tap here
          </a>
        </p>
      </div>
    </div>
  );
}
