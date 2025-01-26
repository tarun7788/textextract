import "./App.css";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import PropagateLoader from "react-spinners/PropagateLoader";


const App = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const token = process.env.REACT_APP_TOKEN; 
  // console.log(process.env.token)

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setExtractedText("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please upload an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log("Here is the token ",token)
    try {
      const response = await fetch("https://tarun77-licenceplatefastapi.hf.space/extract-number-plate/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Response:", data.extracted_number);
      setExtractedText(data.extracted_number);
      setLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false);
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
          {loading ? (
            <div className="loader">
              <PropagateLoader color="#e4e4e4" />
            </div>
          ) : (
            ""
          )}

          {previewImage ? (
            <img src={previewImage} alt="Preview" />
          ) : (
            <p>No image selected</p>
          )}
        </div>
        <p style={{ fontSize: "12px", alignSelf: "flex-start" }}>
          Note: Please upload good quality images.
        </p>
        <div className="result">
          <h3 style={{ marginRight: "10px" }}>Extracted Text:</h3>
          <h4>{extractedText}</h4>
        </div>
      </div>
    </div>
  );
};

export default App;
