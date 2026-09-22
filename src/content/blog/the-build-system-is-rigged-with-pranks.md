---
title: "The build system is rigged (with pranks)"
description: ''
pubDate: '2021-10-05'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "shell-scripting"
---

**RIGGING A BUILD** system sounds very serious! In this case it was not though. More a case of friendly messing with the coworkers. A coworker recently reminded me of a "feature" I had put into a build script...

Actually this mentioned "feature" was "features" and put in an umbrella script. This would act as an "easier" to use front-end for a plethora of specialized build scripts, that I also had put together.

## The tasks of the scripts

A script for each task would handle:

- Build u-boot
- Build linux kernel
- Build vender BSP
- Fetch prebuild packages, build with proprietary build system
- Checkout own source code from various subversion and github repositories
- Call various generators
- Build own software using proprietary build system
- Build own software using make
- Build own software using Cmake
- Build web-ui with node-js
- Extract and include third party binaries
- Create a release note, version file
- Put together a sysroot
- Extract and save debug information
- Create a filesystem for release and debug

Finally a script that would upload to a finalizing Jenkins builder. That in turn would combine this with nightly builds of FPGA's, DSP's, front-end processors and other thingies, to create a final product update bundle

All scripts would use the same helper libraries for creating build logs, do visual build progress presentation, do system checks, input parsing and setup sane defaults for values not set on the command line.

This would mean that you could use any of these scripts individually. So you could do your modifications in a single file of a sub-project, then call the right script and have that component compiled for manual replacement on a target. Or you could use the specific script to ensure it compiled, then use the umbrella script to collect it all for a full update of the target. If already build once, it would only fetch/build/generate what was changed. So a convenient tool for daily testing/verification of features, but also for nightly clean builds for automatic testing.

The scripts were build for doing release builds initially and thus tailored for prioritizing correctness first. When doing local development, this mattered less. Logging would also be less noisy for local builds, and binaries would not be stripped. The individual developer would typically be interested in running a build only of a specific part of the whole build:

```bash
./BIG_GREEN_BUTTON -d ./build_scripts/build_web.sh
```

BIG\_GREEN\_BUTTON is the aforementioned umbrella script. In this example the complete clean and build is bypassed, and only the web-ui is selected for build (with no tuning options for that component).

Simple enough, but things could get much worse in case of usability if wanting to tweak

```bash
FORCE_ROOTFS_EXTRACT=1 DEVSETUP_PACKAGES=${HOME}/bbe ./BIG_GREEN_BUTTON -n -o nofix -r -x none -s sparse -d ./build_scripts/build_make.sh -f csm
```

This would setup the following:

- `FORCE_ROOTFS_EXTRACT=1` - Skip various rootfs checks before extracting
- `DEVSETUP_PACKAGES=${HOME}/bbe` - use prebuild packages from local machine instead of downloading them from scratch
- `-n` - do _noisy_ logging (log everything to stdout)
- `-o nofix` - skip clang-format and custom source checkers
- `-r` - Use `saferm` instead of `rm` for deleting files to a trashcan
- `-x none` - Do no unit-testing
- `-s sparse` - Utilize a sparse cleaning strategy before building

This is a bit of an extreme example, but does not near touch all possible options. It doesn't really matter though. The first example would usually do the right thing. By always having the same entry point (the umbrella script) for all sub-scripts, I could auto-detect most things, and set proper default options for the individual scripts. That way developers could usually just run BIG\_GREEN\_BUTTON with simple options and get what they needed.

## Rigging the build system

Now for the mentioned "features" ... well lets just call them easter eggs. I had put those in the BIG\_GREEN\_BUTTON script, so regardless of how and what developers would build, it would always be in play

### Roll the chance of getting nothing done

This first one:

```bash
function roll_chance_of_no() {
    local sample_space=20
    local number=${RANDOM}
    let "number %= ${sample_space}"

    if [[ $number == 13 ]]; then
        echo
        echo
        echo "${RED}Game over!${RESET} ${CYAN}You loose${RESET} :-P   ${MAGENTA}Better luck next time${RESET}"
        echo
        exit ${number}
    fi
}
```

Before initiating the build, this function would roll a 20 side dice. If randomly hitting 13, the build script would immediately exit with a taunting comment. The expression on my coworkers face when being hit by this the first time was priceless 😄 This hit myself a surprising amount of times also

Actually the chance of no used to be higher, but when we hired in an external company for some special consulting, I tuned the risk down a bit 😉

The above easter egg is harmless enough. You just have to rerun the command, and most likely the build would then begin. The next little easter egg could be more persistent - depending on **when** you activated a build.

### Working in the weekend?

```bash
function work_weekend() {
    local today=$(date +%A)
    if [[ "${today}" == "Saturday" || "${today}" == "Sunday" ]]; then
        echo
        echo "Working in the ${RED}weekend?!${RESET} "
        show_greeting "That is sad... " "${YELLOW}" 0.02 nobreak
        sleep 0.5

        echo
        echo "Lets do something else"
        sleep 1

        nc towel.blinkenlights.nl 23
    fi
}
```

In case you were starting a build in the weekend, this function would give you a sympathetic remark, and then stream you a starwars movie in ascii. I put nc in our docker image for this use alone 😎

I'm not actually sure this works anymore... it might be that that website have been decommissioned, but I did hear from coworkers who were **quite** surprised about suddenly seeing an ascii movie 🎥

### Gambling with dices

A variation of detecting working late or weekends was the dice rolling function

```bash
function play_the_dices() {
    local current_time=$(date +%H:%M)
    local today=$(date +%A)
    if [[ "${today}" != "Friday" ]]; then
        return
    fi

    if [[ "${current_time}" > "17:00" ]]; then
        echo
        echo "It's late ${YELLOW}friday!${RESET}. All work and no play.... Let play a game "
        sleep 1

        while [[ true ]]; do
            local number=$(( ( RANDOM % 6 )  + 1 ))

            echo "Press [enter] key to roll the dice..."
            read
            echo "You rolled: ${number}"
            sleep 0.3

            if [[ ${number} != 6 ]]; then
                echo "${RED}You win${RESET}!. Play again"
                echo
            else
                echo "${RED}You loose${RESET}!. Now back to work"
                return
            fi
        done
    fi
}
```

If you work late on a friday, you get to play a game of dice rolling. If you loose, the game ends and you go back to work 😜 That game I eventually disabled. Can't quite remember why, but perhaps I got too many complaints about that game 😅

## No fun

Now I did provide an escape hatch (which I utilized on the automatic builders). You could admit that you sucked, and it would bypass this fun 😉

```bash
I_SUCK=1 ./BIG_GREEN_BUTTON -b rootfs
```

In the end, everyone just sucked all the time, and no fun was had (well, not literally) 😄
