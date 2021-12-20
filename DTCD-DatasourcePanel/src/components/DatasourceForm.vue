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
            stroke="#000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 16L4 10L10 4"
            stroke="#000"
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
            <textarea name="text" id="text" v-model="tempValue.original_otl"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="footer-btn" @click="save">
        {{ datasourceName ? 'Сохранить' : 'Создать' }}
      </button>
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
        original_otl: '',
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
      if (!this.tempValue.original_otl) return;

      if (this.tempValue.cache_ttl) {
        this.tempValue.cache_ttl = Number.parseInt(this.tempValue.cache_ttl);
        if (this.tempValue.cache_ttl < 1) return;
      } else delete this.tempValue.cache_ttl;

      if (!this.datasourceName && !this.tempValue.name) return;
      this.tempValue.original_otl.trim();
      this.$emit('saveDatasource', this.tempValue);
      this.leaveEditMode();
    },
    clearTempValue() {
      this.tempValue = {
        original_otl: '',
        cache_ttl: 60,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.datasource-form {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  /* height: 90vh;
  width: 90vh; */
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
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
}

.modal-footer {
  /* position: absolute;
  bottom: 0;
  right: 0; */
  width: 100%;
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 5px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #757575;
  background: transparent;
}
.btn-close:hover {
  color: #2196f3;
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
  border: 1px solid rgb(199, 208, 217);
  font: inherit;
  grid-area: 1 / 1 / 2 / 2;
}

.input {
  padding: 0.5rem;
  border: 1px solid rgb(199, 208, 217);
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
    background-color: #d4d1d1;
  }
}
</style>
