---
title: "Garmin Forerunner 610 and Garmin Connect on Linux"
description: ''
pubDate: '2015-02-28'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "personal"
  - "software"
  - "sport"
---

**GETTING PROPRIETARY ELECTRONICS** to work on Linux can be a hassle sometimes. More often that not, companies develops controller software for Windows only, or at best for Windows and Mac OS, but neglects to support the Linux platform. Then us that enjoy the freedom and wonders of Linux is often out of luck, or have to reverse engineer a solution. Fortunately a couple of hackers did just that for the _Garmin Forerunner 610_.

With thanks to [Tigge](https://github.com/Tigge) and [Dave Lotton](http://sourceforge.net/u/dlotton/profile/) it is possible to download files from the watch and upload them to _Germin Connect_.

.

_Tigge_ have created the tools to connect to the watch and download training pass files from it. Download from _github_ and install:

```bash
» git clone https://github.com/Tigge/openant.git
» (cd openant; sudo python setup.py install)
» git clone https://github.com/Tigge/antfs-cli.git
» (cd antfs-cli; sudo python setup.py install)

```

Now insert the `ANT+` usb dongle, and run this command to download all training pass from the watch.

```bash
» antfs-cli

```

The files will end up in the directory `~/.config/antfs-cli/``/activities`.

.

To upload the files to the _Germin Connect_ service, install the `GcpUploader` made by _Dave Lotton_:

```bash
pip install gcpuploader

```

Next setup a credentials file for `GcpUploader`.

```bash
echo -e "\
[Credentials]\n\
username=\n\
password=" > ~/.guploadrc

```

Edit the file and set credentials. When setting the `username` your must write your e-mail address. Otherwise you will get a login failure [\*1](#patch) .

Finally upload all files:

```bash
~/.config/antfs-cli/3894281250/activities» gupload.py -t "running" *.fit
File: 2015-02-20_16-38-36_4_3.fit    ID: 707690585    Status: SUCCESS    Name: N/A    Type: running
File: 2015-02-24_17-46-28_4_4.fit    ID: 707690640    Status: SUCCESS    Name: N/A    Type: running
File: 2015-02-25_18-18-04_4_5.fit    ID: 707690660    Status: SUCCESS    Name: N/A    Type: running
File: 2015-02-27_17-26-12_4_6.fit    ID: 707688520    Status: EXISTS    Name: N/A    Type: N/A

```

As seen from the output, already uploaded files are skipped, so if not wanting to specify each file specifically, the `*.fit` wildcard works perfectly fine. Note that `gupload.py` supports other taggings than _running_. Run `gupload.py --help` for more information.

.

**Side note:** For the version that I downloaded (`GcpUploader-2015.2.21.3` I had to patch it to accept login with the credentials file:

```diff
--- gupload.py.orig     2015-02-28 14:03:14.223948320 +0100
+++ gupload.py  2015-02-28 16:24:35.738408614 +0100
@@ -92,7 +92,7 @@
       self.msgLogger.debug('Using credentials from command line.')
       self.username=myargs.l[0]
       self.password=myargs.l[1]
- elif os.path.isfile(self.configCurrentDir):
+    elif os.path.isfile(configCurrentDir):
       self.msgLogger.debug('Using credentials from \'%s\'.' % configCurrentDir)
       config=ConfigParser.RawConfigParser()
       config.read(configCurrentDir)

```

If not wanting to venture into patching, `gupload.py` also accepts credentials as arguments (see `gupload.py --help` for more information).

.

Addendum: _Dave Lotton_ [recommends](http://sourceforge.net/p/gcpuploader/wiki/Home) that instead of `GcpUploader`, one should use the [tapiriik](https://tapiriik.com) service instead...
