---
title: "Experiences on using a checklist in github PR template"
description: ''
pubDate: '2022-12-01'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "software"
  - "source-control"
---

**GITHUB PR TEMPLATES** are one of the many tools github provide to enhance daily use. This feature allows to "dump" some self-defined markdown into the PR description field upon creation of PR's.

In my current team at work we do a lot of automated testing. All updates to the test code are sent to github for CI checks and reviewing. For a while now, we have been using a template for the PR description field. So when you have made your changes and push a new PR, the description field is automatically populated with a template to be filled out. This is pretty nice as our PR descriptions gets to be uniform and everyone is sorta enforced to write a description that provide all necessary details.

Given the nature of our tasks, sometimes a PR will have a number of associated tasks that also need to be done or verified. Therefor a large part of the template became a **giant** checklist.

Some examples of the checklist could be something like this

☐ PR summary includes [Jira](https://www.atlassian.com/software/jira) ticket number  
☐ This PR adds a new test  
⠀⠀☐ New test is added to [Xray](https://www.getxray.app/) test execution  
☐ Update to existing test  
⠀⠀☐ Test case bug  
⠀⠀☐ Product change  
⠀⠀⠀⠀☐ Applies to release branches  
☐ Includes a framework change

For relevant items you change ☐ to ☒ and delete all the non relevant items. This way the PR should only include the relevant information.

Some initial thoughts about the checklist was for it to allow reviewers to see if the implementer had remembered all the required non-source related stuff, but also for at way to quickly conveying the implications of the PR. Is it just a minor bug-fix or does it change something in the testing framework itself? Reviewers could get an indication about how much effort this review requires, and which PR's senior developers or domain experts should prioritize \*[PR scope](#pr-scope).

This workflow can be considered "red tape" - and it is! And the more PR's you make, the more increases the resentment for this extra work of reading the giant list, finding the right boxes, checking them and deleting the rest. For the grand majority of PR's the most parts of this giant checklist is irrelevant. Like a robot you check that single bug/flaky/update/debug box and delete the rest.  
This definitely related to ones experience level. When you have done the same task many times, the checklist end up being a nuisance; but then there are times when the checklist does do offer some help - which is also why its still there I guess. Did you just add support for a new product? This does not happen too often and then its nice to have a checklist \*[or an alternative](#checklist-alternative).

Anyway, over time it was observable that people got tired and became sloppy when filling out the checklist. Most would just check the top-level box and ignore the branch of derived checkboxes. People would omit or forget to delete all or some of the irrelevant checkboxes and leave a list for reviewers, that was largely irrelevant and had a high noise to signal ratio. A contributing factor to this might be that the checklist present very poorly in raw markdown on Github. It is difficult to locate the appropriate lines to check.

Filling out the checklist appeared to fatigue the developers. Sloppiness and brevity increased. Then the worst part. The checklist was the first part to fill out before making the textual description of the PR.

```markdown
# Checklist
_Check relevant boxes and delete the rest_
☐
☐
☐

---

# Description
_Write a description of the PR here_

---

# Test evidence
_Link to relevant test evidence_
```

By the time developers had filled the checklist, patience was lost and the description would often be either sloppy or omitted completely. I think mainly people were relying on the checklist to enlighten reviewers.

As the creator of git [pleads](https://github.com/torvalds/subsurface-for-dirk/blob/a48494d2fbed58c751e9b7e8fbff88582f9b2d02/README#L88), a good PR description is an essential part of what makes a good PR a good PR.

So I made a simple change and swapped the order of things and put the description first.

```markdown
# Description
_Write a description of the PR here_

---

# Checklist
_Check relevant boxes and delete the rest_
☐
☐
☐

---

# Test evidence
_Link to relevant test evidence_
```

The primary focus, and first thing you are required to do, is to write a textual description. This increased the quality of the descriptions drastically. Before you often had to somehow deduct from the checklist what was the context and implication of this PR. Now the increase in description quality most often makes this guessing a thing of the past.

The intent with the checkboxes might be right, but its audience was perhaps not tuned in perfectly. In practice its primarily a checklist of things one has to remember or consider when implementing certain kind of changes.  
Reviewers will benefit more from a good summary rather than some boring checkboxes. For additional reviewer context and scope, there actually already were such fields to be filled out in the bottom of the template.

```markdown
# Scope
_Select one or more: 
    Framework, common, product-A,..._

---
```

This should be enough for reviewers to quickly asses the extend of the PR, so I removed some irrelevant or unimportant checkboxes.

One other example of removed checkboxes is this:

☐ PR summary includes Jira ticket number

We already had a CI check as first step to ensure this. So if you forget, then the PR will fail quickly (this is also a company wide policy, so no one will be a stranger to this rule).

## Conclusions

I think using a common template is a good thing and has it benefits. Checklists in particular obviously have their merits. When you are new to the team or doing especially complicated workflows, a checklist can be invaluable. However if that checklist becomes to long, it becomes counter productive. If it is seldom worth the trouble, it eventually becomes ignored.

The checklist was originally added for a reason. It will make you go stop, and reflect if all tasks have been considered. But it might have gone a bit overboard in its current incarnation. It needs to strike a balance of not being (too much) in the way for the majority of PR's, which are simple, but still be able to act as a reminder for more complicated PR's.  
  
Perhaps an alternative would be to have a wiki/document with the checklist. Then you could reference that list **before** making the PR and then have a template with simple single level checkboxes?

Perhaps this is not a problem that is perfectly solvable, but its an iterative process and nothing is set in stone. We'll see how it goes.

An overall observation would be that people are lazy (myself included), and will not go through too many obstacles before rushing to the finish line and publishing that exciting PR for review.

## Addendum

Another "conflict" between the template and people using it, was that almost all would forget or omit to delete the sections guideline texts (the guideline examples were shortened in this blog post), so that was additional leftovers to clutter the final PR descriptions.

This was an easy fix. I just made the guidelines into html comments.

```markdown
# Description
<!-- Write a description of the PR here -->
```

Then the guidelines would then no longer be visible in the PR, regardless of people deleting them or not.

This trick I also had to apply for another issue that the template suffered from. Now that people were actually writing longer description texts, a formatting issue would often occur.

A PR description would often appear like this:

* * *

**Description**  
This is the first line, talking about my PR.

**This is the last line covering my PR**

**Checklist**  
…

* * *

The last line in the description section would often appear large and in bold.  
In the template, every section is split with a separator marker that generates a horizontal line (`---`). What was in fact happening, was that people would not take care to leave an empty line above that separator marker, and unwillingly generate a headline.

```markdown
This is a headline
---

This is a line of text

---
```

The markdown viewer will interpret the first line as a headline because of the missing newline before the separator marker.

Inserting a html comment before the separator marker resolved this issue.

```markdown
# Description
<!-- Write a description of the PR here -->

<!-- -->
---
```
