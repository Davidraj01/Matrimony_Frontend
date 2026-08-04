import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  getPlans,
  updatePlan,
  getUsers,
  setUserSubscription,
} from "../../services/adminApi";

function PlanCard({ plan, onSaved }) {
  const [price, setPrice] = useState(plan.price);
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updatePlan(plan._id, {
        price: Number(price),
        features: features.split("\n").map((f) => f.trim()).filter(Boolean),
      });
      onSaved(updated);
      toast.success(`${plan.name} plan updated`);
    } catch (err) {
      toast.error(err.message || "Failed to update plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
      <h3 className="font-semibold text-gray-800 capitalize">{plan.name} plan</h3>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Features (one per line)
        </label>
        <textarea
          rows={4}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [subscription, setSubscription] = useState("premium");
  const [days, setDays] = useState(30);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch((err) => toast.error(err.message || "Failed to load plans"))
      .finally(() => setLoading(false));
  }, []);

  const handlePlanSaved = (updated) => {
    setPlans((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const searchUsers = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const data = await getUsers({ search, limit: 5 });
      setResults(data.users);
    } catch (err) {
      toast.error(err.message || "Search failed");
    }
  };

  const pickUser = (u) => {
    setSelected(u);
    setSubscription(u.subscription === "premium" ? "free" : "premium");
    setResults([]);
    setSearch("");
  };

  const applySubscription = async () => {
    setApplying(true);
    try {
      const updated = await setUserSubscription(selected._id, {
        subscription,
        days,
      });
      setSelected(updated);
      toast.success(`${updated.name} is now on the ${updated.subscription} plan`);
    } catch (err) {
      toast.error(err.message || "Failed to update subscription");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Plans &amp; subscriptions</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading plans…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} onSaved={handlePlanSaved} />
          ))}
        </div>
      )}

      <div className="rounded-xl bg-white border border-gray-200 p-4 max-w-md space-y-3">
        <h2 className="text-sm font-medium text-gray-700">
          Manually change a user's plan
        </h2>

        <form onSubmit={searchUsers} className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-pink-500"
          />
        </form>

        {results.length > 0 && (
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
            {results.map((u) => (
              <li
                key={u._id}
                onClick={() => pickUser(u)}
                className="px-3 py-2 text-sm hover:bg-pink-50 cursor-pointer flex justify-between"
              >
                <span>{u.name}</span>
                <span className="text-gray-400 capitalize">{u.subscription}</span>
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <p className="text-sm text-gray-700">
              <strong>{selected.name}</strong> — currently{" "}
              <span className="capitalize">{selected.subscription}</span>
              {selected.premiumExpires &&
                ` (expires ${new Date(selected.premiumExpires).toLocaleDateString()})`}
            </p>
            <div className="flex gap-2 items-center">
              <select
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
                className="rounded-lg border border-gray-300 text-sm px-2 py-1.5"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              {subscription === "premium" && (
                <input
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-20 rounded-lg border border-gray-300 text-sm px-2 py-1.5"
                  title="Days of premium access"
                />
              )}
              <button
                onClick={applySubscription}
                disabled={applying}
                className="rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1.5 disabled:opacity-60"
              >
                {applying ? "Applying…" : "Apply"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
