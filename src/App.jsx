import { useRef, useState } from "react";
import "./App.css";
import ToJyutping from "to-jyutping";
import pinyin from "pinyin";

function App() {
  const initialLyrics = "我是一隻小小鳥";
  const initialConvertedLyrics = ToJyutping.getJyutpingList(initialLyrics);
  const [convertedLyrics, setConvertedLyrics] = useState(
    initialConvertedLyrics,
  );
  const lyricsInputRef = useRef();

  const onConvertJyutping = () => {
    const jyutpingList = ToJyutping.getJyutpingList(
      lyricsInputRef.current.value,
    );
    setConvertedLyrics(jyutpingList);
  };
  const onConvertPinyin = () => {
    const pinyinListRaw = pinyin(lyricsInputRef.current.value)
      .flatMap(([py]) => py.replace("\n", ""))
      .map((py) => (py === "" ? "\n" : py));
    const pinyinList = pinyinListRaw.map((py, i) => {
      const char = lyricsInputRef.current.value[i];
      const pinyin = char in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] ? py : py;
      return [lyricsInputRef.current.value[i], pinyin];
    });
    setConvertedLyrics(pinyinList);
  };

  return (
    <div className="container">
      <textarea
        ref={lyricsInputRef}
        id="lyrics-input"
        value={initialLyrics}
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
