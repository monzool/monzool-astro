---
title: "Pixel 7a Trusty TEE failure"
description: ''
pubDate: '2025-05-25'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "android"
---

**ANDROID TRUSTY TEE** is failing on my Pixel 7a (Android 15) and causing my phone to randomly waiting at the SIM pin login in the mornings. This is the short conclusion of my findings, for an issue I currently have with my phone.

When waking up at the morning, I would find my phone being stuck waiting for my SIM pin login. At the night before nothing extraordinary events had happened. I just put down the phone, plugged in the powercord and went to sleep. As this had happend quite a few times the last couple of months, I decided to investigate even though I an not an Android expert

I started by investigating information from `adb logcat`.

```text
--------- beginning of kernel
05-25 01:30:15.540     0     0 I trusty  : boot args 0x*** 0x*** 0x6 0x0

<snip>

05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_tee_storage][gf_tee_open_object] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_secure_object][gf_so_load_persistent_object] so(finger_0_3.so) not exist
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_secure_object][gf_so_load_persistent_object] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_fpcore_common][fpcore_load_template_object] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][I][gf_tee_storage][trusty_file_open] 0 LHBM_finger_0_3_bak.so 1
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_tee_storage][trusty_file_open] Unable to open LHBM_finger_0_3_bak.so on port com.android.trusty.storage.client.td
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_tee_storage][trusty_file_open] Failed to open LHBM_finger_0_3_bak.so on com.android.trusty.storage.client.td. No fallback available.
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_tee_storage][gf_tee_open_object] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_secure_object][gf_so_load_persistent_object] so(finger_0_3_bak.so) not exist
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_secure_object][gf_so_load_persistent_object] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_fpcore_common][fpcore_load_template_object] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 01:30:46.436     0     0 I trusty  : [GF_TA][E][gf_fpcore_common][fpcore_get_finger_ids_from_so] exit. err=GF_ERROR_OPEN_SECURE_OBJECT_FAILED, errno=1035
05-25 07:56:03.561     0     0 I trusty  : [GF_TA][I][gf_tee_storage][trusty_file_open] 0 LHBM_auth_att.so 0
05-25 07:56:47.350     0     0 I trusty  : sac-ssmt: 111: TPU: Setup TZ SSMT 0
05-25 07:56:47.369     0     0 I trusty  : sac-ssmt: 111: TPU: Setup TZ SSMT 0
05-25 07:56:58.807     0     0 I trusty  : sac-ssmt: 111: TPU: Setup TZ SSMT 0
05-25 07:56:58.876     0     0 I trusty  : sac-ssmt: 111: TPU: Setup TZ SSMT 0
05-25 07:57:56.248     0     0 I trusty  : [GF_TA][I][gf_delmar_sensor][determine_expo_mode] operation: 2, retry: 0, need_dec_gain_due_to_als: 0, expo mode:0
```

I did a SIM pin unlock **07:56**, but before that the phone had just being doing nothing since **01:30:46** where it had been failing since boot at **01:30:15**.

When feeding the errors messages to ChatGPT. It concluded that this is from a failing **Trusty TEE (Trusted Execution Environment)**. [Trusty TEE](https://source.android.com/docs/security/features/trusty) is a security feature that runs isolated from the Android OS, and uses trust zones for handling keys, bio-metrics, pins and other sensitive data.

So if _Trusty Tee_ was the last thing running - what made it then be needed? I decided to investigate the cause of the reboot. To get access restricted logs, I had to generate and download a bugreport from the phone

```bash
❱ adb bugreport reboot_at_night-2025-05-25.zip
```

Grepping a bit in kernel message log for failures…

```bash
❱ grep -a -iE 'panic|watchdog|fatal|reboot|crash|stack|Call trace' ./FS/data/misc/recovery/last_kmsg
```

revealed some interesting information

```text
[474014.231799][  T547] init: Received sys.powerctl='reboot,unAttended,mainline_update' from pid: 1776 (system_server)
[474014.232080][    T1] init: Got shutdown_command 'reboot(unattended,mainline_update)'...
[474016.354876][    T1] init: Service vold has 'reboot_on_failure' option and failed, shutting down System.
[474020.389800][    T1] init: Reboot ending, jumping to kernel
...
Reboot Info:
  Reboot reason: 0xcafe - User Reboot(S/W Reboot)
  Reboot mode: 0x0 - Normal Boot
```

So the device has rebooted due to an _unattended mainline_ update. Unattended updates is a new feature introduced in Android 14 that allows the Android system to automatically apply certain system updates (mainline updates) and then start the phone again, such that the user will not know that the update happened (apart from all background apps being closed).

I then grepped for updates from today, but the list was surprisingly long, so narrowed it down to mainline updates close to the reboot timestamp

```bash
❱ adb shell dumpsys package apex | grep -E 'Package \[|lastUpdateTime' | grep -A1  mainline |  grep -B1 2025-05-25
  Package [com.google.mainline.telemetry] (17fc754):
    lastUpdateTime=2025-05-25 01:30:43
  Package [com.google.mainline.adservices] (df25ac):
    lastUpdateTime=2025-05-25 01:30:43
```

Two mainline updates! That looks like the smoking gun.

Reading up a bit on the unattended updating mechanism, I believe the story is:

- A nightly automatic update of apps included a mainline update that required rebooting (`com.google.mainline.adservices`).

- The phone is issuing an unattended reboot (`sys.powerctl='reboot,unattended,mainline_updated'`).

- When booting the system will use [_Resume on Reboot"_](https://source.android.com/docs/core/ota/resume-on-reboot) _to do [](https://source.android.com/docs/core/ota/resume-on-reboot#sim-pin-replay)_ [Sim Pin Replay\*](https://source.android.com/docs/core/ota/resume-on-reboot#sim-pin-replay) to do SIM pin login on behalf of the user.

- _Resume on reboot_ will use _Trusty TEE_ to do the critical trust action of doing SIM PIN login.

- _Trusty TEE_ fails to access the fingerprint storage (`Unable to open LHBM_finger_0_3_bak.so`), which I presume is required for validating access to SIM pin data and the sequence stops prematurely

This is a particular annoying issue as the phone will fail to reboot at any arbitrary night. It fully depends on when Google decides to update a mainline app.

Not sure how to fix this… I guess the error is related to the fingerprint storage, so perhaps either switching to another unlock method (which I am not interested in), or clearing current stored fingerprints and re-create. Regardless there could be long time for a verification as this depends on when Google pushes the next mainline update 🤷
