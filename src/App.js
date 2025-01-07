import "./App.css";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import axios from "axios";

const App = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [extractedText, setExtractedText] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setExtractedText("")
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please upload an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/extract-number-plate/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Response:", data.extracted_number);
      setExtractedText(data.extracted_number)

    } catch (error) {
      console.error("Error occurred:", error);
    }
    
  };

  return (
    <div className="App">
      <div className="container">
        <div className="heading">
          <h1>Extract Licence Plate Numbers</h1>
        </div>
        <div className="image-input">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="fileInput" className="file-input-label">
              <FiUpload style={{ marginRight: "10px" }} /> Upload Image
            </label>
            <input
              id="fileInput"
              className="one"
              onChange={handleChange}
              type="file"
              accept="image/*"
              hidden
            />
            <input className="two" type="submit" value="Submit" />
          </form>
        </div>
        <div className="image-preview">
          {previewImage ? (
            <img src={previewImage} alt="Preview" />
          ) : (
            <p>No image selected</p>
          )}
        </div>
        <div className="result">
          <h3 style={{ marginRight: "10px" }}>Extracted Text:</h3>
          <h4>{extractedText || "N/A"}</h4>
        </div>
      </div>
    </div>
  );
};

export default App;
