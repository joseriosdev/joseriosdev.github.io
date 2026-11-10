---
name: resumes-lang-validation
description: Compares data/english.json (the source of truth) with data/spanish.json and translates the English resume content into Spanish, keeping technical terms in English. Use when the user says "translate", or asks to compare, sync, or translate the resume JSON files.
---

# Resume Language Validation ("translate")

`data/english.json` is the source of truth. `data/spanish.json` must be its faithful Spanish translation with the exact same structure. Never edit `data/english.json`.

## Workflow

```
Task Progress:
- [ ] 1. Run the structure check
- [ ] 2. Fix structure in spanish.json
- [ ] 3. Review and translate every translatable field
- [ ] 4. Run the structure check again until it prints OK
- [ ] 5. Report the changes
```

**1. Run the structure check** from the repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .cursor/skills/resumes-lang-validation/scripts/compare-keys.ps1
```

It reports:
- `MISSING`: a field exists in English but not in Spanish.
- `EXTRA`: a field exists in Spanish but not in English.
- `MUST MATCH`: a field that is copied verbatim differs from English.
- `UNTRANSLATED?`: a translatable field has the same text as English. Some are fine (`Frameworks`); decide each one.

**2. Fix structure.** Same keys, same key order, same array length and item order as `english.json`. Add missing fields, delete extra ones, and copy every `MUST MATCH` value from English. `"lang"` stays `"es"`.

**3. Translate.** Compare each translatable field with its English counterpart, even if the check passed: the English text may have changed. If the Spanish version is missing, outdated, adds claims, or drops content, rewrite it from the English text.

**4. Validate.** Run the check again. Only finish when it prints `OK`.

**5. Report** to the user, in Spanish:
- Fields changed in `spanish.json` (path and a one-line reason).
- Typos or grammar errors found in `english.json` (do not fix them; ask the user).
- `UNTRANSLATED?` fields kept on purpose.

## Fields

**Copy verbatim from English (never translate):**
- `basics.name`, `basics.title`, `basics.email`, `basics.phone`, `basics.location`, `basics.profiles`
- `basics.spoken_languages[].language`, `.proficiency`, and `.flag`
- `skills[].keywords`, `projects[].tech_stack`, every `url`
- `work[].company`, `work[].position`
- `education[].institution`, `education[].title`, `education[].type`

**Translate:** every other text field, such as `summary`, `highlights`, `description`, `category`, `level`, `location` inside `work`/`education`, `start_date`, `end_date`, and project `name` (keep brand names inside it: "Frontend Mentor Challenges" → "Desafíos de Frontend Mentor").

## Translation rules

- **Faithful, not creative.** Translate what the English says. Do not add claims ("Experto en..."), merge sentences, or drop details. ATS and recruiters compare both versions.
- **Keep technical terms in English, unchanged and in the same word order:** names of technologies, products, languages, and frameworks (.NET Framework, Salesforce, Apex, LWC, Aura, Visualforce, SQL Server, GraphQL, Web Components, CSS-in-JS), and the jargon Spanish-speaking developers use in English: REST APIs, EDI parsing, plugins, ERP, CRM, logging, onboarding, unit tests, workshops, frontend, full stack, stack, layouts, UI/UX, Agile.
- **Translate ordinary professional words** that have a standard Spanish term: architecture → arquitectura, performance → rendimiento, code coverage → cobertura de código, database → base de datos, design patterns → patrones de diseño, documentation → documentación.
- No Spanish glosses in parentheses next to an English term: "unit tests", not "pruebas unitarias (Unit Tests)".
- Neutral Latin American Spanish, first person. Highlights start with a past-tense verb in first person: "Diseñé", "Lideré", "Optimicé".
- Dates: Spanish month names, capitalized, no ordinals: "March 2021" → "Marzo 2021", "Nov. 3rd 2021" → "Nov. 3 2021", "Present" → "Presente".
- Fix the meaning, not the source: if the English has a typo ("sharpedn"), translate the intended word and report the typo.

## Examples

English: `Optimized SQL Server query performance to support high-volume transactions`
Spanish: `Optimicé el rendimiento de las consultas en SQL Server para soportar transacciones de alto volumen`

English: `I have built integrations that uses REST APIs, EDI parsing, and GraphQL APIs`
Spanish: `He construido integraciones que usan REST APIs, EDI parsing y GraphQL APIs`
(report "uses" → "use" as an English grammar error)

English: `Produced onboarding materials and trained new employees`
Spanish: `Elaboré materiales de onboarding y capacité a nuevos empleados`
