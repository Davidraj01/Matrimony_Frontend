import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getBlogBySlug } from "../services/blogApi";
import { IMAGE_BASE_URL } from "../services/config";
import { PLACEHOLDER_IMAGE } from "../../utils/placeholder.js";

const imageUrl = (path) => {
  if (!path) return PLACEHOLDER_IMAGE;
  const cleanPath = path.replace(/^\/+/, "");
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to load blog post");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (notFound) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Blog post not found.</p>
        <Link to="/blog" className="text-pink-500 font-medium mt-2 inline-block">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow overflow-hidden">
        <img
          src={imageUrl(blog.coverImage)}
          alt={blog.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <Link to="/blog" className="text-sm text-pink-500">
            &larr; Back to Blog
          </Link>
          <h1 className="text-2xl font-bold mt-2">{blog.title}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
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
          <p className="text-gray-700 leading-7 mt-4 whitespace-pre-wrap">
            {blog.body}
          </p>
        </div>
      </div>
    </div>
  );
}
