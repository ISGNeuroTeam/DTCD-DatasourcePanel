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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="previousPage"
          class="button-icon"
        >
          <path
            d="M15.5358 3.51514L7.05078 12.0001L15.5358 20.4851L16.9508 19.0711L9.87878 12.0001L16.9508 4.92914L15.5358 3.51514Z"
            :class="currentPage === 0 ? 'inactive-arrow' : 'active-arrow'"
          />
        </svg>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="nextPage"
          class="button-icon"
        >
          <path
            d="M8.46422 20.4849L16.9492 11.9999L8.46422 3.51486L7.04922 4.92886L14.1212 11.9999L7.04922 19.0709L8.46422 20.4849Z"
            :class="currentPage === pageCount - 1 ? 'inactive-arrow' : 'active-arrow'"
          />
        </svg>

        <base-button size="small" @click="createDatasource">Создать</base-button>
      </div>
    </div>
    <div class="datasource-item" v-for="datasource in datasourcesToShow" :key="datasource">
      <div class="datasource-title">
        <StatusCircle :color="statusColors[datasources[datasource].status]" class="status-icon" />
        <div>{{ datasource }}</div>
      </div>

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
            fill="var(--title)"
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
            fill="var(--title)"
          />
        </svg>
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
  mounted() {
    console.log(this.styleSystem);
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

  .header {
    display: flex;
    padding: 5px 10px;

    justify-content: space-between;

    .right-block {
      display: flex;
      align-items: center;

      .active-arrow {
        fill: var(--button_primary);
      }

      .inactive-arrow {
        fill: var(--text_secondary);
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

      .status-icon {
        margin-right: 6px;
      }
    }
  }
}
</style>
