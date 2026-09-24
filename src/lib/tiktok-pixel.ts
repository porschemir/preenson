const PIXEL_ID = "D4DO8HRC77UCI3HO4RHG";

/** Loads the TikTok Pixel once, mirroring TikTok's official snippet. */
export function loadTikTokPixel() {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.__ttqLoaded) return;
  w.__ttqLoaded = true;

  const t = "ttq";
  w.TiktokAnalyticsObject = t;
  const ttq = (w[t] = w[t] || []);
  ttq.methods = [
    "page","track","identify","instances","debug","on","off","once","ready",
    "alias","group","enableCookie","disableCookie","holdConsent",
    "revokeConsent","grantConsent",
  ];
  ttq.setAndDefer = function (obj: any, method: string) {
    obj[method] = function () {
      obj.push([method].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for (const method of ttq.methods) ttq.setAndDefer(ttq, method);
  ttq.instance = function (id: string) {
    const inst = ttq._i[id] || [];
    for (const method of ttq.methods) ttq.setAndDefer(inst, method);
    return inst;
  };
  ttq.load = function (id: string, opts?: any) {
    const src = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[id] = [];
    ttq._i[id]._u = src;
    ttq._t = ttq._t || {};
    ttq._t[id] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[id] = opts || {};
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = src + "?sdkid=" + id + "&lib=" + t;
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(script, first);
  };

  ttq.load(PIXEL_ID);
  ttq.page();
}
