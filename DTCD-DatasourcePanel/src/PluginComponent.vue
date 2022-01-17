<template>
  <div style="height: 100%">
    <DatasourceList
      v-if="!editMode"
      :datasources="datasources"
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
      editMode: false,
      tempDatasource: {},
      editableDatasource: '',
    };
  },
  mounted() {
    this.datasources = this.datasourceSystem.getDataSourceList();
    if (this.$root.isModal) {
      this.editMode = true;
    }
  },
  methods: {
    editDatasource(datasource) {
      this.tempDatasource = {
        ...this.datasources[datasource].datasourceParams,
      };
      this.editableDatasource = datasource;
      this.editMode = true;
    },
    createDatasource() {
      this.editMode = true;
    },
    leaveEditMode() {
      this.editMode = false;
      this.editableDatasource = '';
      this.tempDatasource = {};
    },
    saveDatasource(datasourceObject) {
      if (datasourceObject.name) {
        this.datasourceSystem.createDataSource(datasourceObject);
      } else this.datasourceSystem.editDataSource(this.editableDatasource, datasourceObject);
      this.datasources = Object.assign({}, this.datasourceSystem.getDataSourceList());
    },
    deleteDatasource(datasource) {
      this.logSystem.info(`Deleting datasource: '${datasource}'`);
      this.datasourceSystem.removeDataSource(datasource);
      this.datasources = Object.assign({}, this.datasourceSystem.getDataSourceList());
    },
  },
};
</script>
