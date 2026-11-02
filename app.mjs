import { $, action, copy, status, ready, call, escapeHtml } from "./common.mjs";
import { adapterDetails } from "./adapterDetails.mjs";
let adapters = [];
let report = "";
function render() {
  const active = adapters.filter(
    (a) => $("#inactive").checked || a.status === "up",
  );
  $("#overview").innerHTML = [
    [
      "内网 IPv4",
      adapters.find((a) => a.status === "up" && a.ipv4.length)?.ipv4[0] || "—",
    ],
    ["默认网关", adapters.find((a) => a.gateway)?.gateway || "—"],
    ["在线网卡", adapters.filter((a) => a.status === "up").length],
  ]
    .map(
      ([k, v]) =>
        '<div class="ip-card"><small>' +
        k +
        "</small><b>" +
        escapeHtml(v) +
        "</b></div>",
    )
    .join("");
  $("#adapters").innerHTML =
    active
      .map(
        (a) =>
          '<section class="panel"><div class="row"><strong>' +
          escapeHtml(a.name) +
          '</strong><span class="badge">' +
          escapeHtml(a.status) +
          '</span><span class="muted">' +
          escapeHtml(a.description) +
          '</span></div><div class="adapter-info">' +
          adapterDetails(a)
            .map(
              ([k, v]) =>
                '<span class="label">' +
                k +
                "</span><span>" +
                escapeHtml(v || "—") +
                "</span>",
            )
            .join("") +
          "</div></section>",
      )
      .join("") || '<div class="empty">没有已连接的网卡</div>';
}
async function refresh() {
  adapters = await call("system.netinterfaces");
  render();
  report = await call("system.networkdetails");
  $("#full-report").textContent = report;
  status("更新于 " + new Date().toLocaleTimeString());
}
$("#inactive").onchange = render;
$("#refresh").onclick = action(refresh);
$("#copy").onclick = action(() =>
  copy(report || adapters.map(a=>a.name + "\n" + adapterDetails(a).map(([k,v])=>k+": "+(v ?? "—")).join("\n")).join("\n\n")),
);
$("#public").onclick = action(async () => {
  const b = $("#public");
  b.disabled = true;
  try {
    status("正在查询公网 IP…");
    const r = await call("net.fetch", {
      url: "https://api.ipify.org?format=json",
    });
    if (r.status !== 200) throw Error("公网查询失败：HTTP " + r.status);
    const ip = JSON.parse(r.body).ip;
    $("#network").textContent = "公网 IP：" + ip;
    status("查询完成 · 出口地址受代理影响");
  } finally {
    b.disabled = false;
  }
});
$("#latency").onclick = action(async () => {
  $("#latency").disabled = true;
  $("#network").replaceChildren();
  try {
    for (const [name, url] of [
      ["百度", "https://www.baidu.com"],
      ["GitHub", "https://github.com"],
      ["Microsoft", "https://www.microsoft.com"],
    ]) {
      const line = document.createElement("div");
      line.textContent = name + "：测试中…";
      $("#network").append(line);
      const start = performance.now();
      try {
        const r = await call("net.fetch", { url, method: "HEAD" });
        line.textContent =
          name +
          "：" +
          Math.round(performance.now() - start) +
          " ms · HTTP " +
          r.status;
      } catch {
        line.textContent = name + "：连接失败";
      }
    }
    status("显示 HTTP 往返耗时（包含授权等待及代理影响）");
  } finally {
    $("#latency").disabled = false;
  }
});
ready(refresh);
