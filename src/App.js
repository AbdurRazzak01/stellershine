import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import KYCForm from './KYCForm';
import './styles.css'; // Include your CSS file

const TWITTER_API_BEARER_TOKEN = ""; // Replace with your bearer token
const OPENAI_API_KEY = ""; // Replace with your OpenAI API key

function App() {
  const [disasterLocations, setDisasterLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [validationResult, setValidationResult] = useState("");

  useEffect(() => {
    fetchTwitterData();
  }, []);

  // Fetch Twitter data to detect disaster locations
  const fetchTwitterData = async () => {
    setLoading(true);
    try {
      const query = "earthquake OR flood OR wildfire";
      const twitterResponse = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=text&max_results=20`, // Limit to 20 results
        {
          headers: {
            Authorization: `Bearer ${TWITTER_API_BEARER_TOKEN}`,
          },
        }
      );

      const tweets = twitterResponse.data.data || []; // Handle case where data might be undefined
      const locations = await analyzeTweets(tweets);
      setDisasterLocations(locations);
    } catch (error) {
      console.error("Error fetching data: ", error.response?.data || error.message);
    }
    setLoading(false);
  };

  // Analyze tweets using OpenAI to extract disaster locations
  const analyzeTweets = async (tweets) => {
    const locations = [];
    for (const tweet of tweets) {
      try {
        const openaiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "Identify disaster locations from tweets." },
              { role: "user", content: `Extract any location names related to natural disasters from the following tweet: ${tweet.text}` },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );

        const result = openaiResponse.data.choices[0].message.content.trim();
        if (result) {
          locations.push(result);
        }
      } catch (error) {
        console.error("Error analyzing tweet: ", error.response?.data || error.message);
      }
    }
    return locations;
  };

  // Dropzone and file upload logic for receipt validation
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setReceiptFile(acceptedFiles[0]),
  });

  const handleFileUpload = async () => {
    if (!receiptFile) {
      alert("Please upload a receipt file.");
      return;
    }

    
  try {
    // Perform OCR on the uploaded receipt
    const { data: { text } } = await Tesseract.recognize(receiptFile, "eng", {
      logger: (info) => console.log(info) // Log progress for debugging
    });

    // Clean and summarize the extracted text
    const relevantText = cleanAndSummarizeText(text);

    // Validate the receipt using OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an assistant that validates receipts for homebuilding items." },
          { role: "user", content: `Check if the following receipt contains homebuilding items: ${relevantText}` },
        ],
        max_tokens: 60,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const validationResult = response.data.choices[0].message.content.trim();
    setValidationResult(validationResult);
  } catch (error) {
    console.error("Error during receipt validation:", error);
    setValidationResult("Failed to validate receipt.");
  }
};

// Function to clean and summarize the OCR text
const cleanAndSummarizeText = (text) => {
  // Normalize whitespace and remove non-relevant information
  const cleanedText = text.replace(/\s+/g, ' ').trim();

  // Example: Keep only relevant keywords for validation
  const relevantKeywords = ['lumber', 'cement', 'nails', 'wood', 'bricks', 'screws', 'paint'];
  const containsKeywords = relevantKeywords.some(keyword => cleanedText.toLowerCase().includes(keyword));
  
  return containsKeywords ? cleanedText : "No relevant homebuilding items found.";
};
  

  // Slick slider settings for disaster locations
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="app">
      <header className="header">
        <nav className="menu-bar">
          <ul>
            <li>KYC</li>
            <li>Post for Fund</li>
            <li>Donate Fund</li>
          </ul>
        </nav>
        <h1>StellerShine</h1>
        <h2>Shine & Smile with Us</h2>
      </header>

 
      <div className="content">
        {/* Receipt Validation Section */}
        <div className="upload-section">
  <h3>Upload and Validate Receipt</h3>
  <div {...getRootProps({ className: "dropzone" })}>
    <input {...getInputProps()} />
    <p>Drag & drop a receipt, or click to select one</p>
  </div>
  {receiptFile && <p>File selected: {receiptFile.name}</p>}
  <button onClick={handleFileUpload} className="upload-btn">
    Upload and Validate Receipt
  </button>
  {validationResult && <p className="result">{validationResult}</p>}
</div>


        {/* Disaster Tracker Section */}
        <h3>Real-Time Natural Disaster Locations</h3>
        {loading ? (
          <p>Loading disaster data...</p>
        ) : disasterLocations.length > 0 ? (
          <Slider {...sliderSettings} className="slider">
            {disasterLocations.map((location, index) => (
              <div key={index} className="slide-item">
                <div className="location-card">
                  <h3>{location}</h3>
                  <p>Reported disaster location</p>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p>No disaster locations found.</p>
        )}
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} StellerShine. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
