# Next Learning publishing protocol

This repository uses **main as the release branch**. Finished work should be written to `main` directly; do not leave the user with a feature branch or pull request to merge.

## Lesson publishing

Reusable lessons live in `lessons/<lesson-id>.json`. The browser reads `lessons/catalog.json` and merges published lessons into local/cloud learning state by stable lesson ID.

This gives ChatGPT/GitHub a simple delivery path:

1. Build the lesson from the current teaching conversation.
2. Give it a stable ID and expected date.
3. Add/update its JSON file.
4. Add/update its entry in `lessons/catalog.json`.
5. Push the release directly to `main`.
6. Next automatically discovers it on refresh/launch. No JSON copy/paste is required.

Progress is **not** stored in lesson files. Completion, reviews, notes and learning history remain learner state in the app/Firebase, so updating lesson content does not erase Sai's work.

## Lesson quality

A published lesson should contain:
- a clear conceptual objective;
- prerequisites where useful;
- explanation from first principles;
- active reconstruction rather than passive reading;
- transfer/change-one-thing exercises;
- 5–12 retrieval cards;
- an expected date and sensible estimated duration.

## Future direct API

The catalog is intentionally provider-neutral. A future authenticated endpoint can write the same lesson schema to Firestore/R2 without changing the learning UI. Repository publishing is the first direct channel because ChatGPT already has authorised GitHub access and it keeps an auditable source-of-truth history.
