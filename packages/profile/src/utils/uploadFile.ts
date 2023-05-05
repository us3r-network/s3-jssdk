export type UploadImageResult = {
  url: string;
};
export function uploadImage(file: File): Promise<Response> {
  const uploadApi = process.env.US3R_UPLOAD_IMAGE_ENDPOINT;
  if (!uploadApi) {
    throw new Error("US3R_UPLOAD_IMAGE_ENDPOINT is not defined");
  }
  const form = new FormData();
  form.append("file", file);
  // TODO: host config
  return fetch(uploadApi, {
    method: "POST",
    body: form,
  });
}
