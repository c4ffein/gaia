<template lang="pug">
Modal( v-if="show" @close="$emit('close')" )
  .t-primary.t-30.t-bold Formattage
  h1 # Titre
  h2 ## Sous-Titre
  h3 ### Sous-sous-titre
  em.block *italique*
  br
  strong.block **gras**
  br
  em.block
    strong ***gras-italique***
  ul
    li - liste

</template>

<script>
import Modal from './Modal'

export default {
  name: 'ModalFormat',
  components: { Modal },
  props: { show: Boolean, closable: Boolean },
}
</script>
