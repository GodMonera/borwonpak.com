---
title: "Three students in a one-student class"
date: "2026-09-22"
summary: "A bug that wasn't in the code at all — it was in the data. And how I proved it hadn't happened anywhere else."
tags: ["IQ Tutor", "production", "data"]
---

The institute owner messaged me: a tutor's Saturday 9am one-on-one physics session was showing three students attended.

An individual session has a capacity of one. That number is not possible.

## My first hypothesis was wrong

Five days earlier I had fixed a roster-merging bug. My first thought was that it had come back.

I didn't guess. I went and looked at the live production data, and the earlier fix was working exactly as intended. This was something else entirely.

What actually happened: someone made a mistaken bulk check-in. Win (his real 9am slot — correct) was checked in alongside Mark and Don, whose real classes are at 12:00 and 16:30. All three were recorded against Win's session.

Then I found a second, stray session at 14:30 that nobody has a class in — not even Win — with the same three names attached. Created 0.3 seconds after the first one. Same mistaken batch.

## What I did, and the order I did it in

Before touching anything, I confirmed with the owner that this was a mis-click and not real attendance. If I deleted the wrong thing, I would be deleting the record that someone had actually been taught.

Then:

1. Removed the 5 incorrect attendance records, refunding each student's class package correctly
2. Deleted the stray 14:30 session
3. Ran a system-wide audit

Step 3 is the one that mattered. Fixing the thing you can see is easy. Proving there isn't more of it is the harder half. I swept every individual session in the system and confirmed that **zero** others had more than one student marked as attended.

An isolated incident, not a pattern.

## Disposable tooling

I fixed it by adding temporary one-off admin routes and deleting them the moment I was done — the same pattern I used when I had to resync every rich menu in the system.

The benefit is a tool shaped exactly to the job, running against real data inside a transaction, and no back door left standing in production afterwards.

## What I took away

**Confirm with a human before you mutate data.** Speed is worth nothing if you fix the wrong direction.

**A fix is not done until you've swept.** The question that matters more than "can I fix it" is "is it anywhere else" — and the answer should be a number, not a feeling.

**A bug that looks like an old bug usually isn't.** Had I trusted my first hypothesis and started tearing into code that was working correctly, I would have burned a day and possibly broken something that was fine.
