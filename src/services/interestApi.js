import API from "./axios";

export const sendInterest = async (receiverId) => {
  const res = await API.post("/interest/send", { receiverId });
  return res.data;
};
export const getReceivedInterests = async () => {
  const res = await API.get("/interest/received");
  return res.data;
};

export const getSentInterests = async () => {
  const res = await API.get("/interest/sent");
  return res.data;
};

export const respondInterest = async (id, status) => {
  const res = await API.put(`/interest/${id}/respond`, { status });
  return res.data;
};
