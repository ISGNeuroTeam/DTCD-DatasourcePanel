<template>
  <div>
    <button @click="createDatasource">Создать</button>
    <div class="datasource-item" v-for="datasource in Object.keys(datasources)" :key="datasource">
      <div>{{ datasource }} ({{ datasources[datasource].status }})</div>
      <div class="button-block">
        <svg
          class="button-icon"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="editDatasource(datasource)"
        >
          <path
            d="M3.49941 16.2916C3.27733 16.2913 3.06563 16.1976 2.91595 16.0336C2.76351 15.8708 2.68776 15.6508 2.70774 15.4287L2.9017 13.296L11.8618 4.33906L14.6619 7.13839L5.7042 16.0945L3.57145 16.2885C3.54691 16.2909 3.52236 16.2916 3.49941 16.2916ZM15.2208 6.57869L12.4215 3.77935L14.1006 2.10023C14.2491 1.95157 14.4506 1.86804 14.6607 1.86804C14.8708 1.86804 15.0723 1.95157 15.2208 2.10023L16.8999 3.77935C17.0486 3.92784 17.1321 4.12934 17.1321 4.33946C17.1321 4.54957 17.0486 4.75107 16.8999 4.89956L15.2216 6.57789L15.2208 6.57869Z"
            fill="#000"
          />
        </svg>
        <svg
          class="button-icon"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="deleteDatasource(datasource)"
        >
          <path
            d="M12.75 16.5H5.25C4.42157 16.5 3.75 15.8284 3.75 15V5.25H2.25V3.75H5.25V3C5.25 2.17157 5.92157 1.5 6.75 1.5H11.25C12.0784 1.5 12.75 2.17157 12.75 3V3.75H15.75V5.25H14.25V15C14.25 15.8284 13.5784 16.5 12.75 16.5ZM5.25 5.25V15H12.75V5.25H5.25ZM6.75 3V3.75H11.25V3H6.75ZM11.25 13.5H9.75V6.75H11.25V13.5ZM8.25 13.5H6.75V6.75H8.25V13.5Z"
            fill="#000"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrimitivePropertiesPanel',
  props: {
    datasources: Array,
  },
  methods: {
    editDatasource(datasource) {
      this.$emit('editDatasource', datasource);
    },
    createDatasource() {
      this.$emit('createDatasource');
    },
    deleteDatasource(datasource) {
      this.$emit('deleteDatasource', datasource);
    },
  },
};
</script>

<style lang="scss" scoped>
.datasource-item {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: rgba(198, 198, 212, 0.24);
  }
}

.button-icon {
  cursor: pointer;
}
</style>
