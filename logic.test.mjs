import test from 'node:test';
import assert from 'node:assert/strict';
import { adapterDetails } from './adapterDetails.mjs';
test('address masks and zero metrics', () => {
  const fields = adapterDetails({ipv4:['192.0.2.1'],ipv6:[],dnsServers:[],addresses:[{address:'192.0.2.1',prefixLength:24,subnetMask:'255.255.255.0'}],dhcpEnabled:false,ipv4Metric:0,ipv6Metric:10});
  assert.ok(fields.find(([key])=>key==='子网掩码')?.[1].includes('255.255.255.0'));
  assert.equal(fields.find(([key])=>key==='IPv4 / IPv6 跃点')?.[1],'0 / 10');
});
