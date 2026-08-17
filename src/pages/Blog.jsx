import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getBlogs } from "../services/blogApi";
import { IMAGE_BASE_URL } from "../services/config";
import { COLORS } from "../../utils/colors.js";
import { PLACEHOLDER_IMAGE } from "../../utils/placeholder.js";

const imageUrl = (path) => {
  if (!path) return PLACEHOLDER_IMAGE;
  const cleanPath = path.replace(/^\/+/, "");
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch {
        toast.error("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-20">
      <div className={`p-6 rounded-xl text-white bg-gradient-to-r ${COLORS.primary}`}>
        <h2 className="text-xl md:text-2xl font-bold">Blog</h2>
        <p className="text-sm opacity-90 mt-1">
          Tips, stories and updates from Royal Matrimony
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No blog posts yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition"
            >
              <img
                src={imageUrl(blog.coverImage)}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-pink-50 text-pink-500 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
