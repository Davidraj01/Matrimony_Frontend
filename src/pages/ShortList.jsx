import { useEffect, useState } from "react";
import API from "../services/axios";

export default function Shortlist() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/shortlist");
      setList(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">⭐ Shortlisted</h2>

      {list.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg font-medium">
            No shortlisted profiles yet ⭐
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Profiles you shortlist will appear here.
          </p>
        </div>
      ) : (
        list.map((u) => (
          <div
            key={u._id}
            className="p-4 border rounded-xl mb-3 bg-white shadow-sm hover:shadow transition"
          >
            <p className="font-medium">{u.name}</p>

            <p className="text-sm text-gray-500 mt-1">ID: {u.userUniqueId}</p>
          </div>
        ))
      )}
    </div>
  );
}
