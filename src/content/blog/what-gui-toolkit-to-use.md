---
title: "What GUI Toolkit To Use?"
description: ''
pubDate: '2008-02-29'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "personal"
  - "programming"
  - "software"
---

**GUI PROGRAMMING IS** not something I've done in quite a while. At work I do embedded programming and that's mainly also what I've been doing for my own personal projects. Except for some small utility applications I really haven't done large GUI projects since [MFC 6.0](http://en.wikipedia.org/wiki/Microsoft_Foundation_Class_Library) was cool (if such a time ever was) `]:->`.

An absolute requirement is that the end result must be multi platform capable (Linux, BSD, Mac OS X and Windows). Plenty of frameworks and toolkits exists that fulfill that requirement, but I find that the Kde/Qt constallation is the most exiting and complete toolkit(s) around - especially given the multi platform perspective introduced by Kde 4. Although Kde 4 is not quite stable yet, I think the choice is wise in a longterm perspective.

I primarily do C/C++ programming (and a bit of Lua scripting), but I really would like to extend my horizon (or more precise raise above n00b level) in other programming languages like C# and Python. Given that I have much to learn about Kde, GUI's and what else is hot in the desktop programming world, the option of C# is not a mandatory requirement. I could settle on a C++ and Python solution.

Mixing two complete different kinds of languages (static and dynamic) requires either good binding layers or Mono. The [Kde Project](http://www.kde.org) provides a large suite of binders in the KdeBindings package. The [README](svn://anonsvn.kde.org/home/kde/trunk/KDE/kdebindings/README) contains a concise description of the project contents:

```text
This package contains:
* working:
  * korundum: KDE bindings for ruby
  * qtruby: Qt bindings for Ruby
  * smoke: Language independent library for Qt and KDE bindings. Used by QtRuby 
    and PerlQt.
  * kalyptus: a header parser and bindings generator for Qt/KDE. Used for
    Smoke, Java, C# and KSVG bindings generation at present.
  * ruby/krossruby and python/krosspython which are plugins for the kdelibs/kross
    scripting framework to provide scripting with python+ruby to applications.
  * PyKDE: KDE bindings for python, requires PyQt from riverbankcomputing.co.uk
  * Qyoto: Qt bindings for C#
  * Kimono: KDE bindings for C#

```

The Mono project seems to be somewhat controversial. A [lot of writing](http://osnews.com/story/19388/Another_GNOME-Mono_Discussion) has being going on lately on Mono vs. Novell/Microsoft vs. freedom. [Anders Hejlsberg](http://channel9.msdn.com/ShowPost.aspx?PostID=159952) and his team have created both clever and interesting stuff in the .NET architecture like C#, DTS (Common Type System) and CLR (Common Language Specification), but I can't appreciate embracing other closed proprietary technologies from the .NET portfolio, when other alternatives exist in the FOSS community. I think Robert Devi summed it up nice in the [Osnews.com comments](http://osnews.com/permalink?302420) (the personal rantings of Robert on Mono speed/memory, Amarok etc. I don't agree on).

As far as I can tell, the above observations give me the following constructs:

1. C++ + [Kross](http://kross.dipe.org) + [PyQt](http://www.riverbankcomputing.co.uk/pyqt) + PyKde(`*1`).
2. [Mono](http://www.mono-project.com) + C# + limited managed C++ + [Qyoto/Kimono](http://cougarpc.net/qyoto) + [IronPython](http://www.codeplex.com/Wiki/View.aspx?ProjectName=IronPython).

`*1`: PyKde is not released for Kde 4 at present time.

Its a difficult decision whether to choose the one or the other construct. Because I have already done much C++ coding (and [shot a foot off more that once](http://www.softpanorama.org/Lang/Cpp_rama/humor.shtml)) and not much C# coding, I lean mostly towards the Mono solution. Unfortunately this could potentially force me to use [MonoDevelop](http://www.monodevelop.com). Tried it eight months ago and tried it again yesterday; it's still the single most unstable piece of software I **ever** used `:-(`. Hope its not the case that it only works on OpenSuse or Suse. That would not be freedom. Anyways, selecting C# would mean that the money I spent on the book [Professional C#, 3rd Edition](http://www.wrox.com/WileyCDA/WroxTitle/productCd-0764557599.html) won't go to waste.
