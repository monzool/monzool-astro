---
title: "Incomprehensive Hexdump Man Page"
description: ''
pubDate: '2008-02-18'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "lua"
  - "programming"
  - "rant"
  - "software"
---

**THE HEXDUMP MAN** page, I find, is not the best written example of an applications manual. I recently had a task of finding the addresses of filename encounters generated when a bunch of files were written to an uncompressed jffs2 partition. Normally I've been sticking to the simple `hexdump -C` use, but grepping filenames from the output is not applyible because of the line breakings.

```
$ hexdump -C /dev/mtd0  | grep count
00092df0  63 6f 75 6e 74 31 32 2e  64 61 74 ff 19 85 e0 02  |count12.dat.....|
000bfe80  00 00 0e 0b 08 63 6f 75  6e 74 31 33 2e 64 61 74  |.....count13.dat|
000c7f10  63 6f 75 6e 74 30 39 2e  64 61 74 ff 19 85 e0 02  |count09.dat.....|
000f9a80  ff 40 62 1d f9 72 7e e3  63 6f 75 6e 74 31 31 2e  |.@b..r~.count11.|
000ffb90  63 6f 75 6e 74 30 39 2e  64 61 74 e0 02 00 00 00  |count09.dat.....|
000ffd80  0a 00 00 00 0b 0b 08 63  6f 75 6e 74 31 30 2e 64  |.......count10.d|
00115e20  bd 6e 58 e6 63 6f 75 6e  74 30 37 2e 64 61 74 ff  |.nX.count07.dat.|
0012ebe0  63 6f 75 6e 74 30 38 2e  64 61 74 ff 19 85 e0 02  |count08.dat.....|
0013fcc0  00 08 0b 08 63 6f 75 6e  74 30 37 2e 64 61 74 e0  |....count07.dat.|
0013feb0  01 00 00 00 08 00 00 00  09 0b 08 63 6f 75 6e 74  |...........count|
0014af40  fa ce 22 36 63 6f 75 6e  74 30 34 2e 64 61 74 ff  |.."6count04.dat.|
00163d00  63 6f 75 6e 74 30 35 2e  64 61 74 ff 19 85 e0 02  |count05.dat.....|
0017fbc0  00 00 00 05 0b 08 63 6f  75 6e 74 30 34 2e 64 61  |......count04.da|
0017ffb0  00 07 0b 08 63 6f 75 6e  74 30 36 2e 64 61 74 e0  |....count06.dat.|
00180070  16 b6 2c e3 32 2e ad 46  63 6f 75 6e 74 30 31 2e  |..,.2..Fcount01.|
00198e30  75 8e d7 96 63 6f 75 6e  74 30 32 2e 64 61 74 ff  |u...count02.dat.|
001b1bf0  63 6f 75 6e 74 30 33 2e  64 61 74 ff 19 85 e0 02  |count03.dat.....|
001bfb00  0b 08 63 6f 75 6e 74 30  31 2e 64 61 74 e0 02 00  |..count01.dat...|
001bfcf0  00 00 02 00 00 00 03 0b  08 63 6f 75 6e 74 30 32  |.........count02|
001bfef0  63 6f 75 6e 74 30 33 2e  64 61 74 e0 02 00 00 00  |count03.dat.....|

```

