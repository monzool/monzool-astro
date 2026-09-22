---
title: "Eternal Terminal on Arch/Manjaro and Ubuntu"
description: ''
pubDate: '2022-06-17'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "software"
---

**THE ETERNAL TERMINAL** ([_et_](https://eternalterminal.dev/) from now on) is an alternative to the normal ssh session. What it promises contrary to a normal ssh session is a reliable connection that will auto-reconnect seamlessly without interrupted workflow. Another project mosh promises the same benefits as et, but that project have no scroll buffer (an [issue](https://github.com/mobile-shell/mosh/issues/2) unresolved since 2011). This requires you to use screen or tmux to have history scrolling. IMO this is an annoying lack of functionality, but fortunately et do provide history scrolling. The _et_ frontpage have a benefits comparison.

In this runthrough a remote Manjaro machine run the _et_ server, while the client is an Ubuntu machine.

## Arch/Manjaro

The client and server programs are supplied in the same package. Grab it from here: https://aur.archlinux.org/packages/eternalterminal-server

After download, a simple way to install it, is by using [yay](https://github.com/Jguer/yay)

```bash
Manjaro» yay -Ss eternalterminal-server
aur/eternalterminal-server 6.2.1-1 (+6 0.00) (Installed)
    Re-Connectable Terminal connection. Includes only the server.
```

```bash
Manjaro» yay -S aur/eternalterminal-server
```

Looking at the content of the package, it can be seen that both the client and server programs are included. Also included is a _systemd_ script for controlling the server

```bash
Manjaro» pacman -Ql eternalterminal-server
eternalterminal-server /etc/
eternalterminal-server /etc/et.cfg
eternalterminal-server /usr/
eternalterminal-server /usr/bin/
eternalterminal-server /usr/bin/etserver
eternalterminal-server /usr/bin/etterminal
eternalterminal-server /usr/lib/
eternalterminal-server /usr/lib/systemd/
eternalterminal-server /usr/lib/systemd/system/
eternalterminal-server /usr/lib/systemd/system/et.service
```

The _et_ server must manually be started if not wanting to reboot after install

```bash
Manjaro» systemctl status et
○ et.service - Eternal Terminal
     Loaded: loaded (/usr/lib/systemd/system/et.service; disabled; vendor preset: disabled)
     Active: inactive (dead)

Manjaro» systemctl start et
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to start 'et.service'.
Multiple identities can be used for authentication:
 1. monzool
 2. autotest
Choose identity to authenticate as (1-2): 1
Password: 
==== AUTHENTICATION COMPLETE ====

Manjaro» systemctl status et
● et.service - Eternal Terminal
     Loaded: loaded (/usr/lib/systemd/system/et.service; disabled; vendor preset: disabled)
     Active: active (running) since Wed 2022-06-08 10:46:23 CEST; 38s ago
   Main PID: 1630278 (etserver)
      Tasks: 11 (limit: 9160)
     Memory: 3.0M
        CPU: 149ms
     CGroup: /system.slice/et.service
             └─1630278 /usr/bin/etserver --cfgfile=/etc/et.cfg

Jun 08 10:46:23 manjaro systemd[1]: Started Eternal Terminal.
Jun 08 10:46:23 manjaro etserver[1630278]: Eternal Terminal collects crashes and errors in order to help us improve your experience.
Jun 08 10:46:23 manjaro etserver[1630278]: The data collected is anonymous.
Jun 08 10:46:23 manjaro etserver[1630278]: You can opt-out of telemetry by setting the environment variable ET_NO_TELEMETRY to any non-empty value.
```

The _et_ server is now running, and ready for connection.

## Ubuntu

Installing the _et_ client on Ubuntu is simple, as a ppa provides a packaged edition (although at preset, the latest version was not available as a ppa)

```bash
Ubuntu» sudo apt-get install -y software-properties-common
Ubuntu» sudo add-apt-repository ppa:jgmath2000/et
Ubuntu» sudo apt update
Ubuntu» sudo apt install et
```

## Usage

Connecting to the server is as simple as basic _ssh_.

```bash
Ubuntu» et monzool@1.1.1.1
monzool@1.1.1.1's password: 

Manjaro» 
```

(real IP replaced with 1.1.1.1)

If having port-forwarding on the ssh port, this needs to be specified.

```bash
Ubuntu» et --ssh-option 'Port 2222' monzool@1.1.1.1
```

(ref: [EternalTerminal/issues/266#issuecomment-1114026701](https://github.com/MisterTea/EternalTerminal/issues/266#issuecomment-1114026701))

Note that the _et_ port itself also can be moved, so make sure not to mix up the _ssh_ and _et_ ports, as this causes failure 😉

```bash
Ubuntu» et monzool@1.1.1.1:2222                    
monzool@1.1.1.1's password: 
[1]    1458478 IOT instruction (core dumped)  et monzool@1.1.1.1:2222
```
