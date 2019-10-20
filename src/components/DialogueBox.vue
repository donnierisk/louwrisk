<template>
  <div>
    <p>{{ text}}</p>
    <button v-for="(option, i) in options" @click="$emit('chosen', option)" :key="i">{{option}}</button>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import DialogueOption from '@/models/DialogOption'

@Component
export default class DialogueBox extends Vue {
  @Prop() private text!: string
  @Prop() private options!: DialogueOption[]
}
</script>

<style scoped>
#container {
  border: 2px solid lightgrey;
  padding: 10px;
  border-radius: 20px;
}
</style>
