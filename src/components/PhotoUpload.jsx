import React from "react";
import { uploadPhotos } from "../services/profileApi";
import toast from "react-hot-toast";

export default function PhotoUpload() {
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("photos", e.target.files[0]);

    await uploadPhotos(formData);
    toast.success("Uploaded");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
