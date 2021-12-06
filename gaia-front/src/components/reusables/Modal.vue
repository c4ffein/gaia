<template lang="pug">
transition(name="modal")
  .modal-mask.fixed.w-full.h-full(@click="$emit('close')")
    .modal-wrapper(:class="unlimited ? 'unlimited' : 'limited'" @click="$emit('close')")
      .flex.f-jc-center.f-ai-center.h-full(@click="$emit('close')")
        .modal-container.relative.bg-white(:class="unlimited ? 'unlimited' : 'limited'" @click.stop)
          //-.modal-close-button(v-if="!closable")
          slot
</template>

<script>
export default {
  name: 'Modal',

  props: { closable: Boolean, unlimited: Boolean },
}
</script>


<style lang="scss">

.modal-close-button {
  height: 26px; width: 26px; position: absolute; right: 13px; top: 13px;
  color: $grey-color; transition: 0.3s; cursor: pointer;
}
.modal-close-button:hover { color: black; }
.modal-close-button:after{ display: inline-block; font-size: 47px; position: absolute; top: -13px; content: "\00d7"; }

.error-square {
  background-color: #ff00001a; color: red;
  padding: 10px; border: 2px solid #ff00002b; white-space: pre-wrap;
}


.modal-mask { z-index: 9998; top: 0; left: 0; bottom: 0; right: 0; overflow: hidden; background-color: rgba(0, 0, 0, 0.5); transition: opacity 0.3s ease; }

.modal-wrapper { overflow: auto; max-height: 100%; }

.modal-container {
  padding: 20px 30px; border-radius: 2px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-container.limited { width: 500px; margin: 0px auto; margin-top: 160px; }
.modal-container.unlimited { margin: 50px; }


.modal-header { font-weight: bold; font-size: 18px; color: $primary-color; margin-bottom: 20px; }
.modal-header.error { color: $error-color; }
.modal-body { margin: 20px 0; }
.modal-info { margin-top: 20px; }
.modal-default-button { float: right; }
.modal-enter { opacity: 0; }
.modal-leave-active { opacity: 0; }
.modal-enter .modal-container,
.modal-leave-active .modal-container { -webkit-transform: scale(1.1); transform: scale(1.1); }

</style>
