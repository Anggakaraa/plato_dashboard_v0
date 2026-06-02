# ChatGPT Context Mirror Workflow

This workflow keeps the ChatGPT project-source document and the Google Doc mirror aligned.

## Canonical Files

Local source:

```text
docs/chatgpt-context.md
```

Google Doc mirror:

```text
https://docs.google.com/document/d/1tPsDE2zLgjiDUyt3URhZByfvG6oDded8EzeZa2xQOE0/edit?tab=t.0
```

## When To Refresh

Refresh the mirror after:

- major feature changes
- new backend or database discoveries
- new product/PM direction
- branch strategy changes
- design-system decisions
- significant UX flow changes
- any discovery that would help ChatGPT give better strategic advice

Codex should remind Torbjorn to refresh this mirror after meaningful changes.

## Refresh Steps For Codex

1. Read the current repo docs and relevant code:

```text
CLAUDE.md or branch-equivalent instructions when present
HANDOVER.md when present
docs/chatgpt-context.md
docs/context-mirror-workflow.md
src/mocks/handlers.js
src/mocks/data.js
package.json
recent git commits relevant to the change
```

2. Update `docs/chatgpt-context.md` with:

- new product decisions
- changed branch state
- new architecture or endpoint facts
- important implementation constraints
- revised prompts ChatGPT should suggest for Codex

3. Mirror the full updated `docs/chatgpt-context.md` to the Google Doc using the Google Drive/Docs connector.

4. Verify the Google Doc through connector readback.

5. If local docs changed, commit them with a clear message such as:

```bash
git add docs/chatgpt-context.md docs/context-mirror-workflow.md
git commit -m "docs: refresh ChatGPT dashboard context"
git push
```

## Important Collaboration Rule

ChatGPT should help the user write good prompts for Codex.

When Codex presents a plan, the user interface does not support "approve with notes." The user can either:

- approve and execute the plan as written, or
- ask Codex to regenerate the plan with notes

Therefore ChatGPT should not suggest approval prompts like "approve the plan, but also change X." Instead it should suggest:

```text
Ask Codex to regenerate the plan with these notes: ...
```

or:

```text
Approve the plan as-is.
```

