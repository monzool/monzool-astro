---
title: "ESET crashing with locale error"
description: ''
pubDate: '2025-04-24'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "software"
---

**ESET RUNTIME ERROR** because of locale settings. That is what I by coincident discovered one day, when looking at the Ubuntu syslog for other things. [ESET](https://www.eset.com/) is a malware protection software that is bestowed upon us by $WORK. It works on Windows, Mac and Linux and usually it doesn’t make much fuzz.

The syslog was filled with “endless” entries of runtime errors due to failure in locale initialization:

```bash
root@L5:~# tail -f /var/log/syslog
2025-04-22T06:46:16.404457+02:00 L5 egui[9000]: Locale not supported by C library.#012#011Using the fallback 'C' locale.
2025-04-22T06:46:16.901839+02:00 L5 eset.eea[9000]: terminate called after throwing an instance of 'std::runtime_error'
2025-04-22T06:46:16.902010+02:00 L5 eset.eea[9000]:   what():  locale::facet::_S_create_c_locale name not valid
2025-04-22T06:46:17.573264+02:00 L5 eset.eea[4139]: Aborted (core dumped)
```

First question might be: “Why are you poking around in the syslog when we modern linux folks have journald?”. It’s quite possibly habit, but I just find it easier to open the syslog file at browse around for stuff

**Sidenote:** journald

I have yet to find a good way to **discover** these kind of issues with `journalctl`. There is `journalctl -p err..alert -x --boot` but for this case none of the messages can be found with that filter! Also, annoyingly, the core dump errors are listed as owned by the `systemd-coredump` service, and not the `eea.service` (for reasons discovered later there is a reason for that in that case).

Then having already discovered a suspicious message, does not always make it straight forward to investigate further.

```bash
❱ journalctl --since "2 days ago" -g 'locale\:\:facet\:\:_S_create_c_locale'
Apr 22 06:41:59 L5 eset.eea[4204]:   what():  locale::facet::_S_create_c_locale name not valid
```

That entry told us that it originated from `eset.eee`, but as that is not part of the `MESSAGE`, grepping for it

```bash
❱ journalctl --since "2 days ago" -g 'eset.eea'
```

will yield no result. Instead we can attempt to filter on the script name

```bash
❱ journalctl --since "2 days ago" _COMM=eset.eea
```

which also yields no results. Then using the syslog identifier finally gives a result

```bash
❱ journalctl --since "2 days ago" SYSLOG_IDENTIFIER=eset.eea
Apr 22 06:41:59 L5 eset.eea[4204]: terminate called after throwing an instance of 'std::runtime_error'
Apr 22 06:41:59 L5 eset.eea[4204]:   what():  locale::facet::_S_create_c_locale name not valid
Apr 22 06:42:00 L5 eset.eea[4139]: Aborted (core dumped)
```

Ignoring the rotated syslog files, then there is a lot of entries of that error

```bash
root@L5:~# grep "locale::facet::_S_create_c_locale" /var/log/syslog | wc -l
2750
```

The current syslog file ranges 13 days of errors (using `sed` to print only first and last hits)

```bash
root@L5:~# grep "locale::facet::_S_create_c_locale" /var/log/syslog | sed -n '1p;$p'
2025-04-10T06:44:53.808725+02:00 L5 eset.eea[1227413]:   what():  locale::facet::_S_create_c_locale name not valid
2025-04-22T09:51:36.491258+02:00 L5 eset.eea[42077]:   what():  locale::facet::_S_create_c_locale name not valid
```

The error let me to check the core dump registry

```bash
root@L5:~# coredumpctl | head
TIME                             PID  UID  GID SIG     COREFILE EXE                                                                                                              SIZE
Mon 2025-03-17 07:58:38 CET  4065929 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 07:59:39 CET  4066715 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:00:40 CET  4067264 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:01:41 CET  4067862 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:02:42 CET  4068615 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:03:43 CET  4074040 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:04:45 CET  4077727 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:05:46 CET  4080214 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
Mon 2025-03-17 08:06:47 CET  4088606 1000 1000 SIGABRT missing  /opt/eset/eea/lib/egui
```

Well. It sure crashes a lot 😅

```bash
root@L5:~# ls -1 /var/lib/systemd/coredump/*egui* | wc -l
1728

root@L5:~# du -chs /var/lib/systemd/coredump/*egui*
3.7G    total
```

Looking more closely to the core dumps, confirms that the error appear to be some locale related stuff on the main thread of the program egui.

```bash
root@L5:~# coredumpctl info /opt/eset/eea/lib/egui
       Message: Process 4067264 (egui) of user 1000 dumped core.

                Module libstdc++.so.6 from deb gcc-14-14.2.0-4ubuntu2~24.04.amd64
                Module libsystemd.so.0 from deb systemd-255.4-1ubuntu8.4.amd64
                Module libzstd.so.1 from deb libzstd-1.5.5+dfsg2-2build1.1.amd64
                Module libgcc_s.so.1 from deb gcc-14-14.2.0-4ubuntu2~24.04.amd64
                Module libprotobuf.so.32 without build-id.
                Module libcommon.so without build-id.
                Module egui without build-id.
                Stack trace of thread 4067269:
                #0  0x00007cac3e89eb1c __pthread_kill_implementation (libc.so.6 + 0x9eb1c)
                #1  0x00007cac3e84526e __GI_raise (libc.so.6 + 0x4526e)
                #2  0x00007cac3e8288ff __GI_abort (libc.so.6 + 0x288ff)
                #3  0x00007cac40563623 n/a (libcommon.so + 0x363623)
                #4  0x00007cac40a5223a _ZN10__cxxabiv111__terminateEPFvvE (libcommon.so + 0x85223a)
                #5  0x00007cac40a522a5 _ZSt9terminatev (libcommon.so + 0x8522a5)
                #6  0x00007cac40a523f7 __cxa_throw (libcommon.so + 0x8523f7)
                #7  0x00007cac40564f16 _ZSt21__throw_runtime_errorPKc (libcommon.so + 0x364f16)
                #8  0x00007cac40b07ce8 _ZNSt6locale5facet18_S_create_c_localeERP15__locale_structPKcS2_ (libcommon.so + 0x907ce8)
                #9  0x00005f5d61c8eff8 _ZNSt6locale5_ImplC2EPKcm (egui + 0x8eff8)
                #10 0x00005f5d61c902a6 _ZNSt6localeC1EPKc (egui + 0x902a6)
                #11 0x00005f5d61c87ac8 _ZN9AgentView26ConvertISO8601ToLocaleTimeERKNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEE (egui + 0x87ac8)
                #12 0x00005f5d61c885a3 _ZN9AgentView6UpdateERK17ConfigurationData (egui + 0x885a3)
                #13 0x00005f5d61c82d35 _ZN13WindowManager26ProcessConfigurationChangeERK17ConfigurationData (egui + 0x82d35)
                #14 0x00005f5d61c53fc0 _ZN16GuiThreadManager11ProcessTaskEv (egui + 0x53fc0)
                #15 0x00005f5d61c7f9be _ZN19GtkGuiThreadManager8OnWakeUpEPv (egui + 0x7f9be)
                #16 0x00007cac3f59d48e n/a (libglib-2.0.so.0 + 0x5d48e)
                #17 0x00007cac3f5fc717 n/a (libglib-2.0.so.0 + 0xbc717)
                #18 0x00007cac3f59ca53 g_main_context_iteration (libglib-2.0.so.0 + 0x5ca53)
                #19 0x00007cac3f7d388d g_application_run (libgio-2.0.so.0 + 0xe788d)
                #20 0x00005f5d61c80835 _ZN19GtkGuiThreadManager10RunGuiLoopEv (egui + 0x80835)
                #21 0x00005f5d61c4a749 n/a (egui + 0x4a749)
                #22 0x00005f5d61c90793 n/a (egui + 0x90793)
                #23 0x00007cac3e89ca94 start_thread (libc.so.6 + 0x9ca94)
                #24 0x00007cac3e929c3c __clone3 (libc.so.6 + 0x129c3c
```

I checked my locale settings, but it seemed fine

```bash
root@L5:~# locale
LANG=C.UTF-8
LANGUAGE=en_GB
LC_CTYPE=C.UTF-8
LC_NUMERIC=en_US.UTF-8
LC_TIME=en_DK.UTF-8
LC_COLLATE=C.UTF-8
LC_MONETARY=en_DK.UTF-8
LC_MESSAGES=C.UTF-8
LC_PAPER=C.UTF-8
LC_NAME=en_DK.UTF-8
LC_ADDRESS=en_DK.UTF-8
LC_TELEPHONE=en_DK.UTF-8
LC_MEASUREMENT=en_DK.UTF-8
LC_IDENTIFICATION=en_DK.UTF-8
LC_ALL=
```

I then thought to check the environment of the ESET docker service.

```bash
root@L5:~# systemctl show eea.service --property=Environment
Environment=
```

I’m guessing here that the ESET eea.service starts very early and doesn’t get any LANG or LC\_ALL passed?

Lets try a workaround this using systemd and poke the service configuration to specify those locale settings specifically for ESET

```bash
root@L5:~# systemctl status eea.service
● eea.service - ESET Endpoint Antivirus
     Loaded: loaded (/usr/lib/systemd/system/eea.service; enabled; preset: enabled)
     Active: active (running) since Tue 2025-04-22 07:38:41 CEST; 1h 5min ago
```

Patching _/usr/lib/systemd/system/eea.service_

```diff
[Unit]
Description=ESET Endpoint Antivirus
After=network.target
Before=eea_upgrade.service
Requires=eea_upgrade.service
ConditionPathExists=!/var/opt/eset/eea/updated/app/eea.bin

[Service]
Type=notify
+Environment=LC_ALL=C
+Environment=LANG=C
ExecStartPre=/opt/eset/eea/lib/install_scripts/check_start.sh
ExecStart=/opt/eset/eea/sbin/startd
ExecStartPost=-/opt/eset/eea/lib/install_scripts/launch_gui_all_users.sh
ExecStopPost=-/usr/bin/killall /opt/eset/eea/lib/egui --quiet
KillMode=process
Restart=always
TimeoutStartSec=180
TimeoutStopSec=120
OOMScoreAdjust=-800
```

Reload

```bash
systemctl daemon-reload
systemctl restart eea.service
```

Verifying it is set

```bash
root@L5:~# systemctl show eea.service --property=Environment
Environment=LANG=C.UTF-8 LC_ALL=C.UTF-8
```

Still crashes

```bash
root@L5:~# tail -f /var/log/syslog
2025-04-22T09:02:01.799953+02:00 L5 cron[1719]: (*system*eset-eea-vapm) RELOAD (/etc/cron.d/eset-eea-vapm)
2025-04-22T09:02:15.027347+02:00 L5 egui[25254]: Locale not supported by C library.#012#011Using the fallback 'C' locale.
2025-04-22T09:02:15.526396+02:00 L5 eset.eea[25254]: terminate called after throwing an instance of 'std::runtime_error'
2025-04-22T09:02:15.526550+02:00 L5 eset.eea[25254]:   what():  locale::facet::_S_create_c_locale name not valid
```

Hmm. What starts what?

```bash
root@L5:~# ps -eo pid,ppid,comm,cmd | grep eset
   1295       2 nvidia-modeset/ [nvidia-modeset/kthread_q]
   1296       2 nvidia-modeset/ [nvidia-modeset/deferred_close_kthread_q]
   2202       1 ERAAgent        /opt/eset/RemoteAdministrator/Agent/ERAAgent --daemon --pidfile /var/run/eraagent.pid
   2276    2250 Xorg            /usr/lib/xorg/Xorg -nolisten tcp -background none -seat seat0 vt2 -auth /run/sddm/xauth_CRQCla -noreset -displayfd 16
   4511    3845 egui_autorestar /bin/sh /opt/eset/eea/lib/install_scripts/egui_autorestart.sh --gapplication-service
  22570    3845 egui_autorestar /bin/sh /opt/eset/eea/lib/install_scripts/egui_autorestart.sh --gapplication-service
  23898       1 startd          /opt/eset/eea/sbin/startd
  23900   23898 logd            /opt/eset/eea/lib/logd
  23901   23898 scand           /opt/eset/eea/lib/scand
  23902   23898 sysinfod        /opt/eset/eea/lib/sysinfod
  23903   23898 updated         /opt/eset/eea/lib/updated
  23904   23898 licensed        /opt/eset/eea/lib/licensed
  23905   23898 schedd          /opt/eset/eea/lib/schedd
  23906   23898 utild           /opt/eset/eea/lib/utild
  23908   23898 confd           /opt/eset/eea/lib/confd
  23909   23898 econnd          /opt/eset/eea/lib/econnd
  23944    3845 egui_autorestar /bin/sh /opt/eset/eea/lib/install_scripts/egui_autorestart.sh --gapplication-service
  23958   23898 oaeventd        /opt/eset/eea/lib/oaeventd
  24000   23898 wapd            /opt/eset/eea/lib/wapd
  24016   23898 execd           /opt/eset/eea/lib/execd
  24036   22570 egui            /opt/eset/eea/lib/egui --gapplication-service
```

There is a ESET daemon called `startd` but it doesn’t appear to be parent of the egui related script - that I assume is _egui\_autorestart.sh_.

Oh wait, that script is started from the service from before

```bash
root@L5:~# cat /usr/lib/systemd/system/eea.service
[Service]
Environment=LANG=C.UTF-8
Environment=LC_ALL=C.UTF-8
Type=notify
ExecStartPre=/opt/eset/eea/lib/install_scripts/check_start.sh
ExecStart=/opt/eset/eea/sbin/startd
ExecStartPost=-/opt/eset/eea/lib/install_scripts/launch_gui_all_users.sh
```

The `ExecStartPost` script is starting the crashing egui

```bash
root@L5:~# grep egui /opt/eset/eea/lib/install_scripts/*.sh
/opt/eset/eea/lib/install_scripts/egui_autorestart.sh:    /opt/eset/eea/lib/egui "$@" &
```

Why is that not inherting the systemd Environment settings? The _egui\_autorestart.sh_ is called from a script _launch\_gui\_all\_users.sh_, so it probably launches after login. Could it be that the uses `su` for switching users, but forgetting to pass the environment?

Nope, it just calls `/opt/eset/eea/lib/egui "$@" &`

Hmm, who is actually starting _egui\_autorestart.sh_ then? Taking a closer look at the `ps` output, reveal it parent as pid 3845

```bash
root@L5:~# ps -eo pid,comm,cmd | grep 3845
   3845 systemd         /usr/lib/systemd/systemd --user
```

Enlightening. So the gui is started by the _systemd user instance_. I would have expected the system user instance to inherited the environment variables set in the service file, but that might not be the case?

```bash
❱ systemctl --user show-environment | grep -E '(LC_|LANG)'
LANG=en_GB.UTF-8
LANGUAGE=en_GB
LC_ADDRESS=en_DK.UTF-8
LC_IDENTIFICATION=en_DK.UTF-8
LC_MEASUREMENT=en_DK.UTF-8
LC_MONETARY=en_DK.UTF-8
LC_NAME=en_DK.UTF-8
LC_PAPER=da_DK.UTF-8
LC_TELEPHONE=en_DK.UTF-8
LC_TIME=en_SE.UTF-8
LC_COLLATE=C.UTF-8
LC_CTYPE=C.UTF-8
LC_MESSAGES=C.UTF-8
LC_NUMERIC=en_US.UTF-8
```

Strange output. Some values look fine, but some are missing and others have different values. Like, why do the environment have an seemingly arbitrary swedish time setting (`LC_TIME=en_SE.UTF-8`)?

My system setting has danish time setting

```bash
❱ localectl | grep LC_TIME
LC_TIME=en_DK.utf8
```

Appears this is because the `systemd --user` session do not inherit all environment variables (ref section [2.1](https://wiki.archlinux.org/title/Systemd/User) in the arch documentation). A bit strange though, that only `LC_TIME` has an apparently arbitrary setting.

The same Arch page suggests that _environment.d_ can be used for fixing up environment variables like e.g. `LC_TIME`. _environment.d_ is a systemd feature that lets you define persistent environment variables in simple files.

It reads files from:

- _/etc/environment.d/_

- _/usr/lib/environment.d/_

- _~/.config/environment.d/_

I didn’t like this for several reasons:

- It’s quite hidden that an environment variable is overridden here

- Its on system or user level, while the problem is in a specific program

I decided instead to do a [KISS](https://en.wikipedia.org/wiki/Laziness) solution and just patch the ESET script

_/opt/eset/eea/lib/install\_scripts/egui\_autorestart.sh_

```diff
+   export LANG=C.UTF-8
+   export LC_ALL=C.UTF-8
    /opt/eset/eea/lib/egui "$@" &
```

Then restart

```bash
root@L5:~# systemctl daemon-reload
root@L5:~# systemctl restart eea.service
```

```bash
root@L5:~# tail -f /var/log/syslog

2025-04-22T09:51:42.836121+02:00 L5 systemd[1]: eea_upgrade.service - ESET Endpoint Antivirus upgrade was skipped because of an unmet condition check (ConditionPathExists=/var/opt/eset/eea/updated/app/eea.bin).
2025-04-22T09:51:42.849737+02:00 L5 kernel: ESET Web access protection module 1.0 <www.eset.com> loaded
2025-04-22T09:51:43.243928+02:00 L5 systemd[3845]: Reloading requested from client PID 42298 ('systemctl')...
2025-04-22T09:51:43.244022+02:00 L5 systemd[3845]: Reloading...
2025-04-22T09:51:43.248730+02:00 L5 kernel: eset_rtp: registered syscall handlers
2025-04-22T09:51:43.248740+02:00 L5 kernel: ESET Real-time file system protection module 3.0 <www.eset.com>
2025-04-22T09:51:43.248742+02:00 L5 kernel: eset_rtp: scanner enabled
2025-04-22T09:51:43.467181+02:00 L5 systemd[3845]: Reloading finished in 223 ms.
2025-04-22T09:51:43.506111+02:00 L5 systemd[3845]: Starting eea-user-agent.service - ESET Endpoint Antivirus user monitoring service...
2025-04-22T09:51:43.945661+02:00 L5 systemd[3845]: Finished eea-user-agent.service - ESET Endpoint Antivirus user monitoring service.
2025-04-22T09:52:00.934259+02:00 L5 egui[43212]: Locale not supported by C library.#012#011Using the fallback 'C' locale.
2025-04-22T09:52:01.954114+02:00 L5 cron[1719]: (*system*eset-eea-vapm) RELOAD (/etc/cron.d/eset-eea-vapm)
```

And then suddenly the ESET gui popped up ✅

![eset-gui](../../assets/eset-crashing-with-locale-error/eset-gui.png)
