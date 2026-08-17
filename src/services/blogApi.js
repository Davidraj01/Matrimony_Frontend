import API from "./axios";

export const getBlogs = async () => {
  const res = await API.get("/blogs");
  return res.data;
};

export const getBlogBySlug = async (slug) => {
  const res = await API.get(`/blogs/${slug}`);
  return res.data;
};
