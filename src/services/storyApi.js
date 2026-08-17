import API from "./axios";

export const getStories = async () => {
  const res = await API.get("/stories");
  return res.data;
};
