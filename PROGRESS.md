# Speaking Warm-up Modernization Progress

## ✅ Step 1 – Convert warm-up configs
- [x] Confirm all files under `src/content/speaking/daily-warmups/` now use the `soloMode` + `speakingMode` schema.
- [x] Remove legacy `soloSteps`/`speakingSteps`/`soloHelp` blocks and update descriptions to focus on the grammar target.
- [x] Ensure each configuration still contains the same key phrases, prompts, and vocabulary for continuity.

## ⚙️ Step 2 – Refactor `SpeakingActivityRenderer`
- [x] Update the layout to render the Solo Mode card, Speaking Mode card, and existing prompt cards in the new two-phase flow.
- [x] Add local storage persistence for solo inputs + checklist state scoped by `activityId` + `assignmentId`.
- [x] Implement the sticky submit bar that tracks prompts selected and checklist progress, enforcing the new validation rules.
- [x] Wire submit logic to `submitSpeakingWarmup`, update progress only after success, and prevent auto-complete on mount.
- [x] Show submission timestamp/status and handle resubmissions gracefully.

## ⚡ Step 3 – API & supporting layers
- [x] Verify `submitSpeakingWarmup` / `/api/speaking/submissions` handle the required payload, upsert logic, and status updates.
- [x] Ensure `saveActivityProgress` / `activityProgress` gradually move to “submitted” only after the warm-up is confirmed.
- [ ] (Optional) Provide any teacher-view access points or Supabase updates required for querying submissions.

## Notes
- Tests not run yet (UI changes coming in Step 2 & 3).
