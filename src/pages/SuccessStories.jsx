import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getStories } from "../services/storyApi";
import { IMAGE_BASE_URL } from "../services/config";
import { COLORS } from "../../utils/colors.js";
import { PLACEHOLDER_IMAGE } from "../../utils/placeholder.js";

const imageUrl = (path) => {
  if (!path) return PLACEHOLDER_IMAGE;
  const cleanPath = path.replace(/^\/+/, "");
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getStories();
        setStories(data);
      } catch {
        toast.error("Failed to load success stories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-20">
      <div className={`p-6 rounded-xl text-white bg-gradient-to-r ${COLORS.primary}`}>
        <h2 className="text-xl md:text-2xl font-bold">Success Stories</h2>
        <p className="text-sm opacity-90 mt-1">
          Real couples who found each other on Royal Matrimony
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : stories.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No success stories published yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
          {stories.map((s) => (
            <div key={s._id} className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src={imageUrl(s.photo)}
                alt={s.coupleNames}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{s.coupleNames}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-6 whitespace-pre-wrap">
                  {s.story}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
