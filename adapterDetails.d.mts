export interface Adapter {
  status?: string; description?: string; ipv4: string[]; ipv6: string[]; dnsServers: string[];
  addresses?: {address:string;prefixLength:number;subnetMask?:string}[];
  gateways?: string[]; gateway?: string; dnsSuffix?: string; mac?: string;
  dhcpEnabled?: boolean; dhcpV4Server?:string; dhcpV6Server?:string;
  interfaceIndex?:number; interfaceType?:number; mtu?:number;
  transmitLinkSpeed?:number; receiveLinkSpeed?:number; ipv4Metric?:number; ipv6Metric?:number;
}
export function adapterDetails(adapter: Adapter): [string, string | number | undefined][];
