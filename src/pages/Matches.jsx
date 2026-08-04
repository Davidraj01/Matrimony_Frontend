import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axios";
import { getMatches } from "../services/matchApi";
import MatchCard from "../components/MatchCard";
import { COLORS } from "../../utils/colors";

export default function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  const [filters, setFilters] = useState({
    minAge: "",
    maxAge: "",
    location: "",
    religion: "",
    caste: "",
    education: "",
    job: "",
    gender: "",
    diet: "",
    maritalStatus: "",
    motherTongue: "",
  });

  // ============================
  // 🚀 INITIAL LOAD
  // ============================
  useEffect(() => {
    fetchUser();
  }, []);
  const calculateMatch = (profile) => {
    let score = 50;

    if (
      filters.location &&
      profile.location?.toLowerCase() === filters.location?.toLowerCase()
    ) {
      score += 15;
    }

    if (
      filters.religion &&
      profile.religion?.toLowerCase() === filters.religion?.toLowerCase()
    ) {
      score += 15;
    }

    if (
      filters.gender &&
      profile.gender?.toLowerCase() === filters.gender?.toLowerCase()
    ) {
      score += 10;
    }

    if (
      filters.minAge &&
      filters.maxAge &&
      profile.age >= Number(filters.minAge) &&
      profile.age <= Number(filters.maxAge)
    ) {
      score += 10;
    }

    return Math.min(score, 98);
  };
  // ============================
  // 👤 FETCH USER PLAN + PREFS
  // ============================
  const fetchUser = async () => {
    try {
      const res = await API.get("/profile/me");

      const user = res.data.userId;
      const profile = res.data;

      const valid =
        user?.subscription === "premium" &&
        user?.premiumExpires &&
        new Date(user.premiumExpires) > new Date();

      setIsPremium(valid);

      // 🔥 APPLY PREFERENCES
      const pref = profile.preferences || {};

      const updatedFilters = {
        minAge: pref.ageRange?.min || "",
        maxAge: pref.ageRange?.max || "",
        location: pref.location || "",
        religion: pref.religion || "",
        caste: pref.caste || "",
        education: pref.education || "",
        job: pref.job || "",
        gender: pref.gender || "",
        diet: pref.diet || "",
        maritalStatus: pref.maritalStatus || "",
        motherTongue: pref.motherTongue || "",
      };

      setFilters(updatedFilters);

      // ✅ FETCH USING PREFS
      fetchMatches(updatedFilters, valid);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  // ============================
  // 🧹 CLEAN FILTERS
  // ============================
  const cleanFilters = (filters) => {
    const cleaned = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        cleaned[key] = value.toString().trim();
      }
    });

    return cleaned;
  };

  // ============================
  // 🔍 FETCH MATCHES
  // ============================
  const fetchMatches = async (
    currentFilters = filters,
    premiumStatus = isPremium,
  ) => {
    try {
      const cleaned = cleanFilters(currentFilters);

      const data = await getMatches(cleaned);

      const profiles = Array.isArray(data.profiles) ? data.profiles : [];

      // ✅ FREE LIMIT
      const visibleProfiles = premiumStatus ? profiles : profiles.slice(0, 4);

      setMatches(visibleProfiles);
    } catch (err) {
      console.error("FETCH MATCHES ERROR:", err);
      setMatches([]);
    }
  };

  // ============================
  // 🎛 HANDLE FILTER CHANGE
  // ============================
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ============================
  // 🔘 APPLY FILTERS
  // ============================
  const applyFilters = () => {
    fetchMatches();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MAIN */}
      <div className="flex-1 p-4 md:p-6 pb-20">
        {/* HEADER */}
        <div
          className={`p-6 rounded-xl text-white bg-gradient-to-r ${COLORS.primary}`}
        >
          <h2 className="text-2xl font-bold">Find Your Perfect Life Partner</h2>

          <p className="text-sm opacity-90 mt-1">Use filters to find matches</p>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <input
            placeholder="Min Age"
            className="input"
            value={filters.minAge}
            onChange={(e) => handleFilterChange("minAge", e.target.value)}
          />

          <input
            placeholder="Max Age"
            className="input"
            value={filters.maxAge}
            onChange={(e) => handleFilterChange("maxAge", e.target.value)}
          />

          <input
            placeholder="Location"
            className="input"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />

          <select
            className="input"
            value={filters.religion}
            onChange={(e) => handleFilterChange("religion", e.target.value)}
          >
            <option value="">Religion</option>
            <option>Hindu</option>
            <option>Muslim</option>
            <option>Christian</option>
          </select>

          <input
            placeholder="Caste"
            className="input"
            value={filters.caste}
            onChange={(e) => handleFilterChange("caste", e.target.value)}
          />

          <input
            placeholder="Education"
            className="input"
            value={filters.education}
            onChange={(e) => handleFilterChange("education", e.target.value)}
          />

          <input
            placeholder="Profession"
            className="input"
            value={filters.job}
            onChange={(e) => handleFilterChange("job", e.target.value)}
          />

          <select
            className="input"
            value={filters.gender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <select
            className="input"
            value={filters.diet}
            onChange={(e) => handleFilterChange("diet", e.target.value)}
          >
            <option value="">Diet</option>
            <option>Veg</option>
            <option>Non-Veg</option>
          </select>

          <select
            className="input"
            value={filters.maritalStatus}
            onChange={(e) =>
              handleFilterChange("maritalStatus", e.target.value)
            }
          >
            <option value="">Marital Status</option>
            <option>Single</option>
            <option>Divorced</option>
          </select>

          <input
            placeholder="Mother Tongue"
            className="input"
            value={filters.motherTongue}
            onChange={(e) => handleFilterChange("motherTongue", e.target.value)}
          />

          <button
            onClick={applyFilters}
            className={`col-span-full text-white rounded px-4 py-2 transition-transform active:scale-95 bg-gradient-to-r ${COLORS.primary}`}
          >
            Apply Filters
          </button>
        </div>

        {/* RESULTS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {matches.map((m) => (
            <div key={m._id} className="relative rounded-xl overflow-hidden">
              <MatchCard user={m} matchPercent={calculateMatch(m)} />
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {matches.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No matches found. Try adjusting your filters.
          </div>
        )}

        {/* PREMIUM CTA */}
        {!isPremium && (
          <div className="mt-10 bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-xl font-bold mb-2">
              Unlock Unlimited Matches 💎
            </h3>

            <p className="text-gray-500 mb-4">
              Upgrade to premium and access unlimited profiles, chats, and
              recommendations.
            </p>

            <button
              onClick={() => navigate("/plans")}
              className={`px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${COLORS.primary}`}
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
