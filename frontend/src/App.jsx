import { useMemo, useState } from "react";
import "./App.css";

// Render/Vite backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Translations ───────────────────────────────────────────────────────────
const t = {
  en: {
    eyebrow: "AI Plant Health Assistant",
    heading1: "Potato Disease",
    heading2: "Classifier",
    subtitle:
      "Upload a potato leaf image and get an instant AI-powered prediction for Early Blight, Late Blight, or a Healthy leaf condition.",
    chooseFile: "Choose a leaf image",
    uploadHint: "Click to upload a JPG, PNG or any image file.",
    predict: "Predict Disease",
    predicting: "Predicting…",
    reset: "Reset",
    previewTitle: "Leaf Preview",
    noImage: "No image selected yet",
    resultTitle: "Prediction Result",
    analyzing: "Analysing leaf image…",
    placeholder: "Upload an image and click Predict to see the result.",
    condition: "Predicted Condition",
    confidence: "Confidence Score",
    confidenceLow: "Low confidence",
    confidenceMid: "Moderate confidence",
    confidenceHigh: "High confidence",
    errorImage: "Please upload a valid image file.",
    errorNoFile: "Please upload an image first.",
    errorFetch: "Failed to fetch prediction from backend.",
    errorGeneric: "Something went wrong.",
    lang: "हिन्दी",
    classes: {
      "Early Blight": "Early Blight",
      "Late Blight": "Late Blight",
      Healthy: "Healthy",
    },
  },
  hi: {
    eyebrow: "AI पौधा स्वास्थ्य सहायक",
    heading1: "आलू रोग",
    heading2: "क्लासिफायर",
    subtitle:
      "एक आलू की पत्ती की तस्वीर अपलोड करें और अर्ली ब्लाइट, लेट ब्लाइट या स्वस्थ पत्ती की स्थिति के लिए तुरंत AI-पूर्वानुमान प्राप्त करें।",
    chooseFile: "पत्ती की छवि चुनें",
    uploadHint: "JPG, PNG या कोई भी इमेज फ़ाइल अपलोड करने के लिए क्लिक करें।",
    predict: "रोग पहचानें",
    predicting: "पहचान हो रही है…",
    reset: "रीसेट करें",
    previewTitle: "पत्ती पूर्वावलोकन",
    noImage: "अभी तक कोई छवि नहीं चुनी गई",
    resultTitle: "पूर्वानुमान परिणाम",
    analyzing: "पत्ती की छवि विश्लेषण हो रही है…",
    placeholder: "परिणाम देखने के लिए छवि अपलोड करें और पहचानें पर क्लिक करें।",
    condition: "पूर्वानुमानित स्थिति",
    confidence: "विश्वास स्कोर",
    confidenceLow: "कम विश्वास",
    confidenceMid: "मध्यम विश्वास",
    confidenceHigh: "उच्च विश्वास",
    errorImage: "कृपया एक वैध छवि फ़ाइल अपलोड करें।",
    errorNoFile: "कृपया पहले एक छवि अपलोड करें।",
    errorFetch: "बैकएंड से पूर्वानुमान प्राप्त नहीं हो सका।",
    errorGeneric: "कुछ गलत हो गया।",
    lang: "English",
    classes: {
      "Early Blight": "अर्ली ब्लाइट (आरंभिक झुलसा)",
      "Late Blight": "लेट ब्लाइट (पछेती झुलसा)",
      Healthy: "स्वस्थ पत्ती",
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatClassName = (className, lang) => {
  if (!className) return "";
  const normalized = className
    .replace("Potato___", "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return t[lang]?.classes?.[normalized] ?? normalized;
};

const getConfidenceLevel = (pct) => {
  if (pct < 50) return "low";
  if (pct < 80) return "mid";
  return "high";
};

// ─── Component ───────────────────────────────────────────────────────────────
function App() {
  const [lang, setLang] = useState("en");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tx = t[lang];

  const confidencePercent = useMemo(() => {
    if (!result?.confidence) return 0;
    return parseFloat((result.confidence * 100).toFixed(2));
  }, [result]);

  const confidenceLevel = useMemo(
    () => getConfidenceLevel(confidencePercent),
    [confidencePercent]
  );

  const confidenceLabel = useMemo(() => {
    if (confidenceLevel === "low") return tx.confidenceLow;
    if (confidenceLevel === "mid") return tx.confidenceMid;
    return tx.confidenceHigh;
  }, [confidenceLevel, tx]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(tx.errorImage);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError(tx.errorNoFile);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.detail || tx.errorFetch);
      }

      setResult(data);
    } catch (err) {
      setError(err.message || tx.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  };

  const getBadgeClass = () => {
    if (!result?.class) return "badge";
    return result.class.toLowerCase().includes("healthy")
      ? "badge healthy"
      : "badge disease";
  };

  return (
    <div className="page">
      <div className="container">
        <div className="left-panel">
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => {
                setLang("en");
                setError("");
              }}
            >
              English
            </button>
            <button
              className={`lang-btn ${lang === "hi" ? "active" : ""}`}
              onClick={() => {
                setLang("hi");
                setError("");
              }}
            >
              हिन्दी
            </button>
          </div>

          <p className="eyebrow">{tx.eyebrow}</p>

          <h1>
            <em>{tx.heading1}</em>
            <br />
            {tx.heading2}
          </h1>

          <p className="subtitle">{tx.subtitle}</p>

          <label className="upload-box">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <div className="upload-content">
              <span className="upload-icon">🌿</span>
              <h3>{selectedFile ? selectedFile.name : tx.chooseFile}</h3>
              <p>{tx.uploadHint}</p>
            </div>
          </label>

          <div className="button-row">
            <button
              className="primary-btn"
              onClick={handlePredict}
              disabled={loading || !selectedFile}
            >
              {loading ? tx.predicting : tx.predict}
            </button>
            <button
              className="secondary-btn"
              onClick={handleReset}
              disabled={loading}
            >
              {tx.reset}
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}
        </div>

        <div className="right-panel">
          <div className="preview-card">
            <h2>{tx.previewTitle}</h2>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded leaf"
                className="preview-image"
              />
            ) : (
              <div className="empty-preview">
                <span className="empty-icon">🍃</span>
                <p>{tx.noImage}</p>
              </div>
            )}
          </div>

          <div className="result-card">
            <h2>{tx.resultTitle}</h2>

            {loading && (
              <div className="loading-box">
                <div className="spinner" />
                <p>{tx.analyzing}</p>
              </div>
            )}

            {!loading && !result && (
              <p className="result-placeholder">{tx.placeholder}</p>
            )}

            {!loading && result && (
              <div className="result-content">
                <span className={getBadgeClass()}>
                  {formatClassName(result.class, lang)}
                </span>

                <hr className="result-divider" />

                <div className="result-item">
                  <p className="label">{tx.condition}</p>
                  <p className="value">{formatClassName(result.class, lang)}</p>
                </div>

                <div className="result-item">
                  <p className="label">{tx.confidence}</p>
                  <p className="value">{confidencePercent}%</p>
                </div>

                <div className="progress-wrapper">
                  <div className="progress-label">
                    <span>{confidenceLabel}</span>
                    <span>{confidencePercent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${confidenceLevel}`}
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;