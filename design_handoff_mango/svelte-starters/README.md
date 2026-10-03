# Svelte Starters

Drop-in component scaffolds that match the prototype. They use Svelte 3 + TypeScript and the design tokens from `../source/hifi-tokens.css`.

Recommended copy order:
1. `stores/persisted.ts`, `stores/theme.ts`, `stores/density.ts`, `stores/sortBy.ts`
2. `lib/heroAssets.ts` (extend the existing `util.ts`)
3. `components/HeroIcon.svelte`, `ItemIcon.svelte`, `AbilityIcon.svelte`
4. `components/Pill.svelte`, `Caret.svelte`, `NetWorthBar.svelte`, `KpBar.svelte`
5. `components/KillChip.svelte`, `KillStrip.svelte`
6. `components/MatchCard.svelte`, `MatchRow.svelte`
7. `components/Header.svelte`, `ThemeToggle.svelte`, `ProfileChip.svelte`
8. `components/MatchDetails.svelte` (+ tabs + KillLog)
9. `components/EmptyState.svelte`, `LoadingState.svelte`

The longer screens (KillLog, PlayerRow, etc.) are sketched as TODO outlines — the layout/CSS spec is in the README; this folder gives you the import map and the harder atoms.
