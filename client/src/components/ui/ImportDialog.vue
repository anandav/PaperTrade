<template>
  <teleport to="body">
    <div
      v-if="open"
      class="import-root"
      role="presentation"
      @keydown.esc.stop.prevent="onCancel"
    >
      <div class="import-backdrop" @click="onCancel"></div>
      <div
        ref="panel"
        class="import-panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @click.stop
      >
        <h2 :id="titleId" class="import-title">{{ title }}</h2>

        <div class="import-body">
          <p v-if="step === 'loading'" class="import-status">Checking import settings...</p>

          <p v-else-if="!capabilities.enabled" class="import-status">
            Document import is turned off.
          </p>

          <template v-else-if="step === 'pick'">
            <label class="import-file" :for="inputId">
              <i class="material-icons" aria-hidden="true">upload_file</i>
              <span>{{ fileName || "Choose a file" }}</span>
              <input
                :id="inputId"
                class="import-file-input"
                type="file"
                :accept="accept"
                @change="onPick"
              />
            </label>
            <p class="import-hint">
              {{ capabilities.message }}. Max {{ capabilities.maxMb }} MB.
            </p>
            <p class="import-hint">{{ hint }}</p>
          </template>

          <p v-else-if="step === 'reading'" class="import-status" aria-live="polite">
            <span class="import-spinner" aria-hidden="true"></span>
            Reading document...
          </p>

          <template v-else-if="step === 'preview'">
            <ul v-if="messages.length" class="import-notes">
              <li
                v-for="(m, index) in messages"
                :key="index"
                :class="{ 'import-note-warn': m.warn }"
              >
                {{ m.text }}
              </li>
            </ul>
            <slot name="preview" :result="result"></slot>
          </template>

          <p v-if="error" class="import-error" role="alert">{{ error }}</p>
        </div>

        <div class="import-actions">
          <button
            type="button"
            class="import-btn import-btn-cancel"
            @click.stop="onCancel"
          >
            Cancel
          </button>
          <button
            v-if="step === 'pick' && capabilities.enabled"
            type="button"
            class="import-btn import-btn-primary"
            :disabled="!file"
            @click.stop="onRead"
          >
            Read file
          </button>
          <button
            v-if="step === 'preview'"
            type="button"
            class="import-btn import-btn-primary"
            :disabled="saving || !canConfirm"
            @click.stop="onConfirm"
          >
            {{ saving ? "Importing..." : confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
let dialogSeq = 0;

function errorMessage(err, fallback) {
  const msg = err && err.response && err.response.data && err.response.data.message;
  return msg || (err && err.message) || fallback;
}

export default {
  name: "ImportDialog",
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: "Import" },
    hint: { type: String, default: "" },
    confirmLabel: { type: String, default: "Import" },
    canConfirm: { type: Boolean, default: true },
    extract: { type: Function, required: true },
    confirm: { type: Function, required: true },
  },
  emits: ["close"],
  data() {
    dialogSeq += 1;
    return {
      titleId: "import-title-" + dialogSeq,
      inputId: "import-file-" + dialogSeq,
      step: "loading",
      capabilities: { enabled: false, formats: [], maxMb: 0, message: "" },
      file: null,
      result: null,
      error: "",
      saving: false,
    };
  },
  computed: {
    accept() {
      return this.capabilities.formats.map((f) => "." + f).join(",");
    },
    fileName() {
      return this.file ? this.file.name : "";
    },
    messages() {
      if (!this.result) {
        return [];
      }
      const warnings = (this.result.warnings || []).map((text) => ({ text, warn: true }));
      const skipped = (this.result.skipped || []).map((s) => ({
        text: `Skipped ${s.symbol || "a row"}: ${s.reason}`,
        warn: true,
      }));
      const notes = (this.result.notes || []).map((text) => ({ text, warn: false }));
      return [...warnings, ...skipped, ...notes];
    },
  },
  watch: {
    open(value) {
      if (value) {
        this.reset();
        this.loadCapabilities();
        this.$nextTick(() => this.$refs.panel && this.$refs.panel.focus());
      }
    },
  },
  methods: {
    reset() {
      this.step = "loading";
      this.file = null;
      this.result = null;
      this.error = "";
      this.saving = false;
    },
    async loadCapabilities() {
      this.capabilities = await this.$store.dispatch("docImportModule/GetImportCapabilities");
      this.step = "pick";
    },
    onPick(event) {
      const file = event.target.files && event.target.files[0];
      this.error = "";
      this.file = null;
      if (!file) {
        return;
      }
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!this.capabilities.formats.includes(ext)) {
        this.error = this.capabilities.message;
        event.target.value = "";
        return;
      }
      if (file.size > this.capabilities.maxMb * 1024 * 1024) {
        this.error = `File is larger than ${this.capabilities.maxMb} MB.`;
        event.target.value = "";
        return;
      }
      this.file = file;
    },
    async onRead() {
      if (!this.file) {
        return;
      }
      this.error = "";
      this.step = "reading";
      try {
        this.result = await this.extract(this.file);
        this.step = "preview";
      } catch (err) {
        this.error = errorMessage(err, "Could not read the document.");
        this.step = "pick";
        this.file = null;
      }
    },
    async onConfirm() {
      this.error = "";
      this.saving = true;
      try {
        await this.confirm(this.result);
        this.$emit("close");
      } catch (err) {
        this.error = errorMessage(err, "Could not import.");
      } finally {
        this.saving = false;
      }
    },
    onCancel() {
      if (this.saving || this.step === "reading") {
        return;
      }
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.import-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.import-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
}

.import-panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 46rem;
  max-height: calc(100vh - 2rem);
  padding: 1.15rem 1.25rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
  color: #17263c;
  outline: none;
}

:global(.dark) .import-panel {
  background: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
}

.import-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.import-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.import-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  color: #4b5563;
}

:global(.dark) .import-status {
  color: #9ca3af;
}

.import-file {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 100%;
  padding: 0.5rem 0.85rem;
  border: 1px dashed #9ca3af;
  border-radius: 0.375rem;
  cursor: pointer;
  overflow-wrap: anywhere;
}

.import-file:hover {
  border-color: #e07a2f;
}

.import-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.import-file:focus-within {
  outline: 2px solid #9ca3af;
}

.import-hint {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

:global(.dark) .import-hint {
  color: #9ca3af;
}

.import-notes {
  margin: 0 0 0.75rem;
  padding-left: 1.1rem;
  list-style: disc;
  font-size: 0.75rem;
  color: #4b5563;
}

:global(.dark) .import-notes {
  color: #9ca3af;
}

.import-note-warn {
  color: #b45309;
}

:global(.dark) .import-note-warn {
  color: #fbbf24;
}

.import-error {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #b91c1c;
}

:global(.dark) .import-error {
  color: #f87171;
}

.import-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #9ca3af;
  border-top-color: #e07a2f;
  border-radius: 50%;
  animation: import-spin 0.8s linear infinite;
}

@keyframes import-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .import-spinner {
    animation-duration: 2.4s;
  }
}

.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.import-btn {
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

.import-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.import-btn:focus-visible {
  outline: 2px solid #9ca3af;
  outline-offset: 2px;
}

.import-btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.import-btn-cancel:hover {
  background: #d1d5db;
}

:global(.dark) .import-btn-cancel {
  background: #374151;
  color: #e5e7eb;
}

:global(.dark) .import-btn-cancel:hover {
  background: #4b5563;
}

.import-btn-primary {
  background: #e07a2f;
  color: #10212a;
}

.import-btn-primary:hover:not(:disabled) {
  background: #e89b4d;
}
</style>
