<template>
  <div class="datasource-form">
    <div>
      <div class="modal-header">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="button-icon"
          @click="leaveEditMode"
        >
          <path
            d="M16 10H4"
            stroke="var(--title)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 16L4 10L10 4"
            stroke="var(--title)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <slot name="header">
          {{ datasourceName ? 'Редактирование' : 'Создание' }} источника данных</slot
        >
      </div>
      <div class="modal-body">
        <div v-if="!datasourceName" class="form-field">
          <div class="label-wrapper">
            <label>Название</label>
          </div>
          <input type="text" class="input" v-model="tempValue.name" />
        </div>
        <div class="form-field">
          <div class="label-wrapper">
            <label>TTL</label>
          </div>
          <input type="number" class="input" v-model="tempValue.cache_ttl" />
        </div>
        <div class="form-field">
          <div class="label-wrapper">
            <label>Запрос</label>
          </div>
          <div class="grow-wrap">
            <textarea name="text" id="text" v-model="tempValue.queryString"></textarea>
          </div>
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
  },
  methods: {
    leaveEditMode() {
      this.$emit('leaveEditMode');
      this.clearTempValue();
    },
    save() {
      if (!this.tempValue.queryString) return;

      if (this.tempValue.cache_ttl) {
        this.tempValue.cache_ttl = Number.parseInt(this.tempValue.cache_ttl);
        if (this.tempValue.cache_ttl < 1) return;
      } else delete this.tempValue.cache_ttl;

      if (!this.datasourceName && !this.tempValue.name) return;
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
  padding: 15px;
  display: flex;
  box-sizing: border-box;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid var(--border);
}

.modal-footer {
  width: 100%;
  border-top: 1px solid var(--border);
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px;
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

.grow-wrap {
  display: grid;
}
.grow-wrap::after {
  content: attr(data-replicated-value) ' ';
  white-space: pre-wrap;
  visibility: hidden;
}
.grow-wrap > textarea {
  resize: none;
  overflow: hidden;
}
.grow-wrap > textarea,
.grow-wrap::after {
  padding: 0.5rem;
  border: 1px solid var(--border);
  font: inherit;
  grid-area: 1 / 1 / 2 / 2;
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
