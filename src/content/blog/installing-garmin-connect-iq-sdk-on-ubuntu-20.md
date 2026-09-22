---
title: "Installing Garmin Connect IQ SDK on Ubuntu-20"
description: ''
pubDate: '2021-10-22'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "software"
---

**GARMIN HAS LINUX** support for their developer SDK which is awesome! Unfortunately the installer for the Garmin Connect IQ SDK, is a GTK based application that utilizes an older version of libwebkit which is available for Ubuntu-18 only. You'll end up with an error like this:

```sh
./bin/sdkmanager: error while loading shared libraries: libwebkitgtk-1.0.so.0: cannot open shared object file: No such file or directory
```

If wanting to install on Ubuntu-20 or later your are in for a hard time. No real PPA's exist for this library (seems most programs has upgraded to later versions of that library). Actually its not only the Garmin installer that have this issue. Some google'ing quickly reveals Citrix and other vendors having the same issue. Actually it looks like the other tooling from Garmin is Java based, so I wonder why they didn't do the installer in Java also? ¯\\\_(ツ)\_/¯

Development using the Garmin Connect IQ SDK is done in Visual Studio Code using the Garmin [Monkey C](https://marketplace.visualstudio.com/items?itemName=garmin.monkey-c) plugin. That plugin will then detect the toolchain, the programming libraries and Garmin device support files. But to get to that, the SDK has to be installed first, using the **Garmin SDK Manager** ... which is the application that fails to run.

So known facts about the Garmin SDK Manager are:

- Its not needed during day to day development
- The VSCode plugin appears to expect a hardcoded install path
- It works on Ubuntu-18.04

The solution: use an Ubuntu-18.04 Docker container to install into the expected path on the host system.

I scripted this for convenience

<script src="https://gist.github.com/monzool/2bf01fb5314807a42c26f2165cafb08f.js"></script>

  
Example:

```sh
/home/monzool/downloads» unzip connectiq-sdk-manager-linux.zip -d /tmp/garmin_sdk_manager
/home/monzool/downloads» garmin_sdkmanager_install_wrapper.sh /tmp/garmin_sdk_manager
```

### Update:

After installing, one will find that [the simulator also requires the same dependency](http://monzool.net/blog/2021/10/26/running-garmin-connect-iq-sdk-on-ubuntu-20)
