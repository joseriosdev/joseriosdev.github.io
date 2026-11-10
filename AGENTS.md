# Project Context & AI Agent Rules

## Project Overview
This repository contains a static web site that serves a CV for **https://github.com/joseriosdev** built with basic tech stack _(HTML, CSS & JS)_ but long term custom web components that comes from native JS class `HTMLElement`, styled with **CSS**, and using **JSON** files to store the static data in Spanish and English languages.

It is optimized for **[Applicant Tracking Systems](https://en.wikipedia.org/wiki/Applicant_tracking_system "a.k.a ATS")** _(ATS)_. Inspired in the need to have a Dev CV/Resume in a simple and sophisticated way.

> Built using Vanilla JS Web Components to avoid any type of dependency.

### Scope of features for the app:
- ATS Optimized Resume version
- Spanish and English versions
- Saving as PDF
- Pretty Resume version
- Daily Bible Verse
- Custom greedings and curious facts
- Matching Pairs (hidden) game

## Tech Stack & Architecture
- **Framework:** HTML, CSS and JavaScript.
- **Database:** none.
- **State Management:** Minimun.

## Directory Structure
- `docs/` - Contains all routing, page components, and API routes. Even the index.
- `data/` - Json files that holds the data of the CVs in both Spanish and English.
- `public/` - All media files like audios and images.

### Language
- Spanish and English only.
- Store the active language on the instance (`this.isSpanish`) and in `localStorage` under `KEYS.CURRENT_LANG`.
- Put both languages in the markup as `label-lang-es` / `label-lang-en` and `content-lang-es` / `content-lang-en` when the control itself switches language.

## Agent Boundaries & Constraints
- **File Locking:** Never delete or alter files inside `.github/workflows/`.
- **Dependency Tracking:** Do not add third-party npm packages without asking for user confirmation first.

## Other Rules:
- For specific coding standards and guidelines, read the rule file at `.cursor/rules/coding-standards.mdc`.
- For how the site works (routing, components, data model, themes, print), read `ARCHITECTURE.md`. Keep it updated when that behavior changes.
