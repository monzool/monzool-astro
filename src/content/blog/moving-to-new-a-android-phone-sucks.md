---
title: "Moving to a new android phone sucks"
description: ''
pubDate: '2025-09-19'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "android"
  - "reviews"
---

**SWITCHING ANDROID PHONES** is something all Android phone users eventually will need to do. Since invention of the smart phone, more and more of daily life has progressed to be backed by an app. Be it public transportation, car parking, grocery shopping, banking, listening to music or streaming videos. It all adds up and the longer time you have been using a smart phone, the more stuff do you want to bring with you when switching to a new phone.

## tl;dr

Switching phones on Android sucks, it’s just a miserable experience. Okay, maybe a bit over-dramatic, but it genuinely is a lackluster experience. With a few exceptions all finely tuned settings are lost on both the Android system and native apps. Some native apps supports backup/restore, but its a proprietary and mainly manual solution that I expect exactly zero normies would ever mange to complete.

**What Android is missing is an integrated backup/restore system and transparent cloud storing (or syncing) of app and system settings**.

## From 🢡 to

My Pixel 7a has been a good experience, but ultimately the catastrophic inconsistency in photos made we throw in the towel. I instead acquired a Samsung Galaxy S23. For transferring data from my Pixel phone to the Samsung phone I used the Samsung SmartSwitch app. Android can install all apps itself when switching to a new phone, but all the other files like notification sounds, emulator files, documents etc are left behind. Samsung SmartSwitch will copy all files over

## Nova Launcher

So I don’t quite know where to throw blame her. After using the Samsung SmartSwitch functionality, Nova Launcher was installed. But after importing my backup not all settings was restored. This was due to Nova Launcher Premium was not installed in the transfer. After installing that from Google Play - and restarting the phone, then after another restore, all settings worked. The widgets was missing. Same goes for the wallpaper… so only a partial success.

⭐⭐☆☆☆

## System setup

### Language

I run my Android in `English(Danish)` language setting. For some apps it makes more sense to switch from default english to native danish. Some apps support doing this through the Android settings, which is a really nice feature. Unfortunately not all apps (particularly public transportation apps) support this and you have to poke around in the individual app settings to find where to flip the language

⭐☆☆☆☆

### Notification sounds

This one is a weird weird. For many apps I had to use their proprietary backup/restore solution. But for every single one, the notification sound setting was not restored and had reverted to default sounds. All notification and ring-tone files were replicated by Samsung SmartSwitch to be at the exact same place in the filesystem, but it did not work. This make me think that notification sounds are part of the Android OS settings

Perhaps this is a difference between Samsung Android and Pixel Android, but not all notifications are no longer to be found in the various apps. Thanks to the Samsung SmartSwitch app, the files are there in the same location as on the old phone. They are just not all presented. Seems a bit inconsistent between apps, so not really sure what is going on there…

⭐☆☆☆☆

## App notifications

I had a lot of app restricted on which notifications they were allowed to disturb with. None of these setting ported over, so a horde of attention seeking notifications jingled the phone the first few days until I got the throttle back on that

⭐☆☆☆☆

## Google apps

The Samsung SmartSwitch app filtered out quite a few of the installed Google apps. Gmail, Lens and a few others were transferred, but these were missing:

- Calendar

- Files

- Clock

- Contacts

- Phone

- GBoard

I suspect this is because Samsung has their own competing apps, and blocked the install. What a shit move, Samsung 💩 Weird thing was, that the icons from the apps were actually present. First time activating them, I would then be notified that: the app was not installed, but I could search for them in an app store. After install I realized that none of the settings was restored. Every app had to be set up again from scratch. I don’t know if this was because of the shitty move by Samsung SmartSwitch or just Google not caring…

⭐☆☆☆☆

### Google Chrome

