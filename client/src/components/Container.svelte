<script>
  export let team;
</script>

<div class={`container ${team}`}>
  <slot></slot>
</div>

<style>
  .container {
    
    height: calc(100vh - 180px);
    overflow-y: auto;
    padding: 13px;
  }

  .radiant {
    box-shadow: 2px 2px 5px 2px green;
  }

  .dire {
    box-shadow: 2px 2px 5px 2px red;
  }
</style>
