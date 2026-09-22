---
title: "Scrambling BASH Script Contents"
description: ''
pubDate: '2016-11-08'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "shell-scripting"
---

**BASH SCRIPTS HAS** the inherit property of script languages of being readable by the users. Sometimes it is desireable to at least attempt to hide the inner details of a script.

There are a few possibilities to do at least a bit of scrambling of the contents of a script for the viewing end user.

The examples shown here are not real content hiding measures, but at first glance the end user will not have a clue of the content, and will have to do a bit of non-total-n00b work to get its contents descrambled.

Suppose we have a function that rolls the dice and if you hit a three, the scripts exits.

```
function roll_dice() {
    local sample_space=6
    local number=${RANDOM}
    let "number %= ${sample_space}"

    if [[ $number == 3 ]]; then
        echo
        echo "Better luck next time! Game over - you loose :-P"
        echo
        exit ${number}
    fi
}
roll_dice

```

For this first example _base64_ is used. It has the nice properties of converting any input to a sequence that contains only plain ascii characters.

If the above is saved in a script `roll_dice.txt`, the following command will base-64 encode it

```
cat roll_dice.txt | base64

```

As output from this command is printed the base64 encoded data:

```
ZnVuY3Rpb24gcm9sbF9kaWNlKCkgewogICAgbG9jYWwgc2FtcGxlX3NwYWNlPTYKICAgIGxvY2Fs
IG51bWJlcj0ke1JBTkRPTX0KICAgIGxldCAibnVtYmVyICU9ICR7c2FtcGxlX3NwYWNlfSIKCiAg
ICBpZiBbWyAkbnVtYmVyID09IDMgXV07IHRoZW4KICAgICAgICBlY2hvCiAgICAgICAgZWNobyAi
QmV0dGVyIGx1Y2sgbmV4dCB0aW1lISBHYW1lIG92ZXIgLSB5b3UgbG9vc2UgOi1QIgogICAgICAg
IGVjaG8KICAgICAgICBleGl0ICR7bnVtYmVyfQogICAgZmkKfQpyb2xsX2RpY2U=

```

The data can now be used in a script and evaluated. To descramble the data back to its original bash content, the _base64_ command is used again, but in reverse.

This makes it nothing but data though, so to have it evaluated (executed), the `eval` command is used to runtime evaluate the code loaded to the `dice` variable.

```
#!/bin/bash

dice=$(base64 -d <<'EOF'
ZnVuY3Rpb24gcm9sbF9kaWNlKCkgewogICAgbG9jYWwgc2FtcGxlX3NwYWNlPTYKICAgIGxvY2Fs
IG51bWJlcj0ke1JBTkRPTX0KICAgIGxldCAibnVtYmVyICU9ICR7c2FtcGxlX3NwYWNlfSIKCiAg
ICBpZiBbWyAkbnVtYmVyID09IDMgXV07IHRoZW4KICAgICAgICBlY2hvCiAgICAgICAgZWNobyAi
QmV0dGVyIGx1Y2sgbmV4dCB0aW1lISBHYW1lIG92ZXIgLSB5b3UgbG9vc2UgOi1QIgogICAgICAg
IGVjaG8KICAgICAgICBleGl0ICR7bnVtYmVyfQogICAgZmkKfQpyb2xsX2RpY2U=
EOF
)
eval "${dice}"

echo "Welcome, you lucky one"

```

There are several reasons why this is more a fun/prank trick, than an actual security measure. But if you want, the same trick can be used with _gpg_. This will disallow users to run or decode the scrambled script lines unless the passphrase is known.

Firstly create a _gpg_ encoded script snippet. When run, _gpg_ will prompt for encoding passphrase.

```
» gpg -ac -o- <<'EOF' | xclip -selection clipboard
echo "I am encrypted"
EOF

```

As the key is required for executing the encrypted parts, the bash script needs the passphrase. Therefore there is no way to hide the key, which eventually means that the end user will always have a means to decode the script before executing. Alternatively, let gpg ask for the passphrase and anyone knowing the correct passphrase will be able to run its hidden content.

In the script below the user will be prompted for the decoding passphrase before being able to execute the encoded section.

```
#!/bin/bash

echo "To learn the secret, you must know the passphrase"

secret_message=$(gpg -d <<'EOF'
-----BEGIN PGP MESSAGE-----
Version: GnuPG v1

jA0EBwMCJ+zlMDPCUlBg0ksBUQm4AstVcHFIluhT8Og0RA83X5s6p54JWisJz/mk
xgdBFTcMXYto0fHgT2N4vC0BFog39IFDp6oMXRjtI1Quv1YQx4HTmVaRYeA=
=z7wJ
-----END PGP MESSAGE-----
EOF
)
eval "${secret_message}"

```
