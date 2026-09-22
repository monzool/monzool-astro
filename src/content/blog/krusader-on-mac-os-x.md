---
title: "Krusader On Mac OS X"
description: ''
pubDate: '2008-03-29'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "mac-os-x"
  - "software"
---

**HAVING GROWN UP** using [Norton Commander](http://en.wikipedia.org/wiki/Norton_Commander) for DOS, [Total Commander](http://www.ghisler.com/) on Windows and [Midnight Commander](http://www.ibiblio.org/mc/) and [Krusader](http://www.krusader.org/) on Linux, its hard, if not impossible, to do work without a proper Norton Commander clone. This is true, especially on Mac OS. The standard file tools in Mac OS X are useless compared to the mentioned tools. For Mac OS X a range of native alternatives exists like [Disk Order](http://www.likemac.ru/english/), [XFolders](http://www.kai-heitkamp.de/cms_en/main.php?content=9&module=0&SprachID=1&uid=853q68a00vfp1unoabnoh6ios0), [Fork Lift](http://www.binarynights.com/) and [muCommander](http://www.mucommander.com/). None of them are really good though. They all have their own weirdness' and shortcomings, and generally none comes near the functionality and speed of used offered by Krusader or Total Commander.

I've used Midnight commander on Mac OS X, but I prefer Krusader, and thankfully its pretty easy to get Krusader up and running on Mac OS X thanks to the [Fink project](http://www.finkproject.org/). If not having installed Fink already, do so by performing the following steps after downloading the [source distribution](http://www.finkproject.org/download/srcdist.php) (a binary installer is provided for Mac OS X Tiger).

`$ tar xvf fink-0.28.1.tar` `$ cd fink-0.28.1` `$ ./bootstrap` `$ /sw/bin/pathsetup.sh` `$ source ./init.sh` `$ fink selfupdate`

Fink is now installed, configured, updated and ready for use. Installing Krusader and the required dependencies takes only a single command.

`$ sudo fink install krusader`

Wait for compilation to complete (may take a while). If everything goes well, Krusader should be able to be started from the terminal window.

`$ krusader &`

Running Krusader I discovered that the Meta/Alt key was not possible to use. This is unfortunate as many keyboard shortcuts in Krusader uses that key. Fixing this requires two setup modifications. In the X11 preferences I deselected all options under the tab 'input'. This makes sure that X11 won't override any personal settings made on the keyboard setup. Alas this is exactly what is required for the Meta/Alt key to work. Terminate the X11 session and edit the file `~/.Xmodmap` (create it if not existing). Add the following keyboard mappings.

```text
clear Mod1
keycode 66 = Meta_L
add Mod1 = Meta_L
keycode 69 = Mode_switch
add Mod1 = Mode_switch

```

Now Krusader can be used with working keyboard shortcuts `:-)` (note that my MacBook has a Danish keyboard, so the above mappings may possible be different if using another keyboard layout).
