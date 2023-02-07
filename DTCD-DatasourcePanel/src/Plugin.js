import {
  PanelPlugin,
  LogSystemAdapter,
  EventSystemAdapter,
  DataSourceSystemAdapter,
  StyleSystemAdapter,
} from './../../DTCD-SDK/index';

import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

export class Plugin extends PanelPlugin {
  static getRegistrationMeta() {
    return pluginMeta;
  }
  #config = {
    // autorun: true,
    // runOnTokenChange: false,
  };

  #datasourceAdapter;

  #vueComponent;

  constructor(guid, selector, isModal) {
    super();

    const logSystem = new LogSystemAdapter('0.5.0', guid, pluginMeta.name);
    logSystem.info(`Start instantiation of ${pluginMeta.name} plugin`);
    logSystem.debug(`Create LogSystemAdapter instance in ${pluginMeta.name} plugin`);

    const VueJS = this.getDependence('Vue');
    logSystem.debug(`Get Vue dependence in ${pluginMeta.name} plugin`);

    const eventSystem = new EventSystemAdapter('0.4.0', guid);
    logSystem.debug(`Create EventSystemAdapter instance in ${pluginMeta.name} plugin`);
    eventSystem.registerPluginInstance(this, []);

    this.#datasourceAdapter = new DataSourceSystemAdapter('0.2.0');
    logSystem.debug(`Create DataSourceSystemAdapter instance in ${pluginMeta.name} plugin`);

    this.#config.autorun = {
      get: () => this.#datasourceAdapter.autorun,
      set: (value) => {
        this.#datasourceAdapter.autorun = value;
      },
    };

    this.#config.runOnTokenChange = {
      get: () => this.#datasourceAdapter.runOnTokenChange,
      set: (value) => {
        this.#datasourceAdapter.runOnTokenChange = value;
      }
    };

    this.styleSystem = new StyleSystemAdapter('0.4.0');

    const data = {
      guid,
      logSystem,
      eventSystem,
      datasourceSystem: this.#datasourceAdapter,
      isModal,
      config: this.#config,
      styleSystem: this.styleSystem,

      editMode: false,
      dsFormData: {
        name: '',
        queryString: '',
        cache_ttl: 60,
        type: 'otl',
      },
      nameEditableDatasource: '',
    };

    logSystem.debug(`Creating Vue instance in ${pluginMeta.name} plugin`);
    this.#vueComponent = new VueJS.default({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    eventSystem.subscribe(
      this.getGUID(this.styleSystem.instance),
      'ThemeUpdate',
      guid,
      'processThemeUpdateEvent'
    );

    this.styleSystem.setVariablesToElement(this.#vueComponent.$el, this.styleSystem.getCurrentTheme());

    logSystem.info(`End of instantiation of ${pluginMeta.name} plugin`);
  }

  processThemeUpdateEvent(eventData) {
    this.styleSystem.setVariablesToElement(this.#vueComponent.$el, this.styleSystem.getCurrentTheme());
  }
  setPluginConfig(config = {}) {
    const configProps = Object.keys(this.#config);
    for (const [prop, value] of Object.entries(config)) {
      if (!configProps.includes(prop)) continue;
      this.#datasourceAdapter[prop] = value;
      this.#vueComponent.config[prop] = value;
    }
  }

  getPluginConfig() {
    const pluginConfig = {};
    Object.entries(this.#config).forEach(([key]) => {
      if (typeof this.#datasourceAdapter[key] !== 'undefined') {
        pluginConfig[key] = this.#datasourceAdapter[key];
      }
    });
    return pluginConfig;
  }

  setFormSettings(config) {
    this.setPluginConfig(config);
  }

  getFormSettings() {
    return {
      fields: [
        {
          component: 'title',
          propValue: 'Общие настройки',
        },
        {
          component: 'title',
          propValue: 'Настройки системы',
        },
        {
          component: 'switch',
          propName: 'autorun',
          attrs: {
            label: 'Запускать источники данных при загрузке дашборда',
          },
        },
        {
          component: 'switch',
          propName: 'runOnTokenChange',
          attrs: {
            label: 'Запускать источники данных при изменении токена',
          },
        },
      ],
    };
  }

  getState() {
    return {
      editMode: this.#vueComponent.editMode,
      dsFormData: this.#vueComponent.dsFormData,
      nameEditableDatasource: this.#vueComponent.nameEditableDatasource,
    };
  }

  setState(newState) {
    if (typeof newState !== 'object' ) return;

    const vueNamesFields = [
      'editMode',
      'dsFormData',
      'nameEditableDatasource',
    ];

    for (const [prop, value] of Object.entries(newState)) {
      if (!vueNamesFields.includes(prop)) continue;
      this.#vueComponent[prop] = value;
    }
  }
}
