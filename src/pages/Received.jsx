import { useEffect, useState } from "react";
import { getReceivedInterests, respondInterest } from "../services/interestApi";

export default function Received() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await getReceivedInterests();
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, status) => {
    await respondInterest(id, status);
    fetchData(); // refresh
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Received Interests</h2>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg font-medium">
              No interests received yet 💌
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Your received requests will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((i) => (
              <div
                key={i._id}
                className="p-4 border rounded flex justify-between items-center bg-white shadow-sm"
              >
                <p>{i.sender?.name}</p>

                {i.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(i._id, "accepted")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleAction(i._id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {i.status !== "pending" && (
                  <span className="text-sm text-gray-500 capitalize">
                    {i.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
