---
title: "Linux Power Management on a Dell Precision 5470"
description: ''
pubDate: '2023-05-31'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "hardware"
  - "linux"
  - "software"
---

**I STARTED A** new job and thus was handed a new laptop, a Dell 5470. It came with Windows (not familiar with Windows versions, but looked differently that last time a had a Windows booted), so I quickly installed Linux on it. On first day commuting home, I realized the laptop would burn hot in my bag, even though I put it in sleep mode. And then when checking at home, it had already consumed most of the battery charge.

```bash
» cat /sys/class/power_supply/BAT*/capacity
25
```

It was clearly doing some work instead of actual sleeping, even though it appeared to be in sleep mode.

System modes \*used\* to be represented in the states S0 to S5, where S0 is on state, and the rest are degrees of power saving sleep modes. `S3` would typically be my most utilized state as this is suspend to RAM. You close the lid of the laptop, and with very little power consumption you should be able to resume days later by opening the lid again. If you need even longer retention, state `S4` is hibernation where all state and content is persisted to storage.

- kernel.org details of power-states: https://www.kernel.org/doc/Documentation/power/states.txt
- Microsoft details of power-states: https://learn.microsoft.com/en-us/windows/win32/power/system-power-states

Now laptop vendors are in the process of shifting power management to ["Modern standby"](https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/modern-standby). This is a new power management system proposed by Microsoft to allow an experience similar to mobile phones. So if power _on_ is state `S0`, then this new power modern power state is `S0 low power idle`. The linux kernel calls this state `s2idle`.

```bash
» cat /sys/power/mem_sleep
[s2idle]
```

(More on kernel sleep states here: https://docs.kernel.org/admin-guide/pm/sleep-states.html)

Systems implementing modern standby typically do not implement the old `S1` - `S3` power states. Attempting to set any other state than `s2idle` would cause an error

```bash
» echo deep > /sys/power/mem_sleep
-bash: echo: write error: Invalid argument

» echo mem > /sys/power/state
-bash: echo: write error: Invalid argument
```

This situation was not sustainable. Not being able to put the machine in a sleep mode, would mean that either I would have to shut off the laptop at night, or always have it connected to power and just wasting energy.

Apparently Dell is particularly bad at implementing UEFI and power-management. There are tons of complaints to be found online of it not working, both from people running Windows and Linux.

- [https://www.dell.com/community/Precision-Mobile-Workstations/precision-5550-S3-sleep-not-working/td-p/7759319](https://www.dell.com/community/Precision-Mobile-Workstations/precision-5550-S3-sleep-not-working/td-p/7759319)
- [https://askubuntu.com/questions/1364133/dell-vostro-3500-with-modern-suspend-s0-fan-is-running-battery-drain-overhea](https://askubuntu.com/questions/1364133/dell-vostro-3500-with-modern-suspend-s0-fan-is-running-battery-drain-overhea)

Some people had luck of adding `mem_sleep_default=deep` as a [kernel option](https://martinpoehlmann.com/posts/tech/2021-07-30-dell-s3-modern-sleep/)). Others had resorted to [patching](https://dev.to/epassaro/fix-suspend-issues-on-dell-7405-2-in-1-3l1b) the Linux kernel.

Even though I was running a late kernel, I was not able to get anything to work.

```bash
» uname
Linux L5 6.2.0-20-generic #20-Ubuntu
```

Some people claimed that the solutions would not work as Dell had disabled the `S3` power state deliberately on firmware level.

I decided to just go for hibernation, albeit this is know to not always work (why are low-power modes not a solved problem already?). Getting hibernation to work on Linux is not straight forward. A lot of poking in config files and bootloaders are necessary. In the end it didn't work. This is my first computer with UEFI bootloader, so took a while to realize that this doesn't work when [secure boot is enabled](https://wiki.debian.org/SecureBoot#Secure_Boot_limitations). I could have disabled that, but figured I'd go back to the sleep mode, as that was the real power mode I desired. It least I got my swapfile setup done in the process 😄

A very long google session longer, deep in this thread on the Dell forum, a promising hint finally emerges. It references a ticket on kernel.org about not being able to achieve S0ix on a Dell XPS 13. This ticket had an interesting [comment](https://bugzilla.kernel.org/show_bug.cgi?id=211879#c32):

> It appears that the method of changing the "Storage" setting in the BIOS from "RAID" (VDM) to "AHCI" also fixes the issue of the machine not entering S0ix state.

So I changed that in the UEFI settings. The EUFI gave a big warning message claiming that this would render the system unbootable… meh, changed it anyway

Lo and behold, memory suspend suddenly worked when applying the power-state manually

```bash
echo mem > /sys/power/state
```

To make the experience a little bit better, I hooked a script to the lid close event, that would then apply the power-state. The resulting structure looks like this:

```bash
» find /etc/acpi/
/etc/acpi/
/etc/acpi/lid.sh
/etc/acpi/events
/etc/acpi/events/lm_lid
```

First registers a script to be called on ACPI events.

```bash
cat << 'EOF' > /etc/acpi/events/lm_lid
event=button/lid.*
action=/etc/acpi/lid.sh
EOF
```

Then the event handling script itself

```bash
cat << 'EOF' > /etc/acpi/lid.sh
#!/bin/bash

lid_state=$(grep -oE '(open|closed)' /proc/acpi/button/lid/*/state)
if [[ "${lid_state}" == "closed" ]]; then
    logger --tag "acpi/lid.sh" "lid closed => suspend to memory"
    echo mem > /sys/power/state
fi
EOF
```

Set execution bit

```bash
» chmod +x /etc/acpi/lid.sh
```

Restart the acpid daemon to make the scripts take effect

```bash
systemctl restart acpid.service
```

This should make sleep mode work on lid closing.

More details on ACPI events can be found here: https://linuxconfig.org/how-to-handle-acpi-events-on-linux

## Bonus information

An interesting command for getting battery details is `upower`

```bash
» upower -i /org/freedesktop/UPower/devices/battery_BAT0
  native-path:          BAT0
  vendor:               BYD
  model:                DELL CDTT223
  serial:               1551
  power supply:         yes
  updated:              2023-05-09T09:37:48 CEST (4 seconds ago)
  has history:          yes
  has statistics:       yes
  battery
    present:             yes
    rechargeable:        yes
    state:               fully-charged
    warning-level:       none
    energy:              63.602 Wh
    energy-empty:        0 Wh
    energy-full:         67.3442 Wh
    energy-full-design:  70.6244 Wh
    energy-rate:         0.0154 W
    voltage:             17.245 V
    charge-cycles:       N/A
    percentage:          94%
    temperature:         30.4 degrees C
    capacity:            95.3554%
    technology:          lithium-polymer
    icon-name:          'battery-full-charged-symbolic'
```

Links:

- [High power usage when suspended](https://askubuntu.com/questions/1347933/high-power-usage-when-suspended)
- [Dell Vostro 3500 with modern suspend S0 - fan is running, battery drain, overheating](https://askubuntu.com/questions/1364133/dell-vostro-3500-with-modern-suspend-s0-fan-is-running-battery-drain-overhea)
- [How to achieve S0ix states in linux](https://01.org/blogs/qwang59/2018/how-achieve-s0ix-states-linux)
