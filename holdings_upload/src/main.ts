import "./style.css";

const dropzone = document.querySelector<HTMLElement>("#dropzone")!;
const dropzoneTitle = dropzone.querySelector<HTMLElement>(".dropzone-title")!;
const dropzoneSubtitle = dropzone.querySelector<HTMLElement>(".dropzone-subtitle")!;
const fileInput = document.querySelector<HTMLInputElement>("#file")!;
const uploadBtn = document.querySelector<HTMLButtonElement>("#upload")!;

const DEFAULT_TITLE = dropzoneTitle.textContent ?? "Drag and drop CSV here";
const DEFAULT_SUBTITLE = dropzoneSubtitle.textContent ?? "or click to choose file";

// TODO: Replace with actual endpoint
const STARLINE_ENDPOINT = "XXX";

let selectedFile: File | null = null;

function isCSV(file: File) {
  return (
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel"
  );
}

function setSelectedFile(file: File | null) {
  // Clear “upload status” messages when changing files (optional)

  if (!file) {
    selectedFile = null;
    uploadBtn.disabled = true;
    renderDropzoneForFile(null);
    return;
  }

  if (!isCSV(file)) {
    selectedFile = null;
    uploadBtn.disabled = true;
    renderDropzoneForFile(null);
    alert("Please select a valid CSV file");
    return;
  }

  selectedFile = file;
  uploadBtn.disabled = false;

  renderDropzoneForFile(file);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function renderDropzoneForFile(file: File | null) {
  if (!file) {
    dropzone.classList.remove("has-file");
    dropzoneTitle.textContent = DEFAULT_TITLE;
    dropzoneSubtitle.textContent = DEFAULT_SUBTITLE;
    return;
  }

  dropzone.classList.add("has-file");
  dropzoneTitle.textContent = `Selected: ${file.name}`;
  dropzoneSubtitle.textContent = `${formatBytes(file.size)} • click or drop to replace`;
}

// Click-to-select
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0] ?? null;
  setSelectedFile(file);
});

// Drag-and-drop behavior
function preventDefaults(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (e) => {
    preventDefaults(e as DragEvent);
    dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (e) => {
    preventDefaults(e as DragEvent);
    dropzone.classList.remove("dragover");
  });
});

dropzone.addEventListener("drop", (e) => {
  const dt = (e as DragEvent).dataTransfer;
  const file = dt?.files?.[0] ?? null;
  if (file) setSelectedFile(file);
});

// Upload
uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  uploadBtn.disabled = true;

  try {
    const form = new FormData();
    form.append("file", selectedFile, selectedFile.name);

    const res = await fetch(STARLINE_ENDPOINT, {
      method: "POST",
      body: form,
    });

    const contentType = res.headers.get("content-type") || "";
    const bodyText = contentType.includes("application/json")
      ? JSON.stringify(await res.json(), null, 2)
      : await res.text();

    if (!res.ok) {
      alert(`Upload failed (${res.status})\n\n${bodyText}`);
      return;
    }

    alert(`Uploaded successfully (${res.status})\n\n${bodyText}`);
  } catch (err) {
    alert(`Network error\n\n${String(err)}`);
  } finally {
    uploadBtn.disabled = false;
  }
});