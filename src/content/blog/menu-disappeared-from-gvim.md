---
title: "Menu Disappeared From GVim"
description: ''
pubDate: '2009-04-27'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "software"
---

**THE MENU IN** GVim suddenly disappeared?! I did not provoke this by making changes in any `.vimrc`, `.gvimrc` or in any files in the `.vim` directory. The menu was just gone after a boot when GVim auto-loaded the documents open before the reboot. The system is Kubuntu 8.04 and vim-gnome.

I googled for a solution and eventually found an [answer at Nabble](http://www.nabble.com/Re%3A-Menu-gone-in-gvim-\(guioptions\)-p21455050.html) (thanks goes to _mmarko_). It appears that something (?) changed the Gnome setup for GVim in the file `~/gnome2/vim`.  
No menu:

```ini
[Placement]
Dock=Toolbar\\0,0,0,0\\Menubar\\0,0,0,0

```

With menu:

```ini
[Placement]
Dock=Toolbar\\0,1,0,0\\Menubar\\0,0,0,0

```
