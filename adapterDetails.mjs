export function adapterDetails(a) {
  const speed = value => value ? (value / 1000000).toLocaleString() + " Mbps" : "—";
  const labels = {up:"已连接",down:"未连接",dormant:"休眠",unknown:"未知"};
  return [
    ["状态", labels[a.status] || a.status],
    ["描述", a.description],
    ["IPv4", a.ipv4.join("\n")],
    ["IPv6", a.ipv6.join("\n")],
    ["地址 / 前缀", (a.addresses || []).map(x=>x.address + "/" + x.prefixLength).join("\n")],
    ["子网掩码", (a.addresses || []).filter(x=>x.subnetMask).map(x=>x.address + " → " + x.subnetMask).join("\n")],
    ["默认网关", (a.gateways || [a.gateway]).filter(Boolean).join("\n")],
    ["DNS 服务器", a.dnsServers.join("\n")],
    ["DNS 后缀", a.dnsSuffix],
    ["物理地址 MAC", a.mac],
    ["DHCP 已启用", a.dhcpEnabled === undefined ? "—" : a.dhcpEnabled ? "是" : "否"],
    ["DHCPv4 服务器", a.dhcpV4Server],
    ["DHCPv6 服务器", a.dhcpV6Server],
    ["接口索引 / 类型", [a.interfaceIndex,a.interfaceType].filter(x=>x!==undefined).join(" / ")],
    ["MTU", a.mtu],
    ["发送 / 接收速率", speed(a.transmitLinkSpeed) + " / " + speed(a.receiveLinkSpeed)],
    ["IPv4 / IPv6 跃点", [a.ipv4Metric,a.ipv6Metric].filter(x=>x!==undefined).join(" / ")],
  ];
}
