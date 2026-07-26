<template>
  <teleport to="body">
    <div
      v-if="state.open"
      class="confirm-root"
      role="presentation"
      @keydown.esc.stop.prevent="onCancel"
    >
      <div class="confirm-backdrop" @click="onCancel"></div>
      <div
        class="confirm-panel"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="messageId"
        @click.stop
      >
        <h2 :id="titleId" class="confirm-title">{{ state.title }}</h2>
        <p :id="messageId" class="confirm-message">{{ state.message }}</p>
        <div class="confirm-actions">
          <button
            ref="cancelBtn"
            type="button"
            class="confirm-btn confirm-btn-cancel"
            @click.stop="onCancel"
          >
            {{ state.cancelLabel }}
          </button>
          <button
            ref="confirmBtn"
            type="button"
            class="confirm-btn"
            :class="
              state.danger ? 'confirm-btn-danger' : 'confirm-btn-primary'
            "
            @click.stop="onConfirm"
          >
            {{ state.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import {
  getConfirmDialogState,
  resolveConfirmDialog,
} from "../../shared/confirmDialog";

let dialogSeq = 0;

export default {
  name: "ConfirmDialog",
  setup() {
    dialogSeq += 1;
    const state = getConfirmDialogState();
    const titleId = "confirm-title-" + dialogSeq;
    const messageId = "confirm-message-" + dialogSeq;

    return {
      state,
      titleId,
      messageId,
    };
  },
  watch: {
    "state.open"(open) {
      if (open) {
        this.$nextTick(() => {
          const focusEl = this.state.danger
            ? this.$refs.cancelBtn
            : this.$refs.confirmBtn;
          if (focusEl && focusEl.focus) {
            focusEl.focus();
          }
        });
      }
    },
  },
  methods: {
    onCancel() {
      resolveConfirmDialog(false);
    },
    onConfirm() {
      resolveConfirmDialog(true);
    },
  },
};
</script>

<style scoped>
.confirm-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.confirm-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
}

.confirm-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 22rem;
  padding: 1.15rem 1.25rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
  color: #17263c;
}

:global(.dark) .confirm-panel {
  background: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
}

.confirm-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.confirm-message {
  margin: 0 0 1.15rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.45;
  color: #4b5563;
}

:global(.dark) .confirm-message {
  color: #9ca3af;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.confirm-btn {
  box-sizing: border-box;
  min-height: 2.25rem;
  min-width: 4.5rem;
  padding: 0.4rem 0.85rem;
  border: 0;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
}

.confirm-btn:focus-visible {
  outline: 2px solid #9ca3af;
  outline-offset: 2px;
}

.confirm-btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.confirm-btn-cancel:hover {
  background: #d1d5db;
}

:global(.dark) .confirm-btn-cancel {
  background: #374151;
  color: #e5e7eb;
}

:global(.dark) .confirm-btn-cancel:hover {
  background: #4b5563;
}

.confirm-btn-danger {
  background: #b91c1c;
  color: #fff;
}

.confirm-btn-danger:hover {
  background: #991b1b;
}

.confirm-btn-primary {
  background: #e07a2f;
  color: #10212a;
}

.confirm-btn-primary:hover {
  background: #e89b4d;
}
</style>
