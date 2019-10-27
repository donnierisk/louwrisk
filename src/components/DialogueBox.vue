<template>
  <div id="dialogue">
    <div class="text-area">
      <p v-for="(txt, i) in text" :key="i">{{txt}}</p>
    </div>
    <button
      v-for="(option, i) in options"
      @click="$emit('on-action', option)"
      :key="i"
    >{{option.text}}</button>
  </div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import DialogueOption from '@/models/DialogOption'

@Component
export default class DialogueBox extends Vue {
  private textArray: string[] = []

  @Prop() private text!: string[]
  @Prop() private options!: DialogueOption[]
}
</script>

<style scoped>
#dialogue {
  border: 1px solid lightgrey;
  padding: 10px;
  border-radius: 3px;
  margin-top: 10px;
  width: 50vw;
  background: white;
}

button {
  border: 1px solid #aad9ff;
  border-radius: 3px;
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 5px;
}
button::-moz-focus-inner {
  border: 0;
}

.text-area {
  height: 30px;
  overflow-y: auto;
  background-color: azure;
}
</style>
