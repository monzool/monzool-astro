---
title: "Linux Nvidia Driver GLX Failure"
description: ''
pubDate: '2009-10-02'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "games"
  - "linux"
  - "software"
---

**I'VE BOUGHT A** copy of the game Sacred Gold in an edition that is ported to Linux. This would be very exiting... if it didn't segfault every time I start it `:-(`

```bash
$ sacred
sacred 1.0.1, built for i386        
Segmentation Fault: I dont believe in dragons! oh...

This is a BUG, please report it to http://support.linuxgamepublishing.com
Stack dump:                                                             
{                                                                       
        [0xb8024400]                                                    
        /usr/lib/gtk-2.0/modules/libcanberra-gtk-module.so [0xb68299a6] 
        /usr/lib/gtk-2.0/modules/libcanberra-gtk-module.so(gtk_module_init+0x5d) [0xb6829a5d]
        /usr/local/games/sacred/lib/lib1/libgtk-1.2.so.0(gtk_init_check+0x3f3) [0xb7700443] 
        sacred [0x860422e]                                                                  
        sacred [0x8620770]                                                                  
        sacred [0x860839b]                                                                  
        sacred [0x809ab90]
        /lib/i686/cmov/libc.so.6(__libc_start_main+0xe5) [0xb71557a5]

        sacred(gtk_widget_grab_focus+0x31) [0x8053849]
}

```

The game publisher _Linux Game Publishing_ has provided a test tool that evaluates if your system should be able to execute the game...

```bash
# testtool
Testing installation... OK, installed at /usr/local/games/testtool
Base system Test
----------------
Testing architecture of system... 32 bits
Testing system CPU... 1242MHz
Testing CPU flags... MMX SSE SSE2 SSE3
Testing system memory... 2025MB

Graphics Test
-------------
Looking for OpenGL library
Accepting /usr/lib/libGL.so.1
X Error of failed request:  BadMatch (invalid parameter attributes)
  Major opcode of failed request:  155 (GLX)
  Minor opcode of failed request:  5 (X_GLXMakeCurrent)
  Serial number of failed request:  26
  Current serial number in output stream:  26

```

So It appeared that I had some trouble with the proprietary Nvidia driver. I ran glxinfo and indeed it gave an error.

```bash
$ glxinfo | grep -i error
Error: glXCreateContext failed

```

On the world wide web I found some hints about adding the following lines to xorg.conf.

```text
Section "Files"
    ModulePath      "/usr/lib/xorg/modules/extensions"
    ModulePath      "/usr/lib/xorg/modules/drivers"   
    ModulePath      "/usr/lib/xorg/modules"           
EndSection

```

That didn't help. `:-(`

Grepping the logs however revealed some useful information

```bash
$grep -i glx /var/log/*
/var/log/Xorg.0.log:(II) "glx" will be loaded. This was enabled by default and also specified in the config file.
/var/log/Xorg.0.log:(II) LoadModule: "glx"
/var/log/Xorg.0.log:(II) Loading /usr/lib/xorg/modules/extensions//libglx.so
/var/log/Xorg.0.log:(II) Module glx: vendor="X.Org Foundation"
/var/log/Xorg.0.log:(==) AIGLX enabled
/var/log/Xorg.0.log:(II) Loading extension GLX
...
/var/log/Xorg.0.log:(EE) NVIDIA(0): Failed to initialize the GLX module; please check in your X
/var/log/Xorg.0.log:(EE) NVIDIA(0):     log file that the GLX module has been loaded in your X
/var/log/Xorg.0.log:(EE) NVIDIA(0):     server, and that the module is the NVIDIA GLX module.  If
/var/log/Xorg.0.log:(==) NVIDIA(0): Enabling 32-bit ARGB GLX visuals.

```

It was clear that the Nvidia driver failed to intitalize the GLX module, but before that, it can be seen that another GLX module was actually loaded `Module glx: vendor="X.Org Foundation"`. This was a big hint.

Looking into earlier investigated directories I could see that I had two different versions of the glx library files installed?

```bash
/usr/lib/xorg/modules/extensions# ll
-rwxr-xr-x 1 root root 1269220 2009-07-25 13:10 libglx.so.173.14.20
-rw-r--r-- 1 root root  337008 2009-09-28 07:32 libglx.so

```

