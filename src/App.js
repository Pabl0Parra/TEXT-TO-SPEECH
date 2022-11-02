import "./app.css";
import { useEffect, useState } from "react";
import {
  RecordVoiceOverOutlined,
  VoiceOverOff,
  SettingsOutlined,
} from "@mui/icons-material";
import { useSpeechSynthesis } from "react-speech-kit";
import Dialog from "./Dialog";

import { US, ES, IT, JP, DE, AE } from "country-flag-icons/react/3x2";

const App2 = () => {
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

  // allows textarea to grow as you type
  function getScrollHeight(elm) {
    let savedValue = elm.value;
    elm.value = "";
    elm._baseScrollHeight = elm.scrollHeight;
    elm.value = savedValue;
  }

  const onExpandableTextareaInput = ({ target: elm }) => {
    // make sure the input event originated from a textarea and it's desired to be auto-expandable
    if (!elm.classList.contains("autoExpand") || !elm.nodeName === "TEXTAREA")
      return;

    let minRows = elm.getAttribute("data-min-rows") | 0,
      rows;
    !elm._baseScrollHeight && getScrollHeight(elm);

    elm.rows = minRows;
    rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 16);
    elm.rows = minRows + rows;
  };

  // global delegated event listener
  document.addEventListener("input", onExpandableTextareaInput);

  // setting highlightedText state when text has been highlighted
  useEffect(() => {
    document.addEventListener("mouseup", handleTextSet);
    return () => {
      document.removeEventListener("mouseup", handleTextSet);
    };
  }, []);

  return (
    <div className="container register">
      <div className="row">
        <div className="col-md-3 register-left">
          <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
          <h3>Welcome to VoiceOver</h3>
          <p className="slogan">Where the highlighted text speaks</p>
        </div>
        <div className="col-md-9 register-right">
          <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="home-tab"
                data-toggle="tab"
                href="#home"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Read text
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="profile-tab"
                data-toggle="tab"
                href="#profile"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Type text
              </a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <h3 className="register-heading">
                Highlight the text, choose language & press play
              </h3>
              <div className="row register-form">
                <div className="col-md-12">
                  <div className="form-group">
                    <p>
                      <US className="flag" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                  <div className="form-group">
                    <p>
                      <ES className="flag" />
                      Lorem Ipsum ha sido el texto ficticio estándar de la
                      industria desde el siglo XVI,
                    </p>
                  </div>
                  <div className="form-group">
                    <p>
                      <IT className="flag" />
                      quando uno stampatore sconosciuto ha preso una cambusa di
                      caratteri e l'ha rimescolata per creare un libro campione
                      di caratteri.
                    </p>
                  </div>
                  <div className="form-group">
                    <p>
                      <DE className="flag" />
                      Sie hat nicht nur fünf Jahrhunderte, sondern auch den
                      Sprung in den elektronischen Satz überstanden und ist im
                      Wesentlichen unverändert geblieben.
                    </p>
                  </div>
                  <div className="form-group">
                    <p>
                      <JP className="flag" />
                      それは 5
                      世紀だけでなく、電子組版への飛躍にも生き残り、本質的に変わっていません。
                    </p>
                  </div>
                  <div className="form-group">
                    <p>
                      <AE className="flag" />
                      نحن نختبر حتى يتمكن الجميع من استخدامه وبالتالي مساعدة
                      المزيد من المجتمعات
                    </p>
                  </div>
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
                      <SettingsOutlined
                        onClick={() => setShowSpeechSettings(true)}
                      />
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
                        className="settings-width"
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
              </div>
            </div>
            <div
              className="tab-pane fade show"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <h3 className="register-heading">
                Write a message, highlight it and choose a language
              </h3>
              <div className="row register-form">
                <div className="col-md-12">
                  <div className="form-group">
                    <textarea
                      class="autoExpand"
                      rows="3"
                      data-min-rows="3"
                      placeholder="Write your message or text..."
                      autofocus
                    ></textarea>
                  </div>
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
                      <SettingsOutlined
                        onClick={() => setShowSpeechSettings(true)}
                      />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App2;
