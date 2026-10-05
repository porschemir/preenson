import { createFileRoute } from "@tanstack/react-router";

const LANDING_BASE = "https://rcxchp.rwadlar.com/";

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
  const ua = navigator.userAgent || navigator.vendor || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  try {
    const urlObj = new URL(url);
    const pathAndQuery = urlObj.pathname + urlObj.search + urlObj.hash;
    if (isAndroid) {
      return (
        "intent://" +
        urlObj.hostname +
        pathAndQuery +
        "#Intent;scheme=https;S.browser_fallback_url=" +
        encodeURIComponent(url) +
        ";end;"
      );
    }
    if (isIOS) {
      return url
        .replace(/^https:\/\//, "x-safari-https://")
        .replace(/^http:\/\//, "x-safari-http://");
    }
    return url;
  } catch {
    return url;
  }
}

function Index() {
  const proceed = () => {
    const dest = buildDestUrl();
    const target = toExternalUrl(dest);
    try {
      (window.top ?? window).location.href = target;
    } catch {
      window.open(dest, "_blank");
    }
    // If the app switch didn't happen, fall back to a normal visit
    window.setTimeout(() => {
      if (document.visibilityState === "visible" && target !== dest) {
        window.location.href = dest;
      }
    }, 1500);
  };

  const onContinue = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const dest = buildDestUrl();
    event.currentTarget.href = dest;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      event.preventDefault();
      proceed();
    }
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

        <a
          className="ob-cta"
          href={LANDING_BASE}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onContinue}
        >
          Continue →
        </a>
        <p className="ob-subtext">Opens in Safari or Chrome</p>
        <p className="ob-fallback visible">
          Not working?{" "}
          <a
            href={LANDING_BASE}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tap here
          </a>
        </p>
      </div>
    </div>
  );
}