It seemed strange that I had two so differently sized versions of libglx laying around, and also that the Nvidia version appeared not to be the default file. Searching for the libglx file revealed that only the `fglrx-driver` and the Nvidia drivers supplied that file.

```bash
$ apt-file search libglx.so
fglrx-driver: /usr/lib/xorg/modules/extensions/libglx.so
nvidia-glx: /usr/lib/xorg/modules/extensions/libglx.so
nvidia-glx: /usr/lib/xorg/modules/extensions/libglx.so.185.18.36
nvidia-glx-legacy-173xx: /usr/lib/xorg/modules/extensions/libglx.so
nvidia-glx-legacy-173xx: /usr/lib/xorg/modules/extensions/libglx.so.173.14.20
nvidia-glx-legacy-71xx: /usr/lib/xorg/modules/extensions/libglx.so
nvidia-glx-legacy-71xx: /usr/lib/xorg/modules/extensions/libglx.so.71.86.07
nvidia-glx-legacy-96xx: /usr/lib/xorg/modules/extensions/libglx.so
nvidia-glx-legacy-96xx: /usr/lib/xorg/modules/extensions/libglx.so.96.43.13
xserver-xorg-core: /usr/lib/xorg/modules/extensions/libglx.so
xserver-xorg-core-dbg: /usr/lib/debug/usr/lib/xorg/modules/extensions/libglx.so

```

Although the only glx package that was installed on the system was libgl1-mesa-glx.

```bash
$ aptitude apts glx
p   fglrx-glx
i A libgl1-mesa-glx

```

Looking at libgl1-mesa-glx showed that that package installed a OpenGL library file

```bash
$dpkg -L libgl1-mesa-glx
/.
/usr
/usr/share
/usr/share/doc
/usr/share/doc/libgl1-mesa-glx
/usr/share/doc/libgl1-mesa-glx/copyright
/usr/share/doc/libgl1-mesa-glx/changelog.Debian.gz
/usr/share/lintian
/usr/share/lintian/overrides
/usr/share/lintian/overrides/libgl1-mesa-glx
/usr/lib
/usr/lib/libGL.so.1.2
/usr/lib/libGL.so.1

```

Strangely also here a Nvida version of the library existed in /usr/lib

```bash
-rwxr-xr-x 1 root root   667528 2009-07-25 13:10 libGL.so.173.14.20

```

This seemed like the Nvidia installer have had collisions with other already installed packages and had failed to resolve the situation properly. Unfortunately the installer had warned nothing about this situation. What I did then was to remove the existing libraries and make a symlink to the Nvidia libraries for libglx and libGL.

```bash
/usr/lib/xorg/modules/extensions# ll libglx*
lrwxrwxrwx 1 root root      19 2009-10-01 22:22 libglx.so -> libglx.so.173.14.20
-rwxr-xr-x 1 root root 1269220 2009-07-25 13:10 libglx.so.173.14.20

```

```bash
/usr/lib# ll libGL*
lrwxrwxrwx 1 root root       18 2009-09-13 13:40 libGL.so.1 -> libGL.so.173.14.20
lrwxrwxrwx 1 root root       18 2009-10-01 22:52 libGL.so.1.2 -> libGL.so.173.14.20
-rwxr-xr-x 1 root root   667528 2009-07-25 13:10 libGL.so.173.14.20

```

And then... glxinfo ran with no errors.

The log also changed for the better

```bash
$grep -i glx /var/log/*
/var/log/Xorg.0.log:(II) "glx" will be loaded. This was enabled by default and also specified in the config file.
/var/log/Xorg.0.log:(II) LoadModule: "glx"
/var/log/Xorg.0.log:(II) Loading /usr/lib/xorg/modules/extensions//libglx.so
/var/log/Xorg.0.log:(II) Module glx: vendor="NVIDIA Corporation"
/var/log/Xorg.0.log:(II) NVIDIA GLX Module  173.14.20  Thu Jun 25 19:49:59 PDT 2009
/var/log/Xorg.0.log:(II) Loading extension GLX
/var/log/Xorg.0.log:(II) NVIDIA(0): Support for GLX with the Damage and Composite X extensions is
/var/log/Xorg.0.log:(==) NVIDIA(0): Enabling 32-bit ARGB GLX visuals.
/var/log/Xorg.0.log:(II) Loading extension NV-GLX
/var/log/Xorg.0.log:(II) Initializing extension GLX

```

Unfortunately Sacred still segfaults big time `:-(`
