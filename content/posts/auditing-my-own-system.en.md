---
title: "I audited my own system and found eleven bugs"
date: "2026-09-27"
summary: "Not by running tests — by reading every line of my own backend as if a stranger wrote it, and writing down everything that looked off."
tags: ["IQ Tutor", "testing", "documentation"]
---

The institute owner asked a question that turned out to be much harder than it sounds: "is the system actually working correctly?"

Tests were green. Production was up. But he wasn't asking whether anything threw an exception. He was asking whether the rules in his head and the rules in the code were the same rules.

Tests can't answer that. A test confirms the code does what I thought it should do. It does not confirm that what I thought was right.

## The method

I read every backend route, lib file and middleware, one at a time, and wrote down in the handbook what each feature *actually* decides — not what it is supposed to decide.

When something looked wrong I didn't call it a bug. I built the case and ran it against a real test database to see whether it genuinely reproduced.

The result was eleven confirmed bugs I did not know about. The worst of them:

- **Parents could see and request leave on another child's session** when it fell in the same slot at a different start time
- **Group pay tiers were double-counted** when cloning a whole schedule, which means overpaying
- **An old makeup-confirmation card** could still confirm a newer proposal
- **Regenerating a week duplicated a session that had a substitute tutor**

Every one of them was about money or data access. None of them crashed anything — which is precisely why they survived so long.

## The half that wasn't bugs

Alongside the bugs I came out with seven questions that were not technical at all. They were business decisions nobody had ever made explicitly. For example:

- If a student is absent and has no class package, do they get billed?
- What does a tutor earn for a one-on-one makeup class?

The code had to pick something, so it had already picked — silently. I pulled those out as questions, got real answers from the owner, wrote the answers back into the code, and added tests that pin each answer in place.

## What followed

All eleven bugs were fixed the same day with regression tests running against a real database. All seven questions were answered and implemented. The audit document is still in the repository with a status table for every item.

The user handbook became a 38-page GitBook with a dedicated "Logic" section describing how each feature really decides things — read from the code, not from memory.

## The lesson

Green tests don't mean the system is correct. They mean the system matches what you once believed. Reading your own code as a stranger and writing down what it actually does is the only thing I've found that catches the gap between the two.

If your system touches money, I'd do this at least once a year.
