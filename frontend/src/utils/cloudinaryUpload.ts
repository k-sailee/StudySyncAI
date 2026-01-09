export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "student_assignments");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dw5mkf4og/raw/upload", // ✅ RAW
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Cloudinary error:", error);
    throw new Error("Upload failed");
  }

  return await res.json(); // secure_url
};
