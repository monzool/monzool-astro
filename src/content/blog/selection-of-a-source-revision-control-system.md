---
title: "Selection of a Source Revision Control System"
description: ''
pubDate: '2007-09-05'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "source-control"
---

**AFTER SOME TIME** of using tarballing as a [source revision control](http://en.wikipedia.org/wiki/Revision_control "Revision Control") system, I thought it was about time getting back to using a real tool for managing my source code.

I've then used [Perforce](http://www.perforce.com/ "Perforce") as my VCS for some time now. At work we are using ClearCase and from what I could gather form the Perforce documentation it seemed that Perforce would operate very much like ClearCase. However its clear now, that I'm not Perforce "compatible". I find Perforce very unintuitive, and after a second time of having to resort to clearing my repository, after another fine \[workspace\] mess I've gotten my self into, Its clear that its time to try another system.

My new requirements to a VCS is that it must be FOSS and run on Linux, MAC OS X, OpenSolaris and Windows (I don't use Windows but I can't exclude that the need won't come up some day). I also want to be able to work on the source without being connected to the repository server.

As [this](http://en.wikipedia.org/wiki/Comparison_of_revision_control_software "Comparison of revision control software") comparison chart on Wikipedia shows; one thing is sure: The world is not in lack of source revisioning systems.

After a lot of googling it seems that the hot contenders of the time are: [Bazaar](http://bazaar-vcs.org/ "Bazaar"), [Git](http://git.or.cz/ "Git"), [darcs](http://darcs.net/ "darcs") and [Mercurial](http://www.selenic.com/mercurial/wiki/ "Mercurial").

Choosing the one over the other is extremely difficult as not much differentiate them from each other. They all have their niches where they excel compared to the others, but from what I can understand from their feature list, they will all be more than enough for my VCS needs. Two candidates I could eliminate quite easy. The FOSS requirement is because I want to have the possibility to look around, and perhaps poke a bit, in the code. Git is primarily written in C, but my patience just don't stretch enough to look into another C project written by a bunch of kernel hackers. Darcs is written in Haskell, and regardless of the "hotness" of Haskell I don't have any intentions of learning that language. Thus candidates remaining are Bazaar and Mercurial.

Bazaar and Mercurial are so alike that its hard to believe that one did not just fork from the other. Searching the internet gave no reason to believe that the one is inferior to the other. So which is better? I think that is impossible to determine without hands on experience from both systems - and from what I can read on the internet, even this is not always enough to prefer the one over the other. Actually this makes me question the rationale of having two projects so similar. Competition is good, but if the one does not stand out from the other, why not join forces?

Lots of people talk of Bazaar and/or Marcurial. Here's a page that's pro Bazaar: [My merry five minutes with Bazaar](http://commandline.org.uk/2007/my-merry-five-minutes-with-bazaar "Command Line Warriors"). And here's a page that's pro Mercurial: [Distributed SCMs: Be Smart, Use the Bleeding Edge](http://www.mathewabonyi.com/articles/2007/08/05/distributed-scms-be-smart-use-the-bleeding-edge "Wood for the Trees")

To summarize my internet readings ([here](http://versioncontrolblog.com/ "Version Control Blog") is a dedicated on-topic site), then I didn't find any clearcut arguments for Mercurial over Bazaar other than perhaps speed and maturity level. Bazaar on the other hand seems to be regarded as having slightly more user friendly use-cases.

Mercurial have support from prominent projects like OpenSolaris, Mozilla, Plan 9 and Xen. Bazaar have Ubuntu. Not sure the merits actually mean anything though.

This [site](http://better-scm.berlios.de/comparison/comparison.html "Better SCM Initiative") gave a good comparison of some high profiled VCS. Of my two candidates it only included Mercurial, but the comparison did include ClearCase which made it clear that Mercurial offered more or less the same feature set as provided by ClearCase.

The options seems clear. Keep tarballing, roll the dices or give both Bazaar and Mercurial a try... hmm I better give them a try ;-)
