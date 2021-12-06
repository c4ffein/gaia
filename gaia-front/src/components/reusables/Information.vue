<template lang="pug">
div
  .modal-header(
    :class="error ? 'error' : ''" :style="`text-align: {align}; margin-bottom: 0; white-space: pre-wrap;`"
  ) {{ msg }}
  button.btn.w-full.mt-5(:class="error ? 'error' : 'primary'" @click="$emit('okClicked')") OK
</template>

<script>
export default {
  name: 'Information',

  props: { msg: String, align: { type: String, default: 'center' }, error: Boolean },
}
</script>
