<template>
  <div>
    <p>{{ text}}</p>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DialogueOption extends Vue {
  @Prop() private text!: string
  @Prop() private options!: [{ text: ''; id: number }]
}
</script>

<style scoped>
#container {
  border: 2px solid lightgrey;
  padding: 10px;
  border-radius: 20px;
}
</style>
