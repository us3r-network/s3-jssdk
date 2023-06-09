import { AvatarUploadOpts } from "../../src/components/UserInfo/edit-form/UserInfoEditForm";

export type DefaultUploadImageResult = {
  url: string;
};
function uploadImage(file: File): Promise<Response> {
  const uploadApi = process.env.US3R_UPLOAD_IMAGE_ENDPOINT;
  if (!uploadApi) {
    throw new Error("US3R_UPLOAD_IMAGE_ENDPOINT is not defined");
  }
  const form = new FormData();
  form.append("file", file);
  return fetch(uploadApi, {
    method: "POST",
    body: form,
  });
}

export function getAvatarUploadOpts(): AvatarUploadOpts<DefaultUploadImageResult> {
  return {
    upload: async (file: File) => {
      const res = await uploadImage(file);
      const data = await res.json();
      return data;
    },
    validate: (data: DefaultUploadImageResult) => {
      return !!data.url;
    },
    getUrl: async (data: DefaultUploadImageResult) => {
      return data.url;
    },
  };
}