Wanting to hexdump to produce an output more suitable for searching, I read the [hexdump man page](http://linux.about.com/library/cmd/blcmdl1_hexdump.htm) where it is evident that hexdump provides flexible output formatting.

```
     -e format_string
             Specify a format string to be used for displaying data.

```

The short description is elaborated in a later section

```
   Formats
     A format string contains any number of format units, separated by white-
     space.  A format unit contains up to three items: an iteration count, a
     byte count, and a format.

```

Okay, three parameters of which two of them are optional. Regarding the non-optional format specifier, it must be double quoted.

```
     The format is required and must be surrounded by double quote (" ")
     marks. It is interpreted as a fprintf-style format string (see
     fprintf(3)) ...

```

Okay. Not so hard. I know fprintf syntax. So what configuration am I optionally skipping? The first parameter is iteration count.

```
     The iteration count is an optional positive integer, which defaults to
     one.  Each format is applied iteration count times.

```

So, what does the iteration count actually do? Repeat the same printout x number of times? That of course would be a daft thing to do. Not being a native English speaker, I reassured that iteration did not have any dualistic meaning unknown to me. [Dictionary.com](http://dictionary.reference.com/browse/iteration) defines

_

it·er·a·tion

1. 1\. the act of repeating; a repetition.
2. 2\. Mathematics. a. Also called successive approximation. a problem-solving or computational method in which a succession of approximations, each building on the one preceding, is used to achieve a desired degree of accuracy. b. an instance of the use of this method.
3. 3\. Computers. a repetition of a statement or statements in a program.

_

Hmm, still not exactly clear on what iteration does. I'd better experiment to figure it out. Next optional parameter defines a byte count.

```
     The byte count is an optional positive integer.  If specified it defines
     the number of bytes to be interpreted by each iteration of the format.

```

Huh? Byte count of what again? Does this relate to the amount of `"%c"`'s and what-not I put in the mandatory part?. Experimentations will tell. The final details on the optional parameters are how to apply them.

```
     If an iteration count and/or a byte count is specified, a single slash
     must be placed after the iteration count and/or before the byte count to
     disambiguate them.

```

That would be `iterations` or `iterations/byte_count` told in many words forming an obscure sentence?

Well, feeling armed for some basic hexdump formatting, I proceeded to do some experimentations.

```
$ hexdump -e "0x%08x" /dev/mtd0
hexdump: bad format {0x%08x}

```

What?! I took another look at the examples provided by the man page.

```
     Display the input in perusal format:

           "%06.6_ao "  12/1 "%3_u "
           "\\t\\t" "%_p "
           "\\n"

```

Hmm, and I write all three lines how? Or is it three examples? Tried the top line from the example. It worked, although of course not giving me the output format desired. Cos of the nature of the input data, the generated output actually didn't make much sense, but now a little wiser I continued experimenting.

```
$ hexdump -e 8/1 "0x%08x" /dev/mtd0
hexdump: bad format {8/1}

```

Hmm, perhaps a double qouting is required before the "optional" parameters?.

```
-sh-2.05b# hexdump -e "" 8/1 "0x%08x" /dev/mtd0
Segmentation fault

```

**WTF!?** Near having a fury induced head explosion I resolved to Google. Seems that [I'm not the only one having a hard time decoding the '-e' description](http://www.technovelty.org/linux/tips/hexdump.html) (even though the kind poster states that reading the man page is understanding hexdump). The apparent proper syntax is:

```
$ hexdump -e ' [iterations]/[byte_count] "[format string]" '

```

This was not the exact syntax mentioned in the man page, but I tried.

```
$ hexdump -e '6/1 "0x%08x, "' -e '"\\n"' /dev/mtd0

```

Hurraa, it worked. Having this figured out, the only thing left was to find out what the exact functionality of the `iteration` and `byte_count` parameters were? I wasn't fully enlightened by the output, so a few more tests should reveal the purpose of them both.

```
$ hexdump -e '6/1 "0x%08x, "' -e '"\\n"' /dev/mtd0
0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff,
0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff,

```

Hmm, six columns...

```
$ hexdump -e '4/1 "0x%08x, "' -e '"\\n"' /dev/mtd0
0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff,
0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff,
0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff,
0x000000ff, 0x000000ff, 0x000000ff, 0x000000ff,

```

Aha, so... iterations equals **columns**. Still not figured out the byte\_count parameter though.

```
$ hexdump -e '6/2 "0x%08x, "' -e '"\\n"' /dev/mtd0
0x0000ffff, 0x0000ffff, 0x0000ffff, 0x0000ffff, 0x0000ffff, 0x0000ffff,
0x0000ffff, 0x0000ffff, 0x0000ffff, 0x0000ffff, 0x0000ffff, 0x0000ffff,

```

Perhaps the partial empty (erased) flash section was not the best example to learn from, so I created a file repeating the numbers 00 to 09.

```
$ hexdump -e '6/1 "0x%08x, "' -e '"\\n"' count.hex
0x00000000, 0x00000001, 0x00000002, 0x00000003, 0x00000004, 0x00000005,
0x00000006, 0x00000007, 0x00000008, 0x00000009, 0x00000000, 0x00000001,
0x00000002, 0x00000003, 0x00000004, 0x00000005, 0x00000006, 0x00000007,
0x00000008, 0x00000009, 0x00000000, 0x00000001, 0x00000002, 0x00000003,

```

```
$ hexdump -e '6/2 "0x%08x, "' -e '"\\n"' count.hex
0x00000100, 0x00000302, 0x00000504, 0x00000706, 0x00000908, 0x00000100,
0x00000302, 0x00000504, 0x00000706, 0x00000908, 0x00000100, 0x00000302,
0x00000504, 0x00000706, 0x00000908, 0x00000100, 0x00000302, 0x00000504,
0x00000706, 0x00000908, 0x00000100, 0x00000302, 0x00000504, 0x00000706,

```

Aha, guess _that_(?) would fit the byte count description...

Having finally decoded the man page I set on to find a proper output. After some unsuccessful attempts, I googled for a hint to a solution. Eventually I found some indications that, to get the desired formatting, I should utilize some of the non-fprintf formatting options provided by hexdump. More man page decoding? No fucking way! Enough of this shit!

Having wasted precious work time, I abandoned hexdump and put together a little Lua script that would do the hex dumping and format the output to fit my requirements.

```
#!lua
--[[  Hex dump utility
      usage:   lua xdex.lua pattern file

      example: lua xdex.lua "count%d%d.dat" file.dat
--]]

local debug = false

-- http://lua-users.org/wiki/LuaPrintf
printf = function(s,...)
           return io.write( s:format(...) )
         end -- function

local f = assert(io.open(arg[2], "rb"))
local data = f:read("*all")

--
-- Locate offsets of all pattern matching items
--
local offset_begin, offset_end = 0, 0
local items = {}
local index = 1

repeat
  offset_begin, offset_end = string.find( data, arg[1], offset_begin+1 )
  if offset_begin == nil then
    break
  end
  items[index] = { offset_begin, offset_end }
  index = index+1
  if debug then printf("%08xh - %08xh\n", offset_begin, offset_end) end
until ( offset_begin == nil )
items[index] = { nil, nil } -- Terminate

--
-- Hexdump alike printing of results
-- (Inspired from test/xd.lua in lua5.1 distribution)
index = 1
local offset = 0
while true do
  local s = string.sub( data, offset+1, offset+16 )
  if s == nil or items[index][1] == nil then
    return
  end

  if (offset+16) >= items[index][1] then
    io.write( string.format("%08x  ", offset) )
    string.gsub( s,"(.)",
        function (c) io.write( string.format("%02x ",string.byte(c)) ) end )
    io.write( string.rep(" ", 3*(16-string.len(s))) )
    io.write( " ", string.gsub(s,"%c","."), "\n" )

    if (offset+16) >= items[index][2] then
      index = index+1
    end
  end
  offset=offset+16
end

```

The output from the above script correctly finds 26 encounters of the input pattern, where the original grepping on the hexdump output would only discover 20 encounters.

```
$ xdex.lua "count%d%d*[.]dat" /dev/mtd0
00092df0  63 6f 75 6e 74 31 32 2e 64 61 74 ff 19 85 e0 02  count12.datÿ.à.
000abba0  0b 08 00 00 03 f0 42 2c 83 b2 2d 83 63 6f 75 6e  .....ðB,²-coun
000abbb0  74 31 33 2e 64 61 74 ff 19 85 e0 02 00 00 10 44  t13.datÿ.à....D
000bfc80  00 00 00 01 00 00 00 0c 00 00 00 0d 0b 08 63 6f  ..............co
000bfc90  75 6e 74 31 32 2e 64 61 74 e0 02 00 00 00 0d 00  unt12.datà......
000bfe80  00 00 0e 0b 08 63 6f 75 6e 74 31 33 2e 64 61 74  .....count13.dat
000c7f10  63 6f 75 6e 74 30 39 2e 64 61 74 ff 19 85 e0 02  count09.datÿ.à.
000e0cc0  0b 08 00 00 61 f7 3b 03 c4 12 57 53 63 6f 75 6e  ....a÷;.Ä.WScoun
000e0cd0  74 31 30 2e 64 61 74 ff 19 85 e0 02 00 00 10 44  t10.datÿ.à....D
000f9a80  ff 40 62 1d f9 72 7e e3 63 6f 75 6e 74 31 31 2e  ÿ@b.ùr~ãcount11.
000f9a90  64 61 74 ff 19 85 e0 02 00 00 10 44 ee 2d 30 6f  datÿ.à....Dî-0o
000ffb90  63 6f 75 6e 74 30 39 2e 64 61 74 e0 02 00 00 00  count09.datà....
000ffd80  0a 00 00 00 0b 0b 08 63 6f 75 6e 74 31 30 2e 64  .......count10.d
000ffd90  61 74 e0 02 00 00 00 0b 00 00 00 02 00 02 0c d8  atà............Ø
000fff70  00 00 00 01 00 00 00 0b 00 00 00 0c 0b 08 63 6f  ..............co
000fff80  75 6e 74 31 31 2e 64 61 74 e0 02 00 00 00 0c 00  unt11.datà......
00115e20  bd 6e 58 e6 63 6f 75 6e 74 30 37 2e 64 61 74 ff  ½nXæcount07.datÿ
0012ebe0  63 6f 75 6e 74 30 38 2e 64 61 74 ff 19 85 e0 02  count08.datÿ.à.
0013fcc0  00 08 0b 08 63 6f 75 6e 74 30 37 2e 64 61 74 e0  ....count07.datà
0013feb0  01 00 00 00 08 00 00 00 09 0b 08 63 6f 75 6e 74  ...........count
0013fec0  30 38 2e 64 61 74 e0 02 00 00 00 09 00 00 00 02  08.datà.........
0014af40  fa ce 22 36 63 6f 75 6e 74 30 34 2e 64 61 74 ff  úÎ"6count04.datÿ
00163d00  63 6f 75 6e 74 30 35 2e 64 61 74 ff 19 85 e0 02  count05.datÿ.à.
0017cab0  0b 08 00 00 b7 fd 21 e2 80 0e 71 56 63 6f 75 6e  ....·ý!â.qVcoun
0017cac0  74 30 36 2e 64 61 74 ff 19 85 e0 02 00 00 10 44  t06.datÿ.à....D
0017fbc0  00 00 00 05 0b 08 63 6f 75 6e 74 30 34 2e 64 61  ......count04.da
0017fbd0  74 e0 02 00 00 00 05 00 00 00 02 00 00 af 50 00  tà...........¯P.
0017fdb0  00 00 01 00 00 00 05 00 00 00 06 0b 08 63 6f 75  .............cou
0017fdc0  6e 74 30 35 2e 64 61 74 e0 02 00 00 00 06 00 00  nt05.datà.......
0017ffb0  00 07 0b 08 63 6f 75 6e 74 30 36 2e 64 61 74 e0  ....count06.datà
00180070  16 b6 2c e3 32 2e ad 46 63 6f 75 6e 74 30 31 2e  .¶,ã2.­Fcount01.
00180080  64 61 74 ff 19 85 e0 02 00 00 10 44 ee 2d 30 6f  datÿ.à....Dî-0o
00198e30  75 8e d7 96 63 6f 75 6e 74 30 32 2e 64 61 74 ff  u×count02.datÿ
001b1bf0  63 6f 75 6e 74 30 33 2e 64 61 74 ff 19 85 e0 02  count03.datÿ.à.
001bfb00  0b 08 63 6f 75 6e 74 30 31 2e 64 61 74 e0 02 00  ..count01.datà..
001bfcf0  00 00 02 00 00 00 03 0b 08 63 6f 75 6e 74 30 32  .........count02
001bfd00  2e 64 61 74 e0 02 00 00 00 03 00 00 00 02 00 01  .datà...........
001bfef0  63 6f 75 6e 74 30 33 2e 64 61 74 e0 02 00 00 00  count03.datà....

```

Thank you Lua, thou truly are a light in the darkness.
