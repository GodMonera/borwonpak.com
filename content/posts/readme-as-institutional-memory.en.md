---
title: "A README with 95 sections, and why it pays for itself"
date: "2026-10-09"
summary: "Good documentation doesn't say what the code does. It says why it was written that way, and which bug ordered it."
tags: ["IQ Tutor", "documentation", "process"]
---

The IQ Tutor README now has more than 95 numbered sections. It is far too long for anyone to read start to finish.

That's fine. It was never meant to be read start to finish.

## It isn't documentation. It's a changelog with reasons.

Each section does not say "here is what this feature does." It says "here is why it was designed this way" — including the bug that forced the design.

The clearest example is LINE rich menus. Two separate sections record the same hard-won fact: a menu created in the LINE Official Account Manager UI can never work with this system, because it has no Messaging API id.

I lost time to that once. Without it written down, I — or whoever takes this over — would lose the same time again.

## Why it pays off

I'm the only person on this project, which means all the knowledge lives in my head. That's a terrible place to keep it. I forget. I go work on something else. I cannot reconstruct why I decided something three months ago.

The concrete payoff is this: before changing anything, I read the section covering that area, and more than once it has stopped me from "fixing" something that was deliberate.

Some of the inconsistencies in the system aren't bugs. They are business decisions that were already argued out. Without the record, they look like bugs every single time you come back.

## The rules I follow

**Write on every ship.** A new feature gets a new numbered section. Follow-ups and bug fixes get appended to the section they relate to. No exceptions.

**Record the incident, not just the outcome.** If a bug forced a design change, the bug goes in. A design with no reason attached always gets torn out later by someone — frequently by me.

**Split by reader.** The README is reasoning and history for whoever writes code. `FEATURES.md` is a plain-language "what can this thing do" list for the owner. The GitBook is step-by-step picture guides for admins, tutors and parents. Different audiences, different documents.

**Comments explain why, not what.** The next line can speak for itself.

## The cost I accept

The file is enormous. Finding something depends on search, not reading. And writing each entry takes real time — sometimes as long as the small feature it describes.

But fixing the same bug twice always costs more, especially when it happens in production with real money moving through it.
