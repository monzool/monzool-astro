---
title: "OpenSuse Network Configuration Problems"
description: ''
pubDate: '2008-03-12'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "software"
---

**YAST MAY BE** a powerful tool, but sometimes Suse and OpenSuse still manage to screw up their configuration so not even Yast can rectified the situation. We use Suse and OpenSuse at work, and twice I've experienced that the network configuration cannot recover from a netcard being changed. During boot an error message **"eth0 renamed to eth2"** would show, followed by another error message (after a looong timeout) **"no configuration found for eth2"** and afterwards DHCP would fail. After booting I would have to run `ifup-dhcp eth2` to get network up and running.

Okay. The situation is amendable and requires only two setup modifications (hacks). First an easy edit in the udev network rules, to fix that the one and only netcard was being named eth2 and not eth0.

The netcard MAC-addresses and names are associated in the udev network persistent name rule-file. `/etc/udev/rules.d/30-net_persistent_names.rules`

`SUBSYSTEM=="net", ACTION=="add", SYSFS{address}=="00:0c:29:14:e6:1b", IMPORT="/lib/udev/rename_netiface %k eth0"` `SUBSYSTEM=="net", ACTION=="add", SYSFS{address}=="00:0c:29:e9:d1:b6", IMPORT="/lib/udev/rename_netiface %k eth1"` `SUBSYSTEM=="net", ACTION=="add", SYSFS{address}=="00:0c:29:32:11:fd", IMPORT="/lib/udev/rename_netiface %k eth2"`

This file contained some mappings not belonging to any netcards in my current system. Ensuring that the MAC-address mached the `eth2` entry, I renamed the entry and deleted the other two.

`SUBSYSTEM=="net", ACTION=="add", SYSFS{address}=="00:0c:29:32:11:fd", IMPORT="/lib/udev/rename_netiface %k eth0"`

If booting after this modification, the first error message would vanish and, as remapping now is no longer enforced, the second would now be "no configuration found for _eth0_".

The missing configuration can be fixed in Yast by creating a new ethernet device called `ifcfg-eth0`, or as I did, by just soft-linking the existing network configuration to that name.

```
# ln -s /etc/sysconfig/network/ifcfg-eth-bus-pci-0000\\:02\\:00.0 
/etc/sysconfig/network/ifcfg-eth0

```

Yehaa. Network errors be gone, and automatic DHCP now working `:-)`.

I've experienced this problem on Suse 10.0 on a fresh install where I changed a VMware virtual netcard from the computers build-in netcard to a secondary USB netcard. At that time I didn't want to spend to much time on it and just reinstalled. We'd just upgraded to OpenSuse 10.2 and I was handed a copy of a colleagues VMware image. As his netcard did not have the same properties as mine (i.e. MAC-address) I was hurled into the same problems once again.
