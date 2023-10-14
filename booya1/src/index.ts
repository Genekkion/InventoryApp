// node_modules/itty-router/index.mjs
var e = ({ base: e2 = "", routes: t = [] } = {}) => ({ __proto__: new Proxy({}, { get: (o2, s2, r, n) => (o3, ...a) => t.push([s2.toUpperCase(), RegExp(`^${(n = (e2 + o3).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r }), routes: t, async handle(e3, ...o2) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams)
    a[e4] = void 0 === a[e4] ? t2 : [a[e4], t2].flat();
  for (let [a2, c2, l2, i2] of t)
    if ((a2 === e3.method || "ALL" === a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = i2;
      for (let t2 of l2)
        if (void 0 !== (s2 = await t2(e3.proxy || e3, ...o2)))
          return s2;
    }
} });
var o = (e2 = "text/plain; charset=utf-8", t) => (o2, s2) => {
  const { headers: r = {}, ...n } = s2 || {};
  return "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...r }, ...n });
};
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var l = o("text/html");
var i = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// src/index.js
var router = e();
router.get("/", () => {
  return new Response("Hello, how did u find this!");
});
router.get("/example/:text", ({ params }) => {
  let input = decodeURIComponent(params.text);
  let base64 = btoa(input);
  return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
    headers: {
      "Content-Type": "text/html"
    }
  });
});
router.get("/api/people", async (request, env, ctx) => {
  const PRESHARED_AUTH_HEADER_KEY = "X-Custom-PSK";
  const PRESHARED_AUTH_HEADER_VALUE = "mypresharedkey123";
  const psk = request.headers.get(PRESHARED_AUTH_HEADER_KEY);
  if (psk !== PRESHARED_AUTH_HEADER_VALUE) {
    return new Response("NOT AUTHORISED :(");
  }
  const { DATABASE } = env;
  const stmt = DATABASE.prepare("SELECT * FROM people");
  const { results } = await stmt.all();
  return new Response(JSON.stringify(results));
});
router.post("/post", async (request) => {
  let fields = {
    asn: request.cf.asn,
    colo: request.cf.colo
  };
  if (request.headers.get("Content-Type") === "application/json") {
    let json = await request.json();
    Object.assign(fields, { json });
  }
  const returnData = JSON.stringify(fields, null, 2);
  return new Response(returnData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
});
router.all("*", () => new Response("404, not found!", { status: 404 }));
var src_default = {
  fetch: router.handle
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
