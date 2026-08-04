import API from "./axios";

export const getPlans = async () => {
  const res = await API.get("/plan");
  return res.data;
};

export const getMyPlan = async () => {
  const res = await API.get("/plan/me");
  return res.data;
};
