---
title: "Awk"
description: ''
pubDate: '2020-10-09'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "shell-scripting"
---

**AWK WAS SCARY** but proved to be awesome!

![monzool_vs_awk-300x298](../../assets/awk/monzool_vs_awk-300x298.png)

awk is not something I usually have reached for, when having to do more that trivial text processing tasks. Well, the classic column print functionality of awk is so strait forward that its unavoidable ;-)

```
cat data.csv | awk -F ',' '{ print $2 }'

```

Otherwise I almost always tend to end up doing some custom line processing in bash, sed or python. However at a recent task, I decided the need for awk had emerged. I did consider [txr](www.nongnu.org/txr) but in the end being installed just about everywhere, and its available documentation made me opt for awk.

In short description the task to solve was: In some C programs, a great deal of structs with a generated `_size` define was used wrongly. Depending of how it is used, `_size` should be replaced with either a new generated define `_size_max` (calculated by macro) or just as `sizeof(struct)`. The total effort ended up using a lot of bash glue around [silver searcher](https://github.com/ggreer/the_silver_searcher), [pycparser](https://github.com/eliben/pycparser) and then Awk.

What amazed me about Awk was its great flexibility, but yet the documentation managed to make it reasonable approachable anyway. For getting started I found [this](https://www.grymoire.com/Unix/Awk.html) document as a helpful starting point. For further background, depth and detail the [gawk manual](https://www.gnu.org/software/gawk/manual/gawk.pdf) was invaluable.

Before getting to the few Awk source snippets, understand that Awk has three section. Each of them is optional and run on different points in time:

```
BEGIN {
}
{
    // action
}
END {
}

```

The `BEGIN` section executes first thing as the script starts. Opposite is the `END` sections which run when the script ends. The section in between is executed for each line on the input (unless instructed otherwise).

The following snippet is an (incomplete) part that I used in the process. Having to replace an argument in a function call is easily solved, even with just sed or bash, but when the arguments are then given on multiple lines, the solution requires a bit more effort.

```
    transmit_to_lpc(destination,
        type,
        data_struct,
        data_struct_size);

```

Awk by default reads line by line as most unix tools, but its record variable RS, allows for convenient manipulation to read until any other thing. The snippet below instructs Awk to read until it meets the block ending character in C ;.

```
#!/usr/bin/gawk -f -i inplace

BEGIN {
    # Split lines on ';'
    RS=";";
}
{
    if (/transmit_to_lpc/) {
        gsub(/_size/,"_size_max");
        print $0;
    }
}

```

After running the Awk script, the source have been transformed.

```
    transmit_to_lpc(destination,
        type,
        data_struct,
        data_struct_size_max);

```

Another nifty trick made easy by Awk was to count the instances replaces. This was mainly used for a basic statistic set of which projects/files suffered the most from wrong size use.

```
gawk -i inplace 
    -v old="${tag}"
    -v new="sizeof(${tag})"
    -v file="${f}"
        'END{ 
            if (t > 0) {
                print t, "substitutions of", old, "in", file 
            }; 
            exit t
        }
        { 
            if (!/transmit_to_lpc/ && !/transmit_to_stm/) {
                t += gsub(old, new)
            }
        }1' "${f}"

```

The above (simplified) example does the `_size` to `sizeof` replacement. To not replace and count what should be handled be the previous snippet, this script guards not to run the replacement if the line contains `transmit_to_lpc` or `transmit_to_lpc`. If none of those functions, the replacement is performed and counted. When the script ends, the \`END\` section will run and print the replacement count. Nice and simple :-)
