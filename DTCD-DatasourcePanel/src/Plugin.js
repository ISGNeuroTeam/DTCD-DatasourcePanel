import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  PanelPlugin,
  LogSystemAdapter,
  EventSystemAdapter,
  DataSourceSystemAdapter,
  StyleSystemAdapter,
} from './../../DTCD-SDK/index';

export class Plugin extends PanelPlugin {
  static getRegistrationMeta() {
    return pluginMeta;
  }

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

    const datasourceSystem = new DataSourceSystemAdapter('0.2.0');
    logSystem.debug(`Create DataSourceSystemAdapter instance in ${pluginMeta.name} plugin`);

    this.styleSystem = new StyleSystemAdapter('0.4.0');

    const data = {
      guid,
      logSystem,
      eventSystem,
      datasourceSystem,
      isModal,
      styleSystem: this.styleSystem,
    };

    logSystem.debug(`Creating Vue instance in ${pluginMeta.name} plugin`);
    this.vue = new VueJS.default({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    eventSystem.subscribe(
      this.getGUID(this.styleSystem.instance),
      'ThemeUpdate',
      guid,
      'processThemeUpdateEvent'
    );

    this.styleSystem.setVariablesToElement(this.vue.$el, this.styleSystem.getCurrentTheme());

    logSystem.info(`End of instantiation of ${pluginMeta.name} plugin`);
  }

  processThemeUpdateEvent(eventData) {
    this.styleSystem.setVariablesToElement(this.vue.$el, this.styleSystem.getCurrentTheme());
  }
}
