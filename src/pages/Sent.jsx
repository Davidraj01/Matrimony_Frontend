import { useEffect, useState } from "react";
import { getSentInterests } from "../services/interestApi";

export default function Sent() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await getSentInterests();
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sent Interests</h2>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg font-medium">
              No interests sent yet 💌
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Start exploring matches and send interests.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((i) => (
              <div
                key={i._id}
                className="p-4 border rounded flex justify-between bg-white shadow-sm"
              >
                <p>{i.receiver?.name}</p>

                <span
                  className={`text-sm px-2 py-1 rounded ${
                    i.status === "accepted"
                      ? "bg-green-100 text-green-600"
                      : i.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
