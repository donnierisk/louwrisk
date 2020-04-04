<template>
  <div></div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'

@Component
export default class ActionGraph extends Vue {
  @Prop() private entity?: Entity
}
</script>