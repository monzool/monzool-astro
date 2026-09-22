---
title: "Homebrew breaking git tab completion in zsh"
description: ''
pubDate: '2026-03-19'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "software"
tags: 
  - "git"
  - "homebrew"
  - "zsh"
---

**GIT TAB COMPLETION** in zsh suddenly stopped listing my aliases. No `git ls`, no `git tags-ls` - only built-in commands. Worse, commands beyond the most common ones lost their help descriptions entirely. `git re<tab>` would show `rebase`, `reset`, `restore` with nice descriptions, but `git rep<tab>` fell through to a bare list of names with no context. Something was clearly off.

## What happened

I am not really sure why this situation ended up happening. It might have been a brew update or a oh-my-zsh update?

Digging into zsh's `fpath`, I discovered that [Homebrew](https://brew.sh/) ships its own `_git` zsh completion wrapper alongside the git formula. It lives at:

```text
/home/linuxbrew/.linuxbrew/share/zsh/site-functions/_git
```

This is a lightweight wrapper that narrows down known git commands, to a finite set of "common commands" - things like `add`, `commit`, `push`.

My Ubuntu's own `_git` at `/usr/share/zsh/functions/Completion/Unix/_git` is far more comprehensive. It has descriptions for all commands and proper alias support.

## Figuring out which completion is active

To check which `_git` zsh is actually loading, start a new shell and run:

```zsh
❱ print -l $fpath
/home/linuxbrew/.linuxbrew/share/zsh/site-functions   # <-- brew
/home/monzool/.oh-my-zsh/plugins/git
...
/usr/share/zsh/functions/Completion/Unix              # <-- system
```

zsh resolves autoloaded completion functions by searching `fpath` **in order** and using the first match. Brew's `_git` is found before the system one because `brew shellenv` **prepends** its directory to `fpath`:

```zsh
fpath[1,0]="/home/linuxbrew/.linuxbrew/share/zsh/site-functions";
```

## The fix

The brew site [documents](https://docs.brew.sh/Shell-Completion) how to activate its shell completions. In this case I wanted to have the system completions to take precedence.

The fix is to move brew's `site-functions` to the **end** of `fpath`, so system completions take priority while brew-only completions (like `_brew`, `_rg`, `_jj`) still work.

I added this to `~/.zshrc` right after `eval "$(brew shellenv)"`:

```zsh
# Move brew's zsh completions to end of fpath so system completions take priority
fpath=(${fpath:#$HOMEBREW_PREFIX/share/zsh/site-functions} $HOMEBREW_PREFIX/share/zsh/site-functions)
```

Then cleared the completion cache

```bash
〉rm -f ~/.zcompdump*
〉compinit
```

Full git completion restored. Aliases and descriptions for all commands now works 🥳
