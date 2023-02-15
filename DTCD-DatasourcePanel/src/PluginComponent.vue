<template>
  <div style="height: 100%" class="panel-wrapper">
    <DatasourceList
      v-if="!$root.editMode"
      :datasources="datasources"
      @runDataSource="runDataSource"
      @createDatasource="openDSForm"
      @editDatasource="editDatasource"
      @deleteDatasource="deleteDatasource"
    />
    <DatasourceForm
      v-else
      :datasource="tempDatasource"
      :datasourceName="$root.nameEditableDatasource"
      :dataSourceTypesList="dataSourceTypesList"
      @saveDatasource="saveDatasource"
      @leaveEditMode="leaveEditMode"
    />
  </div>
</template>

<script>
import DatasourceList from '@/components/DatasourceList';
import DatasourceForm from '@/components/DatasourceForm';

export default {
  name: 'PluginComponent',
  components: { DatasourceList, DatasourceForm },
  data({ $root }) {
    return {
      guid: $root.guid,
      logSystem: $root.logSystem,
      eventSystem: $root.eventSystem,
      datasourceSystem: $root.datasourceSystem,
      datasources: {},
      config: {
        autorun: false,
        runOnTokenChange: false,
      },
      tempDatasource: {},
    };
  },
  computed: {
    dataSourceTypesList() {
      const dataSourceTypesList = this.datasourceSystem.dataSourceTypes
      if (
        dataSourceTypesList instanceof Array
        && dataSourceTypesList.length > 0
      ) {
        return dataSourceTypesList.map((type) => type.toLowerCase())
      }
        return this.dataSourceTypesList = ['otl'];
    }
  },
  mounted() {
    this.datasources = this.datasourceSystem.getDataSourceList();
    this.logSystem.debug(`Loading datasources to panel: ${JSON.stringify(this.datasources)}`);
    if (this.$root.isModal) {
      this.logSystem.debug(`Opening panel in modal mode`);
      this.$root.editMode = true;
    }
  },

  methods: {
    editDatasource(datasource) {
      this.tempDatasource = {
        ...this.datasources[datasource].datasourceParams,
        type: this.datasources[datasource].type
      };

      this.logSystem.debug(
        `Editing datasource '${datasource}': ${JSON.stringify(this.tempDatasource)}`
      );
      this.$root.nameEditableDatasource = datasource;
      this.openDSForm();
    },
    openDSForm() {
      this.logSystem.debug(`Switching to editMode`);
      this.$root.editMode = true;
    },
    leaveEditMode() {
      this.logSystem.debug(`Switching to view mode`);
      this.$root.editMode = false;
      this.$root.nameEditableDatasource = '';
      this.tempDatasource = {};
    },
    saveDatasource(datasourceObject) {
      const { name, type } = datasourceObject;
      delete datasourceObject.name;
      delete datasourceObject.type;
      if (name) {
        this.logSystem.debug(
          `Creating new datasource '${name}' with params: ${JSON.stringify(datasourceObject)}`
        );
        this.datasourceSystem.createDataSource(name, type, datasourceObject);
      } else {
        this.logSystem.debug(
          `Saving existing datasource '${
            this.$root.nameEditableDatasource
          }' with new params: ${JSON.stringify(datasourceObject)}`
        );
        this.datasourceSystem.editDataSource(this.$root.nameEditableDatasource, datasourceObject);
      }
      this.datasources = Object.assign({}, this.datasourceSystem.getDataSourceList());
    },
    deleteDatasource(datasource) {
      this.logSystem.debug(`Deleting datasource: '${datasource}'`);
      this.datasourceSystem.removeDataSource(datasource);
      this.datasources = Object.assign({}, this.datasourceSystem.getDataSourceList());
    },
    runDataSource(name) {
      this.datasourceSystem.runDataSource(name);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-wrapper {
  background-color: var(--background_main);
  color: var(--text_main);
}
</style>
