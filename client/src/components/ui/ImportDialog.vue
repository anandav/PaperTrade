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
        class="
          import-panel
          rounded-lg
          border
          border-gray-300
          dark:border-gray-700
          bg-gray-100
          dark:bg-gray-800
        "
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @click.stop
      >
        <div class="import-head border-b-2 border-gray-300 dark:border-gray-700">
          <div class="min-w-0">
            <h2 :id="titleId" class="import-title text-gray-900 dark:text-white">{{ title }}</h2>
            <span class="text-xs text-gray-500">{{ stepLabel }}</span>
          </div>
          <button
            class="btn tooltip shrink-0"
            type="button"
            aria-label="Close"
            :disabled="busy"
            @click.stop="onCancel"
          >
            <i class="material-icons" aria-hidden="true">close</i>
            <tooltip Value="Close" Location="bottom end" />
          </button>
        </div>

        <div class="import-body">
          <p v-if="step === 'loading'" class="import-status text-xs text-gray-500">
            Checking import settings...
          </p>

          <p v-else-if="!capabilities.enabled" class="import-status text-xs text-gray-500">
            Document import is turned off.
          </p>

          <template v-else-if="step === 'pick'">
            <div class="import-fields">
              <div class="import-field import-field-file">
                <span class="text-xs block text-gray-500" :id="inputId + '-label'">File</span>
                <label
                  class="normal-edit import-file"
                  :class="{ 'import-file-empty': !file }"
                  :for="inputId"
                >
                  <i class="material-icons" aria-hidden="true">upload_file</i>
                  <span class="truncate">{{ fileName || "Choose a file" }}</span>
                  <input
                    :id="inputId"
                    class="import-file-input"
                    type="file"
                    :accept="accept"
                    :aria-labelledby="inputId + '-label'"
                    @change="onPick"
                  />
                </label>
              </div>
              <div class="import-field">
                <span class="text-xs block text-gray-500">Formats</span>
                <span>{{ formatsLabel }}</span>
              </div>
              <div class="import-field">
                <span class="text-xs block text-gray-500">Max size</span>
                <span>{{ capabilities.maxMb }} MB</span>
              </div>
            </div>
            <p v-if="hint" class="import-hint text-xs text-gray-500">{{ hint }}</p>
          </template>

          <p
            v-else-if="step === 'reading'"
            class="import-status text-xs text-gray-500"
            aria-live="polite"
          >
            <i class="material-icons import-spin" aria-hidden="true">autorenew</i>
            Reading {{ fileName }}...
          </p>

          <template v-else-if="step === 'preview'">
            <slot name="summary" :result="result"></slot>
            <ul v-if="messages.length" class="import-notes">
              <li
                v-for="(m, index) in messages"
                :key="index"
                class="text-xs"
                :class="m.warn ? 'text-yellow-700 dark:text-yellow-500' : 'text-gray-500'"
              >
                <i class="material-icons" aria-hidden="true">{{ m.warn ? "warning_amber" : "info" }}</i>
                <span>{{ m.text }}</span>
              </li>
            </ul>
            <slot name="preview" :result="result"></slot>
          </template>

          <p v-if="error" class="import-error text-xs text-red-700 dark:text-red-400" role="alert">
            {{ error }}
          </p>
        </div>

        <div class="import-actions border-t border-gray-300 dark:border-gray-700">
          <button
            v-if="step === 'preview' && !saving"
            type="button"
            class="import-btn import-btn-cancel import-btn-left"
            @click.stop="onBack"
          >
            Choose another file
          </button>
          <button
            type="button"
            class="import-btn import-btn-cancel"
            :disabled="busy"
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
    formatsLabel() {
      return this.capabilities.formats.map((f) => f.toUpperCase()).join(", ");
    },
    fileName() {
      return this.file ? this.file.name : "";
    },
    busy() {
      return this.saving || this.step === "reading";
    },
    stepLabel() {
      if (this.step === "preview") {
        return "Step 2 of 2: review and import";
      }
      if (this.step === "reading") {
        return "Step 1 of 2: reading the document";
      }
      return "Step 1 of 2: choose a file";
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
    onBack() {
      this.result = null;
      this.file = null;
      this.error = "";
      this.step = "pick";
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
      if (this.busy) {
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
  max-width: 48rem;
  max-height: calc(100vh - 2rem);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
  outline: none;
}

.import-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem 0.75rem;
}

.import-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.3;
}

.import-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 0.85rem 1rem;
}

.import-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0.25rem 0;
}

.import-spin {
  font-size: 16px;
  animation: import-spin 1.2s linear infinite;
}

@keyframes import-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .import-spin {
    animation: none;
  }
}

.import-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}

.import-field {
  min-width: 0;
}

.import-field-file {
  grid-column: 1 / -1;
}

.import-file {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  max-width: 24rem;
  cursor: pointer;
}

.import-file i {
  font-size: 16px;
}

.import-file-empty {
  color: #9ca3af;
}

.import-file:hover,
.import-file:focus-within {
  border-color: #eab308;
}

.import-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.import-hint {
  margin: 0.75rem 0 0;
}

.import-notes {
  margin: 0.75rem 0;
  padding: 0;
  list-style: none;
}

.import-notes li {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  margin-top: 0.25rem;
  line-height: 1.35;
}

.import-notes i {
  font-size: 14px;
  line-height: 1.35;
}

.import-error {
  margin: 0.75rem 0 0;
}

.import-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.import-btn-left {
  margin-right: auto;
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

.import-btn-cancel:hover:not(:disabled) {
  background: #d1d5db;
}

:global(.dark) .import-btn-cancel {
  background: #374151;
  color: #e5e7eb;
}

:global(.dark) .import-btn-cancel:hover:not(:disabled) {
  background: #4b5563;
}

.import-btn-primary {
  background: #e07a2f;
  color: #10212a;
}

.import-btn-primary:hover:not(:disabled) {
  background: #e89b4d;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (min-width: 640px) {
  .import-fields {
    grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  }
  .import-field-file {
    grid-column: auto;
  }
}
</style>
