<template>
  <div id="dialogue">
    <div ref="text" class="text-area">
      <p v-for="(txt, i) in text" :key="i">- {{txt}}</p>
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

  private updated() {
    const elem = this.$refs.text as HTMLElement
    elem.scrollTop = elem.scrollHeight
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Cormorant+Infant&display=swap');

#dialogue {
  position: absolute;
  bottom: 0px;
  z-index: 1000;
  color: wheat;
  font-family: 'Cormorant Infant', serif;
  border: 1px solid lightgrey;
  padding: 10px 50px;
  width: 100vw;
  height: 30vh;
  background-color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  overflow: auto;
}

button {
  border: 1px solid #aad9ff;
  border-radius: 3px;
  display: block;
  text-align: left;
  padding: 10px 5px;
  border: 0;
  background: none;
  color: azure;
  font-family: 'Cormorant Infant', serif;
  font-size: 30px;
  cursor: pointer;
  padding: 0;
}

button:hover {
  text-decoration: underline;
}

button::-moz-focus-inner {
  border: 0;
}

.text-area {
  height: 50%;
  overflow-y: auto;
  text-align: left;
  margin-bottom: 20px;
}

.text-area p {
  margin: 5px 0;
  padding: 0;
}
</style>
