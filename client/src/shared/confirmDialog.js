import { reactive } from "vue";

const state = reactive({
  open: false,
  title: "Confirm",
  message: "",
  confirmLabel: "Delete",
  cancelLabel: "Cancel",
  danger: true,
});

let resolver = null;

export function getConfirmDialogState() {
  return state;
}

export function openConfirmDialog(options = {}) {
  if (resolver) {
    resolver(false);
    resolver = null;
  }

  state.title = options.title || "Confirm";
  state.message = options.message || "Are you sure?";
  state.confirmLabel = options.confirmLabel || "Delete";
  state.cancelLabel = options.cancelLabel || "Cancel";
  state.danger = options.danger !== false;
  state.open = true;

  return new Promise((resolve) => {
    resolver = resolve;
  });
}

export function confirmDelete(message, title = "Delete") {
  return openConfirmDialog({
    title,
    message,
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    danger: true,
  });
}

export function resolveConfirmDialog(result) {
  state.open = false;
  if (resolver) {
    const done = resolver;
    resolver = null;
    done(!!result);
  }
}
