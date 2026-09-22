---
title: "Serial Port Not Working On Fedora Due To GPS Daemon (gpsd)"
description: ''
pubDate: '2011-06-08'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "software"
---

**THE SERIAL PORT** on my Fedora 15 install, mysteriously refused to be accessed. I discovered that when inserting a USB-to-Serial device, GNU screen would refuse to access the created device `/dev/ttyUSB0`.

```
» screen /dev/ttyUSB0 115200
[screen is terminating]

```

Since I could use screen for serial access as root, and because the newly installed Fedora did have some hiccups in adding my user (the `/home/monzool` directory already existed from a previous Ubuntu install), I first checked group permissions, but they seemed fine for this situation.

```
» ll /dev/ttyUSB0
crw-rw----. 1 root dialout 188,  0 Jun  6 08:27 /dev/ttyUSB0

» groups
monzool tty wheel uucp dialout tcpdump screen vboxusers

```

Screen didn't offer much indication of the problem, but using strace I could see that some of the last things checked for permissions where `/var/run/screen`. I then removed that directory and recreated the directory setup by starting screen with sudo.

```
» ll /var/run/screen
drwxrwxr-x. 4 root    root    80 Jun  6 08:27 screen
» rm -rf /var/run/screen
» sudo screen /dev/ttyUSB0
» ll /var/run/screen
drwxrwxr-x. 4 root    screen    80 Jun  6 08:47 screen

```

This helped nothing! `:-(`

I then tried minicom, which was more informative about the problem

```
» minicom
minicom: cannot open /dev/ttyUSB0: Device or resource busy

```

This would mean that something else had hijacked the port. A quick check confirmed that something called `gpsd` was using the port.

»  lsof /dev/ttyUSB0
COMMAND PID   USER   FD   TYPE DEVICE SIZE/OFF  NODE NAME
gpsd    883 nobody    8u   CHR  188,0      0t0 11408 /dev/ttyUSB0
»  ps ax | grep gpsd
  883 ?        S

Now `gpsd` is for handling GPS devices, but it made no sense to trigger this daemon for a simple USB-to-Serial adapter.

Knowing what was causing the hazzle, I found this bug rapport [https://bugzilla.redhat.com/show\_bug.cgi?id=663124](https://bugzilla.redhat.com/show_bug.cgi?id=663124). In it, it is proposed to set `USBAUTO=no` in `/etc/sysconfig/gpsd`.

```
» echo "USBAUTO=no" >> /etc/sysconfig/gpsd

```

And sure enough, this fixed the problem. The USB-to-Serial adapter could now be accessed by any serial terminal.
