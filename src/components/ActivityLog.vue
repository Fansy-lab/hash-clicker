<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { events } = useGameState();
</script>

<template>
  <div class="activity-log">
    <h3>📋 Activity Log</h3>
    <div class="log-entries">
      <div v-for="(event, index) in events" :key="index" class="log-entry">
        {{ event }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-log {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 15px;
  margin-top: 20px;
  border: 1px solid #333;
}

.activity-log h3 {
  margin: 0 0 10px 0;
  font-size: 1em;
  color: #888;
}

.log-entries {
  max-height: 120px;
  overflow-y: auto;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid #222;
  font-size: 0.85em;
  color: #aaa;
}

.log-entry:last-child {
  border-bottom: none;
}
</style>
