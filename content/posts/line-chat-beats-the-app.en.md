---
title: "The button in the chat beat the button in the app"
date: "2026-09-20"
summary: "The institute owner didn't want a shortcut into the app. He wanted the whole thing answerable in the chat — and that changed how I designed the feature."
tags: ["IQ Tutor", "LINE", "product"]
---

My first attempt at "request leave" was a button on the LINE rich menu. Tapping it deep-linked into the LIFF app, scrolled to the nearest session still eligible for a leave request, and highlighted it. I thought this was a good answer: no new screens, pure reuse of what already existed.

The institute owner tried it and said no.

His reasoning was blunt and correct. A parent is already in a chat. Tapping a button that throws them out into an app, waits for a load, then asks for two more taps is leaving the conversation. What he wanted was for "my kid can't come on Thursday" to be answerable in the same place they were already typing.

## What changed

I moved the whole flow into the chat using postback buttons — a pattern this project already used for accepting or declining substitute-tutor offers and for confirming makeup-class times. Nothing new was invented; existing machinery was pointed at a new job.

The flow is now:

1. Tap "request leave" on the rich menu → a carousel of eligible upcoming sessions, soonest first (a parent with several children sees all of them merged)
2. Tap the session
3. A tutor submits immediately; a parent picks a canned reason — sick / personal matter / can't travel
4. Done

## What I deliberately did not build

I did not build free-text reason capture in the chat. LINE template messages cannot collect free text, so supporting it would have meant inventing a whole "pending conversation state" layer that this project does not have.

The escape hatch is a "type your own reason" button that falls back to the existing LIFF form. People who want to write a paragraph still can. Everyone else is done in three taps — and I added zero new tables.

## The part worth keeping

What I nearly got wrong was the translation. The owner said "make requesting leave easier." I read that as "add a shortcut to the existing screen." He meant "don't make them leave the chat."

Since then, when I get a request I ask what the user is doing *right now* before I ask where the button should go.

One more thing fell out of the rewrite. The old postback dispatcher treated any unrecognised action as a substitute-offer response — a bug waiting for its moment. It's a real lookup table now. Tearing out old code usually finds one of these.
