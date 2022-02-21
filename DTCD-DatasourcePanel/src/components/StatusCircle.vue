<template>
  <div class="circle" :style="{ backgroundColor: color }"></div>
</template>

<script>
export default {
  name: 'StatusCircle',
  props: {
    color: String,
  },
};
</script>

<style lang="scss" scoped>
.circle {
  border-radius: 50%;
  width: 10px;
  height: 10px;
}
</style>
