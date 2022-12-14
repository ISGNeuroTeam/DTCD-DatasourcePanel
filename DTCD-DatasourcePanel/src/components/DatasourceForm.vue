<template>
  <div class="datasource-form">
    <div>
      <div class="modal-header">
        <span 
          :style="{ marginRight: '6px' }"
          @click="leaveEditMode"
          class="button-icon FontIcon name_chevronBigDown rotate_90 size_md"></span>
        {{ datasourceName ? 'Редактирование' : 'Создание' }} источника данных
      </div>
      <div class="modal-body">
        <div v-if="!datasourceName" class="form-field">
          <base-input
            label="Название"
            type="text"
            placeholder="Введите название"
            ref="datasourceName"
          ></base-input>
        </div>
        <div class="form-field">
          <base-input
            label="TTL"
            type="number"
            placeholder="Введите значение ttl"
            ref="ttl"
          ></base-input>
        </div>
        <div class="form-field">
          <base-textarea
            label="Запрос"
            placeholder="Введите запрос"
            ref="query"
            :style="{ width: '100%' }"
            theme="resize_off"
            data-autoheight 
            @keydown.ctrl.\="newLine"
          ></base-textarea>
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
  },
  data() {
    return {
      tempValue: {
        queryString: '',
        cache_ttl: 60,
        type: 'otl',
      },
    };
  },
  mounted() {
    if (this.datasourceName) {
      this.tempValue = {
        ...this.datasource,
      };
    }
    this.$refs.ttl.value = this.tempValue.cache_ttl;
    this.$refs.query.value = this.tempValue.queryString;
  },
  methods: {
    leaveEditMode() {
      this.$emit('leaveEditMode');
      this.clearTempValue();
    },
    save() {
      if (!this.$refs.query.value) return;

      this.tempValue.queryString = this.$refs.query.value;

      if (this.$refs.ttl.value) {
        this.tempValue.cache_ttl = Number.parseInt(this.$refs.ttl.value);
        if (this.tempValue.cache_ttl < 1) return;
      } else delete this.tempValue.cache_ttl;

      if (!this.datasourceName) {
        if (!this.$refs.datasourceName.value) return;
        this.tempValue.name = this.$refs.datasourceName.value;
      }

      this.tempValue.queryString.trim();
      this.$emit('saveDatasource', this.tempValue);
      this.leaveEditMode();
    },
    clearTempValue() {
      this.tempValue = {
        queryString: '',
        cache_ttl: 60,
      };
    },
    newLine () {
      this.$refs.query.value = this.$refs.query.value.split("|").join('\n \|').slice(1);
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
