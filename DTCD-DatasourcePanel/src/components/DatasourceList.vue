<template>
  <div class="datasource-list">
    <div class="header">
      <div>
        <!-- <select v-model="rowLimit" name="rowsSelect">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select> -->
        <span
            @click="runAllDataSource()"
            class="button-icon FontIcon name_repeat size_md"
        />
      </div>
      <div class="right-block">
        {{ currentPage * rowLimit + 1 }} -
        {{ currentPage * rowLimit + datasourcesToShow.length }} из
        {{ Object.keys(datasources).length }}
        <span 
          @click="previousPage"
          :class="currentPage === 0 ? 'inactive-arrow' : 'active-arrow'"
          class="button-icon FontIcon name_chevronBigDown rotate_90 size_md"
        />
        <span 
          @click="nextPage"
          :class="currentPage === pageCount - 1 ? 'inactive-arrow' : 'active-arrow'"
          class="button-icon FontIcon name_chevronBigDown rotate_270 size_md"
        />

        <base-button size="small" @click="createDatasource">Создать</base-button>
      </div>
    </div>
    <div
        v-for="datasource in datasourcesToShow"
        :key="datasource"
        class="datasource-item"
    >
      <div class="datasource-title">
        <StatusCircle :type="datasources[datasource].status"/>
        <div>
          {{ datasource }}
        </div>
      </div>

      <div class="button-block">
        <span 
          @click="runDataSource(datasource)"
          class="button-icon FontIcon name_playArrow size_md"
        />
        <span
          @click="editDatasource(datasource)"
          class="button-icon FontIcon name_edit size_md"
        />
        <span 
          @click="deleteDatasource(datasource)"
          class="button-icon FontIcon name_trashFull size_md"
        />
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
  data() {
    return {
      currentPage: 0,
      rowLimit: 10,
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
    runDataSource(datasource) {
      this.$emit('runDataSource', datasource)
    },
    runAllDataSource() {
      this.datasourcesToShow.forEach((dataSource) => {
        this.runDataSource(dataSource);
      });
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
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;

    justify-content: space-between;

    .right-block {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;

      .active-arrow {
        color: var(--button_primary);
      }

      .inactive-arrow {
        color: var(--text_secondary);
      }
    }
  }

  .datasource-item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    column-gap: 10px;
    padding: 5px 10px;
    box-shadow: inset 0px -1px 0px var(--border);

    &:hover {
      background-color: rgba(198, 198, 212, 0.24);
    }

    .datasource-title {
      display: flex;
      gap: 6px;
      align-items: center;
      font-weight: 700;
    }

    .button-block {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}
</style>
