import { useEffect, useState } from "react";
import API from "../services/axios";

export default function Views() {
  const [views, setViews] = useState([]);

  useEffect(() => {
    const fetchViews = async () => {
      const res = await API.get("/views/viewers");
      setViews(res.data);
    };

    fetchViews();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Who Viewed Me</h2>

      {views.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg font-medium">
            No profile views yet 👀
          </p>

          <p className="text-sm text-gray-400 mt-2">
            People who visit your profile will appear here.
          </p>
        </div>
      ) : (
        views.map((v) => (
          <div
            key={v._id}
            className="p-4 border rounded-xl mb-3 bg-white shadow-sm hover:shadow transition"
          >
            <p className="font-semibold">{v.viewer?.name}</p>

            <p className="text-sm text-gray-500 mt-1">
              ID: {v.viewer?.userUniqueId}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
