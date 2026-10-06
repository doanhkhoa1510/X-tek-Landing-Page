# Case studies

One Markdown file per client project and language: `src/content/cases/<locale>/<slug>.md` (English first; a language without its own file shows the English one). The slug is the URL: `/work/<slug>/`.

A case builds a page and a landing card only when **both** flags are `true`:
- `approved`: the owner (or the client) confirmed every fact below.
- `ndaChecked`: the client's NDA allows naming them and the project.

Front matter (all required; 150–250 words of body under it):

```yaml
client: Client name
title: One-line outcome, e.g. "A timetable the whole school trusts"
summary: One sentence for the card and the page head
problem: What was wrong before
built: What we built
stack: [TypeScript, Azure, …]
team: "6 engineers"
duration: "9 months, 2024–2025"
result: One concrete result: a number, a date, or a scope
approved: false
ndaChecked: false
```

Never invent a client, a number, or a quote (PRODUCT.md › Evidence on Hand).
