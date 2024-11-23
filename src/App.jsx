import { useState } from "react";
import "./App.css";
import ToJyutping from "to-jyutping";
import pinyin from "pinyin";

function App() {
  const initialLyrics = "我是一隻小小鳥";
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
    const pinyinListRaw = pinyin(lyrics)
      .flatMap(([py]) => py.replace("\n", ""))
      .map((py) => (py === "" ? "\n" : py));
    const pinyinList = pinyinListRaw.map((py, i) => {
      const char = lyrics[i];
      const pinyin = char in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] ? py : py;
      return [lyrics[i], pinyin];
    });
    setConvertedLyrics(pinyinList);
  };

  return (
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
  );
}

export default App;
