<template>
  <span
    class="StatusCircle"
    :class="{
      'theme_alfa': type === 'failed',
      'theme_bravo': type === 'new',
      'theme_charlie': type === 'success',
    }"
  ></span>
</template>

<script>
export default {
  name: 'StatusCircle',
  props: {
    type: String,
  },
};
</script>

<style lang="scss" scoped>
.StatusCircle {
  display: inline-block;
  border-radius: 50%;
  width: 10px;
  height: 10px;

  &.theme_alfa {
    background-color: var(--danger);
  }
  &.theme_bravo {
    background-color: var(--warning);
  }
  &.theme_charlie {
    background-color: var(--success);
  }
}
</style>
