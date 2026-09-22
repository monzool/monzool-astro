---
title: "Going down the Fish shell internet wormhole"
description: ''
pubDate: '2020-07-27'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "personal"
  - "shell-scripting"
  - "software"
---

**A FISH SHELL** installation resonantly led me down a wormhole of new information. Hyperlinks are the greatest thing ever invented - but can also be somewhat of a time consumer :-D

I decided to install the fish [shell](http://fishshell.com). I've tried it before a long time ago, so thought it would be fun to give it another spin.

I usually run zsh with the prezto framework (+ my own configuration suite), so my first thought after installation was if there was some oh-my-zsh or similar equivalent for fish. There was: [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish). Installed that, changed the theme a few times and tried a few commands. The plugin list was not that extensive - that is, compared to what is available for zsh.

I then wondered what other people set up after installing fish. This led me to an nice post [https://reckoning.dev/fish-shell](https://reckoning.dev/fish-shell) where the writer had similar background as myself. The fisher package manager was recommended.

Off to the [fisher](https://github.com/jorgebucaran/fisher) site and read. Then a little detour to see which other package managers were available. Decided fisher was the most used. Then some google whether oh-my-fish and fisher could co-exist. They could, so kept them both. Back to https://reckoning.dev/fish-shell and looked at the mentioned plugins.

The [grc](https://github.com/garabik/grc) command colorizer looked interesting, so I installed that.

It did not take long for me to miss [fzf](https://github.com/junegunn/fzf), so when the site also addressed fzf, I immediately googled how to install that. There was various plugins providing fzf, but it was not clear to me why one was better that the other. Decided just to install the vanilla fzf with its build-in fish shell support.

I knew that fish is not posix shell, so the package \`bax\` caught my attention. Its a package that makes running things as bash easier. To get an idea of the extend of the non-compatibility, I decided to google a bit about bash compatibility. This popped up, although not really related to my query: [https://medium.com/better-programming/why-i-use-fish-shell-over-bash-and-zsh-407d23293839](https://medium.com/better-programming/why-i-use-fish-shell-over-bash-and-zsh-407d23293839)

This mentioned [SpaceFish](https://github.com/matchai/spacefish) as best prompt theme ever. SpaceFish is however superseded by [Starship](https://github.com/starship/starship). The Starship page mentioned that it required a Nerd Font.

This lead me to [nerd-fonts](https://www.nerdfonts.com). Been using Fire-Code for looong time, but didn't know there was a emoji enhanced edition of this, and many more font packages. Cool

Now this took me on an slight sidetrack as I had to figure out how to install AUR packages in [Manjaro](https://manjaro.org/). At work I have a remote machine that I pretty much only use for serial access to a couple of targets. I have installed Manjaro on it, which makes it different from most of my other PC's. I have distro hopped quite a bit in my long linux tenure, but at work I've pretty much just settled on Ubuntu. It works and if not, online help are a plenty available. Anyway for this "no special needs" machine I tried an arch distro. I'm pretty happy with it, but haven't had the need to poke much since its installation (tftp gave me a bit of grief - actual still does regarding permissions)

Googling for hot to install AUR packages, quickly revealed that is was not so obvious as I had hoped - more precisely, there are (too) many helper applications to assist you. So, first task was to figure out which of the many installers to install. Found this site first [https://cloudcone.com/docs/article/install-packages-in-arch-linux-from-aur](https://cloudcone.com/docs/article/install-packages-in-arch-linux-from-aur) which recommends Yaourt. Other sites then appeared to no longer recommend it. Eventually my hunt landed me at [https://itsfoss.com/best-aur-helpers](https://itsfoss.com/best-aur-helpers). Trawling comments and settled for first recommendation, [Yay](https://github.com/Jguer/yay)

Maybe not super intuitive for a first time user (works a bit unexpected compare to other package managers), but got the fonts installed.

The whole plugin and theme tour, had derailed me from another list of links I wanted to review. Back at the fisher site. There was a mentioning of the [awesome list](https://github.com/jorgebucaran/awesome-fish) ...

Now what was I doing before this.... I forget :-P
