---
title: "Cross-compiling with dlang betterc"
description: ''
pubDate: '2020-11-18'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "c"
  - "programming"
---

**BETTERC IS A** "subproject" of the D language. It enables writing a kind of C dialect, that benefits some of the modern language features provided by the D language. It does not utilize the runtime of the D language, and is essential what makes the language more C like in its feature set. It does do provide a higher level approach to programming than generic C does, so its worth a look-see.

Not having to deal with the runtime, makes cross-compiling a betterc a breeze. It should be noted that there are more incarnations of the D compiler. The default compiler dmd does not support cross-compiling but the gcc based ldc does.

```
import core.stdc.stdio;

extern(C):

int main()
{
    string s = "Hello. I'll calc some hard math now: ";
    foreach (it; s) {
        printf("%c", it);
    }

    auto result = 1 + 1;
    printf("1 + 1 = %d\n", result);
    return 0;
}

```

```
PATH=/opt/armv5-eabi--musl--stable-2018.11-1/bin:${PATH} \
CC=/opt/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-gcc \
LD=/opt/armv5-eabi--musl--stable-2018.11-1/bin/arm-linux-ld \
ldc2 -mtriple=arm-linux -gcc=arm-linux-gcc --linker='' --static -betterC hello_math.d

```

```
» file hello_math
hello: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), statically linked, with debug_info, not stripped

```
