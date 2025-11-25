import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/"
})

export const savePhotoState = async (filePath: string, status: string, disease?: string) => {
  const formData = new FormData();

  formData.append("file", {
    uri: "file://" + filePath,
    type: "image/jpeg",
    name: "photo.jpg",
  } as any);

  formData.append("status", status);
  if (disease) formData.append("disease", disease);

  return api.post("/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};