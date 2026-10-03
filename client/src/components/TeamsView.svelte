<script lang="ts">
  import type { ProcessedDetails, KillVM } from '../lib/details';
  import { jumpToTick } from '../lib/nav';
  import TeamCard from './TeamCard.svelte';

  export let data: ProcessedDetails;

  function handleJump(e: CustomEvent<KillVM>) {
    jumpToTick(e.detail.tick);
  }
</script>

<div class="teams">
  <TeamCard team={data.radiant} on:jump={handleJump} />
  <TeamCard team={data.dire} on:jump={handleJump} />
</div>

<style>
  .teams {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 18px 28px 28px;
  }
</style>
