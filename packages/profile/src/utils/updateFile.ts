export type UploadImageResult = {
  url: string;
};
export function uploadImage(file: File): Promise<Response> {
  const form = new FormData();
  form.append("file", file);
  // TODO: host config
  return fetch("https://test-enchanft-backend.onrender.com/medium/upload", {
    method: "POST",
    body: form,
  });
}
