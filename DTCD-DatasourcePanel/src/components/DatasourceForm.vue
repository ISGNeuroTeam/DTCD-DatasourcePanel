<template>
  <div class="datasource-form">
    <div>
      <div class="modal-header">
        <span 
          :style="{ marginRight: '6px' }"
          @click="leaveEditMode"
          class="button-icon FontIcon name_chevronBigDown rotate_90 size_md"
        ></span>
        {{ datasourceName ? 'Редактирование' : 'Создание' }} источника данных
      </div>
      <div class="modal-body">
        <div class="form-field">
          <base-input
            v-if="!datasourceName"
            label="Название"
            type="text"
            placeholder="Введите название"
            :value="dsFormData.name"
            @input="dsFormData.name = $event.target.value"
          ></base-input>
          <base-input
            v-else
            label="Название"
            type="text"
            :value="datasourceName"
            disabled
          ></base-input>
        </div>
        <div class="form-field">
          <base-input
            label="TTL"
            type="number"
            placeholder="Введите значение ttl"
            ref="ttl"
            :value="dsFormData.cache_ttl"
            @input="(event) => {
              this.dsFormData.cache_ttl = event.target.value
                                        ? Number.parseInt(event.target.value)
                                        : 0;
            }"
          ></base-input>
        </div>
        <div class="form-field">
          <base-select
            :disabled="!!datasourceName"
            label="Тип запроса"
            @input="setType"
            :value="dsFormData.type"
          >
            <div
              v-for="item in dataSourceTypesList"
              :key="item"
              slot="item"
              :value="item"
            >
              {{ item }}
            </div>
          </base-select>
        </div>

        <div class="form-field">
          <base-code-editor
            :label="dsFormData.type ===  'otlrw' ? 'Запрос для чтения данных' : 'Запрос'"
            rows="4"
            data-autoheight
            data-language-mode="otl"
            :value="dsFormData.queryString"
            @change="dsFormData.queryString = $event.target.value"
          >
            <!-- Deprecated -->
            <base-textarea
              :label="dsFormData.type ===  'otlrw' ? 'Запрос для чтения данных' : 'Запрос'"
              placeholder="Введите запрос"
              ref="query"
              :value="dsFormData.queryString"
              @input="(event) => {this.dsFormData.queryString = event.target.value}"
              @keydown.ctrl.\="addLineBreaks"
            ></base-textarea>
          </base-code-editor>
        </div>

        <div
          v-if="dsFormData.type ===  'otlrw'"
          class="form-field"
        >
          <base-code-editor
            label="Запрос для записи данных"
            rows="4"
            data-autoheight
            data-language-mode="otl"
            :value="dsFormData.queryWriteString"
            @change="dsFormData.queryWriteString = $event.target.value"
          >
            <!-- Deprecated -->
            <base-textarea
              label="Запрос для записи данных"
              placeholder="Введите запрос"
              :value="dsFormData.queryWriteString"
              @input="dsFormData.queryWriteString = $event.target.value"
            ></base-textarea>
          </base-code-editor>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <base-button @click="save"> {{ datasourceName ? 'Сохранить' : 'Создать' }}</base-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatasourceForm',
  props: {
    datasource: Object,
    datasourceName: String,

    dataSourceTypesList: {
      type: Array,
      required: true,
    }
  },
  data() {
    if (this.datasource instanceof Object) Object.assign(this.$root.dsFormData, this.datasource);

    return {
      dsFormData: this.$root.dsFormData,
    };
  },
  methods: {
    leaveEditMode() {
      this.$emit('leaveEditMode');
      this.resetForm();
    },
    save() {
      if (!this.datasourceName && !this.dsFormData.name) return;
      if (this.dsFormData.cache_ttl < 1) return;
      if (!this.dsFormData.queryString) return;

      this.dsFormData.name.trim();
      this.dsFormData.queryString.trim();
      this.dsFormData.queryWriteString && this.dsFormData.queryWriteString.trim();

      this.$emit('saveDatasource', this.dsFormData);
      this.leaveEditMode();
    },
    resetForm() {
      this.$root.dsFormData = {
        name: '',
        queryString: '',
        queryWriteString: '',
        cache_ttl: 60,
        type: 'otl',
      };
    },
    setType(e) {
      this.dsFormData.type = e.target.value;
    },

    // Deprecated
    addLineBreaks () {
      this.dsFormData.queryString = this.dsFormData.queryString.replaceAll('|','\n|');

      if (this.dsFormData.queryString[0] == '\n') {
        this.dsFormData.queryString = this.dsFormData.queryString.substring(1);
      };

      this.dsFormData.queryString = this.dsFormData.queryString.replaceAll('\n\n|','\n|');
      this.dsFormData.queryString = this.dsFormData.queryString.replaceAll('|\n','| ');
      this.dsFormData.queryString = this.dsFormData.queryString.replaceAll('| \n','| ');
    },
  },
};
</script>

<style lang="scss" scoped>
.datasource-form {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modal-header,
.modal-footer {
  padding: 10px;
  display: flex;
  box-sizing: border-box;
}

.modal-header {
  position: relative;
  align-items: center;
  font-size: 17px;
  font-weight: 700;
  line-height: 22px;
}

.modal-footer {
  width: 100%;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 10px;
}

.footer-btn {
  padding: 5px;
  width: 80px;
  margin: 2px 5px;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.input {
  padding: 0.5rem;
  border: 1px solid var(--border);
  width: 200px;
}
.label-wrapper {
  padding: 0.2rem;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
}
.form-field {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.button-icon {
  cursor: pointer;
  border-radius: 50%;
  margin-right: 10px;

  &:hover {
    background-color: var(--border_secondary);
  }
}
</style>
