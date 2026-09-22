---
title: "Cross-compiling Janet-lang"
description: ''
pubDate: '2019-12-13'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "shell-scripting"
  - "software"
---

**JANET IS A** programming language that can be used for systems scripting or be embedded in other programs. For further details read more at the [Janet](https://janet-lang.org) site.

My interest revolves around getting a portable language that could replace bash for scripting on a small arm based platform.

This is the steps I did to cross-compile Janet. Actually Janet provides more that one way to compile it, but using their provided [meson](https://mesonbuild.com) build scripts seemed to be the approach that supported cross-compiling the best.

meson does cross-compilation by use of a configuration file For more information, see https://mesonbuild.com/Cross-compilation.html

```bash
» cat << EOF > armv5_musl.cross
[binaries]
c = '/home/monzool/work/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-gcc'
cpp = '/home/monzool/work/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-g++'
ar = '/home/monzool/work/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-ar'
strip = '/home/monzool/work/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-strip'

[properties]
sizeof_int = 4
sizeof_wchar_t = 4
sizeof_void* = 4

alignment_char = 1
alignment_void* = 4
alignment_double = 4

has_function_printf = true

c_link_args = ['-static']

[host_machine]
system = 'linux'
cpu_family = 'arm'
cpu = 'armv5'
endian = 'little'
EOF

```

Now run meson to make it generate compile files:

```bash
» meson setup build \
        --cross-file armv5_musl.cross \
        --buildtype release \
        --optimization 2

```

meson generates [ninja](https://ninja-build.org) files. Command ninja to build the project:

```bash
» ninja -C build
ninja: Entering directory `build'
[0/1] Regenerating build files.
The Meson build system
Version: 0.48.0
Source dir: /home/monzool/work/janet-1.5.1
Build dir: /home/monzool/work/janet-1.5.1/build
Build type: cross build
Project name: janet
Project version: 1.5.1
Native C compiler: ccache cc (gcc 7.4.0 "cc (Ubuntu 7.4.0-1ubuntu1~18.04.1) 7.4.0")
Cross C compiler: /home/monzool/work/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-gcc (gcc 7.3.0)
Host machine cpu family: arm
Host machine cpu: armv5
Target machine cpu family: arm
Target machine cpu: armv5
Build machine cpu family: x86_64
Build machine cpu: x86_64
Library m found: YES
Library dl found: YES
Configuring janetconf.h using configuration
Compiler for C supports arguments -fvisibility=hidden: YES
Compiler for C supports arguments -fvisibility=hidden: YES
Build targets in project: 12
Option b_lundef is: False [default: false]
Found ninja-1.8.2 at /usr/bin/ninja
[2/2] Linking target libjanet.so

```

Now to verify that the output is actually for the intended target

```bash
» file ./build/janet
./build/janet: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), statically linked, stripped

```

The output file is a self-contained static executable, nice and easy to copy to the target and run

```bash
» readelf -d ./build/janet | grep NEEDED

```
