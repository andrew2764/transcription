import { useState } from "react";
import "./App.css";
import ToJyutping from "to-jyutping";
import pinyin from "pinyin";

const MAX_CHAR_LENGTH = 1500;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function App() {
  const initialLyrics = "吾能助君註粵漢音，譯華為英";
  const normalizeConvertedLyrics = (convertedLyricList) => {
    const result = [];
    let currentGroup = [];
    convertedLyricList.forEach((item) => {
      if (item[0] === "\n") {
        result.push(currentGroup);
        currentGroup = [];
      } else {
        currentGroup.push(item);
      }
    });
    result.push(currentGroup);
    return result;
  };
  
  const [lyrics, setLyrics] = useState(initialLyrics);
  const initialConvertedLyrics = normalizeConvertedLyrics(ToJyutping.getJyutpingList(initialLyrics));
  const [convertedLyrics, setConvertedLyrics] = useState(
    initialConvertedLyrics,
  );
  const [translatedLyrics, setTranslatedLyrics] = useState(['I can help you annotate Cantonese and Chinese pronunciations and translate Chinese into English.']);
  const fetchTranslation = async (_text) => {
    const splitText = _text.split("\n");
    const translatedText = await Promise.all(
      splitText.map(async (line) => {
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}&source=zh&target=en&q=${encodeURIComponent(
            line,
          )}&format=text`,
        );
        const data = await response.json();
        return data.data.translations[0].translatedText;
      }),
    );
    setTranslatedLyrics(translatedText);
  };


  const onConvertJyutping = () => {
    if (lyrics.length > MAX_CHAR_LENGTH) {
      return;
    }
    const jyutpingList = ToJyutping.getJyutpingList(lyrics);
    const nextConvertedLyrics = normalizeConvertedLyrics(jyutpingList);

    setConvertedLyrics(nextConvertedLyrics);
    fetchTranslation(lyrics);
  };
  const onConvertPinyin = () => {
    if (lyrics.length > MAX_CHAR_LENGTH) {
      return;
    }
    const pinyinList = lyrics.split("").map((han) => {
      return [han, pinyin(han)[0][0]];
    });

    const nextConvertedLyrics = normalizeConvertedLyrics(pinyinList);
    setConvertedLyrics(nextConvertedLyrics);
    fetchTranslation(lyrics);
  };

  return (
    <>
      <h1>
        ݁݁<span className="cross">ᛪ༙</span> ִֶָ☾.Phonetic Planet✮⋆˙
      </h1>
      <div className="container">
        <textarea
          id="lyrics-input"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows="10"
        ></textarea>

        <div className="button-group">
          <button onClick={onConvertJyutping}>Jyutping</button>
          <button onClick={onConvertPinyin}>Pinyin</button>
          <button
            onClick={() => {
              setLyrics("");
              setConvertedLyrics([]);
            }}
          >
            Clear
          </button>
        </div>

        <section>
          {convertedLyrics.map((line, i) => {
            if (line.length === 0) return <br key={i} />;
            return (
              <div key={i}>
                {line.map(([char, jp], j) => {
                  return (
                    <span key={j} className="character">
                      <div className="jp">{jp}</div>
                      <div className="char">{char}</div>
                    </span>
                  );
                })}
                <div>{translatedLyrics[i]}</div>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}

export default App;
