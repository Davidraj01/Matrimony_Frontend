import API from "./axios";

export const getMatches = async (filters) => {
  const res = await API.get("/match", { params: filters });
  return res.data;
};
