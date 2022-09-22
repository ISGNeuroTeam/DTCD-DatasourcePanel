<template>
  <div style="height: 100%" class="panel-wrapper">
    <DatasourceList
      v-if="!editMode"
      :datasources="datasources"
      @runDataSource="runDataSource"
      @createDatasource="createDatasource"
      @editDatasource="editDatasource"
      @deleteDatasource="deleteDatasource"
    />
    <DatasourceForm
      v-else
      :datasource="tempDatasource"
      :datasourceName="editableDatasource"
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
      editMode: false,
      tempDatasource: {},
      editableDatasource: '',
    };
  },
  mounted() {
    this.datasources = this.datasourceSystem.getDataSourceList();
    this.logSystem.debug(`Loading datasources to panel: ${JSON.stringify(this.datasources)}`);
    if (this.$root.isModal) {
      this.logSystem.debug(`Opening panel in modal mode`);
      this.editMode = true;
    }
  },

  methods: {
    editDatasource(datasource) {
      this.tempDatasource = {
        ...this.datasources[datasource].datasourceParams,
      };
      this.logSystem.debug(
        `Editing datasource '${datasource}': ${JSON.stringify(this.tempDatasource)}`
      );
      this.editableDatasource = datasource;
      this.createDatasource();
    },
    createDatasource() {
      this.logSystem.debug(`Switching to editMode`);
      this.editMode = true;
    },
    leaveEditMode() {
      this.logSystem.debug(`Switching to view mode`);
      this.editMode = false;
      this.editableDatasource = '';
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
            this.editableDatasource
          }' with new params: ${JSON.stringify(datasourceObject)}`
        );
        this.datasourceSystem.editDataSource(this.editableDatasource, datasourceObject);
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
