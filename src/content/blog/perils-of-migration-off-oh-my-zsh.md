---
title: "Perils of migration off oh-my-zsh"
description: ''
pubDate: '2026-08-05'
heroImage: '../../assets/perils-of-migrating-off-oh-my-zsh/thumb.jpg'
categories:
  - "linux"
  - "shell-scripting"
---

**ABANDONING OH-MY-ZSH MADE** me realize it provided a lot more convenience and niceties than I first realized. Originally I chose oh-my-zsh for no other reason than it being a drop-in replacement for the, at that time, defunct [prezto](https://github.com/sorin-ionescu/prezto). Fact of the matter was that I didn't really use any of the plugins and none of the shortcuts, so after being influenced by some blog posts and quite a few reddit comments dissing oh-my-zsh and praising the benefits of moving away from the big old and slow framework, I figured I'd just abandon it also.

Now, some things need to be set up manually. This was obvious as a zsh installation from brew doesn't do anything but the bare and limited defaults of zsh.

## Themes/prompt

I did use [Alien](https://github.com/eendroroy/alien) before. It's a fantastic prompt engine, but it also invites a lot of tinkering. In the quest for a simpler setup with less maintenance and tinkering "burden", I now let [starship](https://starship.rs/) handle this. It's super simple and looks great (btw if you use GitHub Copilot, then I have an [AI CO2 plugin](https://github.com/monzool/copilot-co2-trees) for starship)

## Package management

I chose [Antidote](https://antidote.sh/) as my package manager. This [reddit thread](https://www.reddit.com/r/zsh/comments/12gjy04/current_state_of_plugin_managers/) had some influence on the choice, but I also read some other opinions and benchmarks. In the end I cared less about speed than about how widespread and supported the manager is.

## Auto-completion

The auto-completion experience was pretty sub-par out of the box. I tried a few different solutions, but eventually settled on [aloxaf/fzf-tab](https://github.com/aloxaf/fzf-tab). Initially the experience wasn't as fantastic as reviewers led me to believe, but I then realized I had not utilized the [configuration](https://github.com/Aloxaf/fzf-tab#configure) suggestions from the repository documentation. That made it awesome! ... but. [Defaults matter](https://blog.codinghorror.com/the-power-of-defaults/) - why not make it awesome out of the box?!

`fzf-tab` sits on top of a pretty basic completion configuration

```zsh
autoload -Uz compinit && compinit
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
```

## History

oh-my-zsh sets up decent history handling, so apart from increasing history size, I never spent much thought on its configuration.

I am currently at this _work-in-progress_ configuration:

```zsh
alias history='fc -i -l'         # yyyy-mm-dd HH:MM (24h)

setopt extended_history          # save timestamp + duration
setopt inc_append_history_time   # write to history immediately after command finishes
setopt hist_ignore_dups          # don't store if same as previous
setopt hist_ignore_all_dups      # remove older duplicate when same command added
setopt hist_save_no_dups         # don't write duplicates to file
setopt hist_find_no_dups         # skip duplicates when searching
setopt hist_ignore_space         # prefix with space to skip storage
setopt hist_reduce_blanks        # remove superfluous blanks from each command line
setopt share_history             # share history across sessions
setopt hist_verify               # load history expansion (!!, !$, ...) into buffer for review before running

export HISTORY_IGNORE="(cd|cd ..|ls|ls *|ll|la|pwd|exit|clear|history|man *|which *|echo *)"
```

## Shortcuts

I did have some extra shortcuts for history navigation. Something I found on the interweb in a distant past. Works quite well.

```zsh
# Arrow key prefix search
autoload -Uz up-line-or-beginning-search down-line-or-beginning-search
zle -N up-line-or-beginning-search
zle -N down-line-or-beginning-search

# Keeps history shared across sessions (share_history above) while still
# giving quick access to just this session's own history on demand.
up-line-or-local-history() {
    zle set-local-history 1
    zle up-line-or-history
    zle set-local-history 0
}
zle -N up-line-or-local-history
down-line-or-local-history() {
    zle set-local-history 1
    zle down-line-or-history
    zle set-local-history 0
}
zle -N down-line-or-local-history
```

But now, without oh-my-zsh's [`lib/key-bindings.zsh`](https://github.com/ohmyzsh/ohmyzsh/blob/master/lib/key-bindings.zsh), I had to tinker a lot more with the key bindings. This was actually a bit of a chore to set up and people on the interweb have a lot of different opinions on how to set this up. There are also some weird "gotchas" - apparently if `EDITOR=vim` is configured, zsh will also default to vim bindings.

```zsh
# Emacs key bindings (prevents vi mode from EDITOR=vim)
bindkey -e
```

In the end this was confusing, cumbersome and a boring chore. I frankly ended up letting Copilot do the work, and it worked out great.

```zsh
bindkey '^[OA' up-line-or-local-history         # Ctrl + Cursor up
bindkey '^[OB' down-line-or-local-history       # Ctrl + Cursor down
bindkey '^[[1;5A' up-line-or-history            # Application cursor mode up
bindkey '^[[1;5B' down-line-or-history          # Application cursor mode down
bindkey "^[[A" up-line-or-beginning-search      # ↑
bindkey "^[[B" down-line-or-beginning-search    # ↓

bindkey "^[[1;5C" forward-word                  # Ctrl+→
bindkey "^[[1;5D" backward-word                 # Ctrl+←
bindkey "^[[3~"   delete-char                   # Delete
bindkey "^[[3;5~" kill-word                     # Ctrl+Delete
bindkey "${terminfo[khome]}" beginning-of-line  # Home (application cursor mode)
bindkey "${terminfo[kend]}"  end-of-line        # End  (application cursor mode)
bindkey "^[[H"    beginning-of-line             # Home (normal cursor mode)
bindkey "^[[F"    end-of-line                   # End  (normal cursor mode)
bindkey "^[[1~"   beginning-of-line             # Home (vt220-style)
bindkey "^[[4~"   end-of-line                   # End  (vt220-style)

# Edit current command line in $EDITOR
autoload -Uz edit-command-line
zle -N edit-command-line
bindkey "^X^E" edit-command-line                # Ctrl+x Ctrl+e

bindkey "^[m" copy-prev-shell-word              # Esc+m  (e.g. mv file <Esc-m>.bak)
bindkey " " magic-space                         # Space expands !! history
```

## Directory navigation

I copied `setopt auto_cd`, `auto_pushd` and `pushd_ignore_dups` pretty much verbatim from oh-my-zsh ([`lib/directories.zsh`](https://github.com/ohmyzsh/ohmyzsh/blob/master/lib/directories.zsh)).

## `OSC 7`/`OSC 2` vs WezTerm

So a lot of configuration was done and I thought I had a finished working configuration by now. Then when syncing my configuration to my work computer, where I am cursed with having to use Windows, my [WezTerm](https://wezterm.org/) + WSL setup started acting weird:

- Tabs would no longer show current directory

- Opening a new tab would not start in the current active directory

- WezTerm resurrect (†) would restore the current directory to my Windows home directory instead of my WSL home

† _I use a fork by Stephen Gemin of [resurrect.wezterm](https://github.com/StephenGemin/resurrect.wezterm) that has a lot of bugfixes and enhanced WSL support_

This was quite confusing. It only failed in WSL, but this **used** to work before, when using oh-my-zsh.

This is the explanation I arrived at:

Terminal emulators like WezTerm, Kitty, Ghostty do not automagically know which directory the shell is in or changing to. There is no native cross-OS support for this.

This begs the question of why I was only having issues in WSL and not on my native linux installations. I believe WezTerm does have a fallback to inspecting `/proc` for the current directory, but `/proc` support is spotty at best in WSL, which is probably why this did not work there.

To support this feature in a cross-OS, cross-terminal-emulator way, _Operating System Commands_ (OSC) have been invented. There are OSCs for multiple purposes which allow a shell to better integrate with the OS. Relevant for this scenario are [`OSC 7`](https://vtdn.dev/docs/osc/osc7/) and [`OSC 2`](https://vtdn.dev/docs/osc/osc2):

- `OSC 7` - reports the current working directory of the shell to the terminal emulator. This is what enables features such as opening new tabs in the same directory
    

- `OSC 2` - sets the window title of the terminal
    

The documentation for WezTerm can be read [here](https://wezterm.org/shell-integration.html#osc-7-escape-sequence-to-set-the-working-directory). To test it, write something like this in the shell to see the tab title change:

```bash
printf '\e]7;file://%s%s\e\\' "$(hostname)" "$PWD"
```

While modern shells like [nushell](https://www.nushell.sh/) and [fish](https://fishshell.com/) support `OSC 7` out of the box, bash and zsh require configuring hooks that call a piece of code which then emits the OSC event.

This is such a common situation that WezTerm ships its own official [`assets/shell-integration/wezterm.sh`](https://github.com/wezterm/wezterm/tree/main/assets/shell-integration), meant to be sourced from `.zshrc`/`.bashrc`

```zsh
# .zshrc
# Ref: https://wezterm.org/shell-integration.html
function load_wezterm_integration() {
    [[ "${TERM_PROGRAM:-}" == "WezTerm" ]] || return 0

    local _cache_dir="${XDG_CACHE_HOME:-${HOME}/.cache}/wezterm"
    local _cache_file="${_cache_dir}/shell-integration.sh"
    local _url="https://raw.githubusercontent.com/wezterm/wezterm/main/assets/shell-integration/wezterm.sh"

    if [[ ! -s "${_cache_file}" ]]; then
        mkdir -p "${_cache_dir}"
        curl -fsSL "${_url}" -o "${_cache_file}" || return 0
    fi

    [[ -s "${_cache_file}" ]] && source "${_cache_file}"
}

load_wezterm_integration
unfunction load_wezterm_integration
```

This fixed the directory tracking and both resurrect's saved state tracking and new tabs starting from the current directory now worked. Unfortunately all tab titles stayed stuck on presenting `wslhost.exe`. Although `OSC 7` technically would seem enough to set a title, a manual firing of `OSC 2` events confirmed that this is what would make WezTerm update the title. Alas, the WezTerm integration only provides half the solution.

Reflecting back to when using oh-my-zsh, both features worked there, so oh-my-zsh would certainly have a solution for handling both `OSC 7` and `OSC 2`. And sure enough, oh-my-zsh also has a script for hooking up zsh for handling these commands. Fortunately the feature was pretty confined and I could pick out the script for handling this with only a single helper script as dependency.

```zsh
# .zshrc
# Ref: https://github.com/ohmyzsh/ohmyzsh/blob/master/lib/termsupport.zsh
# Ref: https://github.com/ohmyzsh/ohmyzsh/blob/master/lib/functions.zsh
function load_termsupport_integration() {
    [[ "${TERM_PROGRAM:-}" == "WezTerm" ]] || return 0

    local _cache_dir="${XDG_CACHE_HOME:-${HOME}/.cache}/termsupport"
    local _base_url="https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/lib"
    local _file

    mkdir -p "${_cache_dir}"
    for _file in functions.zsh termsupport.zsh; do
        local _cache_file="${_cache_dir}/${_file}"
        if [[ ! -s "${_cache_file}" ]]; then
            curl -fsSL "${_base_url}/${_file}" -o "${_cache_file}" || return 0
        fi
        source "${_cache_file}"
    done
}

load_termsupport_integration
unfunction load_termsupport_integration
```

## Takeaway

The important question must be: _did I end up in a better place after abandoning oh-my-zsh_?

I am not so sure actually. Let's evaluate:

**pros**:

- zsh is now configured just to my taste and nothing else

**cons**:

- Configuring zsh took a relatively large amount of effort (but is hopefully a one time effort)

- I now got a lot of configurations to carry around and maintain. Before I should only install oh-my-zsh and that would be 99% of my needs

- To get a proper solution for several things, I had to duplicate or straight up copy/clone oh-my-zsh solutions

- The "promise" was infinitely faster startup, but I feel no real perceptible difference

- I have only been able to configure as far as my knowledge and investigation have brought me. Having a community driven configuration that benefits from a collective knowledge base has a huge advantage (as the `OSC` examples clearly show)

- I am not sure if I ended up having fewer or an increased number of external dependencies - although it's out in the open which ones I have now

**neutral**: (‡)

- I got to discover a lot of zsh features

- I learned a lot about how terminal emulators and shells interact

- Got [aloxaf/fzf-tab](https://github.com/aloxaf/fzf-tab) set up

‡ _In fact none of these are direct benefits of migrating away from oh-my-zsh. They are just a side effect of me taking my time to investigate zsh features and tools. Keeping oh-my-zsh would not have prevented me from achieving the same benefits._

### Lessons

I only saw the "tip of the iceberg" and decided I didn't need it, despite unknowingly relying on the massive "mountain" hidden underneath

Frankly, zsh sucks in its default setup

I also got reminded that often random interweb strangers don't know what they are talking about

#### Conclusion

From one standpoint I now know exactly what is going on, so I am glad for the _process_, but otherwise I am a bit underwhelmed by the actual benefits.

#### Reflection

I have been using zsh ever since prezto was announced, then later switched to oh-my-zsh; but I must admit that during this migration I have grown a bit of disdain for zsh from the sheer fact of how much configuring, tweaking and plugins/tools is required for making zsh the best it can be.... praise the invisible wonders of others making stuff just work for you
