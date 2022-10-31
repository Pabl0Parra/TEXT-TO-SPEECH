import "./app.css";
import { useEffect, useState } from "react";
import {
  RecordVoiceOverOutlined,
  VoiceOverOff,
  SettingsOutlined,
} from "@mui/icons-material";
import { useSpeechSynthesis } from "react-speech-kit";
import Dialog from "./Dialog";

const App = () => {
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  const onEnd = () => {
    setHighlightedText("");
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  const voice = voices[voiceIndex] || null;

  const handleTextSet = () => {
    const text = window.getSelection().toString();
    if (text !== "") setHighlightedText(text);
  };

  // setting highlightedText state when text has been highlighted
  useEffect(() => {
    document.addEventListener("mouseup", handleTextSet);
    return () => {
      document.removeEventListener("mouseup", handleTextSet);
    };
  }, []);

  return (
    <div className="app">
      <h1>Text to Speech</h1>
      <span>
        Highligh text and click the speack icon to listen to highlighted text
      </span>

      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum ha sido el texto ficticio estándar de la industria
        desde el siglo XVI, quando uno stampatore sconosciuto ha preso una
        cambusa di caratteri e l'ha rimescolata per creare un libro campione di
        caratteri. それは 5
        世紀だけでなく、電子組版への飛躍にも生き残り、本質的に変わっていません。
        Sie hat nicht nur fünf Jahrhunderte, sondern auch den Sprung in den
        elektronischen Satz überstanden und ist im Wesentlichen unverändert
        geblieben.
      </p>

      {supported && (
        <div className="speechMenu">
          {!speaking ? (
            <RecordVoiceOverOutlined
              onClick={() =>
                speak({ text: highlightedText, voice, rate, pitch })
              }
            />
          ) : (
            <VoiceOverOff onClick={cancel} />
          )}
          <SettingsOutlined onClick={() => setShowSpeechSettings(true)} />
        </div>
      )}

      <Dialog
        open={showSpeechSettings}
        onClose={() => setShowSpeechSettings(false)}
      >
        <div className="speechSettings">
          {/* VOices -- browser dependent */}
          <select
            name="voice"
            value={voiceIndex || ""}
            onChange={(e) => {
              setVoiceIndex(e.target.value);
            }}
          >
            {voices.map((option, index) => (
              <option key={option.voiceURI} value={index}>
                {`${option.lang} - ${option.name} ${
                  option.default ? "- Default" : ""
                }`}
              </option>
            ))}
          </select>
          <div className="rangeContainer">
            <div>
              <label htmlFor="rate">Rate: </label>
              <span>{rate}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
              }}
            />
          </div>
          <div className="rangeContainer">
            <div>
              <label htmlFor="pitch">Pitch: </label>
              <span>{pitch}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              id="pitch"
              onChange={(event) => {
                setPitch(event.target.value);
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default App;
