<template></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class KeyboardEvents extends Vue {
  private created() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.$emit('key-event', e.code)
    })
  }
}
</script>