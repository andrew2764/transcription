import { useState } from "react";
import "./App.css";
import ToJyutping from "to-jyutping";
import pinyin from "pinyin";

function App() {
  const initialLyrics = "吾能助君註粵漢音，譯華為英";
  const [lyrics, setLyrics] = useState(initialLyrics);
  const initialConvertedLyrics = ToJyutping.getJyutpingList(initialLyrics);
  const [convertedLyrics, setConvertedLyrics] = useState(
    initialConvertedLyrics,
  );

  const onConvertJyutping = () => {
    const jyutpingList = ToJyutping.getJyutpingList(lyrics);
    setConvertedLyrics(jyutpingList);
  };
  const onConvertPinyin = () => {
    const pinyinList = lyrics.split('').map((han) => {
      return [han, pinyin(han)[0][0]]
    })
    setConvertedLyrics(pinyinList);
  };

  return (
    <>
      <h1>Phonetic Planet</h1>
      <div className="container">
        <textarea
          id="lyrics-input"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows="10"
        ></textarea>
        <section>
          {convertedLyrics.map(([char, jp], i) => {
            if (char === "\n") return <br key={i} />;

            return (
              <span key={i} className="character">
                <div className="jp">{jp}</div>
                <div className="char">{char}</div>
              </span>
            );
          })}
        </section>

        <div className="button-group">
          <button onClick={onConvertJyutping}>Jyutping</button>
          <button onClick={onConvertPinyin}>Pinyin</button>
        </div>
      </div>
    </>
  );
}

export default App;
