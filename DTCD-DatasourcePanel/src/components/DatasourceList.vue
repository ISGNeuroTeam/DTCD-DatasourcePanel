<template>
  <div class="datasource-list">
    <div class="header">
      <div>
        <!-- <select v-model="rowLimit" name="rowsSelect">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select> -->
      </div>
      <div class="right-block">
        {{ currentPage * rowLimit + 1 }} -
        {{ currentPage * rowLimit + datasourcesToShow.length }} из
        {{ Object.keys(datasources).length }}
        <span 
          @click="previousPage"
          :class="currentPage === 0 ? 'inactive-arrow' : 'active-arrow'"
          class="button-icon FontIcon name_chevronBigDown rotate_90 size_md"></span>
        <span 
          @click="nextPage"
          :class="currentPage === pageCount - 1 ? 'inactive-arrow' : 'active-arrow'"
          class="button-icon FontIcon name_chevronBigDown rotate_270 size_md"></span>

        <base-button size="small" @click="createDatasource">Создать</base-button>
      </div>
    </div>
    <div class="datasource-item" v-for="datasource in datasourcesToShow" :key="datasource">
      <div class="datasource-title">
        <StatusCircle :color="statusColors[datasources[datasource].status]" class="status-icon" />
        <div>{{ datasource }}</div>
      </div>

      <div class="button-block">
        <span 
          @click="editDatasource(datasource)"
          class="button-icon FontIcon name_edit size_md"></span>
        <span 
          @click="deleteDatasource(datasource)"
          class="button-icon FontIcon name_trashFull size_md"></span>
      </div>
    </div>
  </div>
</template>

<script>
import StatusCircle from '@/components/StatusCircle';
export default {
  name: 'PrimitivePropertiesPanel',
  components: { StatusCircle },
  props: {
    datasources: { type: Array, default: [] },
  },
  data({ $root }) {
    return {
      styleSystem: $root.styleSystem,
      currentPage: 0,
      rowLimit: 10,
      statusColors: {
        failed: '#FF3B30',
        success: '#4CD964',
        new: '#F8B407',
      },
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(Object.keys(this.datasources).length / this.rowLimit);
    },
    datasourcesToShow() {
      return Object.keys(this.datasources).slice(
        this.currentPage * this.rowLimit,
        (this.currentPage + 1) * this.rowLimit
      );
    },
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
    nextPage() {
      if (this.currentPage < this.pageCount - 1) this.currentPage++;
    },
    previousPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
  },
};
</script>

<style lang="scss" scoped>
.datasource-list {
  box-sizing: border-box;
  .button-icon {
    cursor: pointer;
  }

  .FontIcon {

    &.name_edit::before,
    &.name_trashFull::before {
      color: var(--title);
    }
  }
  .header {
    display: flex;
    padding: 5px 10px;

    justify-content: space-between;

    .right-block {
      display: flex;
      align-items: center;

      .active-arrow {
        color: var(--button_primary);
      }

      .inactive-arrow {
        color: var(--text_secondary);
      }
    }
  }

  .datasource-item {
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    box-shadow: inset 0px -1px 0px var(--border);

    &:hover {
      background-color: rgba(198, 198, 212, 0.24);
    }

    .datasource-title {
      display: flex;
      align-items: center;
      font-weight: 700;

      .status-icon {
        margin-right: 6px;
      }
    }
  }
}
</style>