Chrome have a feature (if [sync](https://support.google.com/chrome/answer/165139?hl=en&co=GENIE.Platform%3DDesktop) is enabled), that when opening Chrome on the new phone it will ask if to open all the tabs that are synced. It asked to sync only 124 tabs. Where were all the rest! It turns out it does not sync inactive tabs 🤦 Chrome has a feature where tabs that has not be active for a set time (default 21 days) the tab will become an inactive tab. I had to disable the inactive tab feature, then wait a bit, then wipe Chrome app data on the new phone. Now when opening, all 463 tabs opened in the new phone

⭐⭐⭐☆☆

### Google BGoard

As mentioned many of the Google apps was not transferred and had to be set up from scratch. I’ve made quite a few changes to GBoard on the old phone. I could only find a way to backup the personal dictionary though. Not that it mattered, because I could not find any way to restore the dictionary on the new phone. Why are these settings not just stored in the cloud?

⭐☆☆☆☆

### Google Weather

On the new phone the weather app was not there. It was not to be found. I then searched the Play store but could not find the Google Weather app (the app store is littered with weather apps - many of questionable intent). Then one day, at a seeming arbitrary point it popped up a notification about needing precise location permissions. So it **was** installed. I then looked at the apps list in settings. I probably should have looked there, but didn’t think of it as I couldn’t find it the app drawer. In the settings I found this setting: `Show Weather on Apps screen`. After enabling that, the app could suddenly be found and started manually. What an obnoxious setting. I want to see the weather to plan ahead - not when this brain-dead app wrongly thinks its relevant. A weird this is that on the new phone it thinks the time is one hour later that it actually is. I ended up deleting the app

⭐☆☆☆☆

## Other apps

### Signal

Signal was nice. You basically just select transfer on the old and new phone, and the transfer happens automagically 🧙 I do wonder how this process will be if you have lost your old phone 🤔

⭐⭐⭐⭐☆

### Whatsapp

Except for the notification sound everything was restored automatically after login. It makes backup/restore to Google Drive. Works perfectly

⭐⭐⭐⭐⭐

### Microsoft Authenticator

The Microsoft Authenticator has a built-in cloud solution to do automatic backup and manual restore to another phone. However, restoring was not working. It kept saying _“Your backup is not stored with this email”_

“Fortunately” this is a common bug, that [was complained about before](https://learn.microsoft.com/en-us/answers/questions/955233/microsoft-authenticator-unable-to-recover-your-bac) had a solution for (Microsoft incompetently do not provide linking to answers, but look for the answer by **Arif IT-Pro**). An authenticator app that cannot restore do not bring confidence…

⭐⭐⭐☆☆

### OK Benzin

This was a particular annoying experience, partly because I had forgotten my password. Their reset procedure was to send a reset link in an email. That link would open the app, but the app would go to normal login, not password reset. Had to use a computer and their website to get my password reset 🤦

⭐⭐☆☆☆

### AMDroid

Moving an alarm app (AMdroid) requires three system setting changes

1. Add it to the _never sleeping apps_ list

3. Set it to _unrestricted battery_ usage

5. Allow it to _appear on top_

By bad luck I forgot to do the manual backup/restore for that app, so I overslept the next workday.

⭐⭐☆☆☆

### F-Droid

F-Droid itself seemed to just work. Maybe that is from using the Samsung SmartSwitch, because from reading online that would have required a backup/restore session, but at first glance all apps where transferred 🤔 Later I found that it was actually a mixed story. The apps that had a presence on both F-Droid and Play Store, were now all installed as the Play Store edition?!

⭐⭐☆☆☆

### MacroDroid

Had to do backup/restore, but that worked fine enough. Then I manually had to sideload their permission helper. That required flipping several options to get permission to install the apk. I guess in the future this kind of system tweaking will only become even more complicated. I really hope they manage to keep MacroDroid and option, because its invaluable to un-fuck some of the crap in Android

⭐⭐☆☆☆

### DGT GTD

I’ve been using this todo/reminder app for quite a long time, but are not transitioning to Tasks It automatically does a local zip backup of all tasks, and by using Samsung SmartSwitch the backups were available for restoring.

⭐⭐⭐⭐☆

## Apps (non Google) with online accounts

Many apps like social media (Strava, Reddit, Bluesky, Lemmy etc) rely on online services and only require a login to get up and running again. Apart from throttling on their notifications, surprisingly few issues with any of them

⭐⭐⭐⭐☆

## Wall of shame 💩

## Digital wellbeing

What an atrocious system app. This app would endlessly notify me with various well being advice. Seriously, just **shut the 🤬 uppppppp!!!!!!!!**. The app didn’t even allow me to disable notifications❗ The toggle button was disabled. I added it to my app kill list 🗡️💀 in MacroDroid

🖕🖕🖕🖕🖕

## Waze

It was copied to the phone just fine and only required a login to work; but as with many other apps, the settings had reset. Initially the notifications from Waze angered me quite a bit. Every day it would notify me that there is 30 minutes until arriving at work. What am I suppose to use that information for? I’ve already been in public transportation for 20 minutes before that, and know exactly when I will arrive at work. A complete pointless notification. The feature **might** have a value if you drive to work in a congested area, and you need to be at work at a precise time, but I think that is a notification you would want to activate for that specific need. Some interweb search and I managed to disable that notification. I generally had to poke a lot of settings in Waze to make it less obnoxious. Waze also got added to my app kill list 🗡️💀 in MacroDroid

🖕🖕🖕🖕☆

## Misc

My digital drivers license app did not transfer settings. To activate the drivers license I have to go through a validation process that includes scanning of my passport. I am not really too upset about that. It could be a fair security restriction.

## Summary

An seemingly endless task of logins and permissions acceptances. The system settings app list counted around 350 apps installed, and most of them require some sort of login. I took the most important ones, that I could remember in the moment in one go, and then delayed the rest until I needed them… which is also why I held up the line in the supermarket as I had to login, using my national digital id (MitId), in the supermarket app to get the discounts 🤷‍♀️

Most apps, including many of Google’s had their settings lost. I had to set up language, notifications and a lot of other things once again

Why do Google apps not store all their settings in the cloud? Why don’t **all** apps not store their settings in the cloud. Is there no api for storing settings/backup in Google Drive? There should be. That would make changing phones not so much of a shit show

System settings might be a bit more difficult to depending on vendor and version differences between phones, but its not an unsolvable problem. Like it migrated wifi and bluetooth connection registrations just fine, so why not also migrate hotspot settings, personal dictionaries, app language settings etc. Should be possible

Switching Android phones is a 💩 experience.
