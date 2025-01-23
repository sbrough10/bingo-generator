import { useEffect, useState } from "react";
import "./App.css";
import { Tile } from "./Tile";

const TILE_SELECTION_QUERY_PARAM = "board";
const TILE_OPTIONS_STORAGE_ITEM = "options";

const setTileSelectionInUrl = (tileSelections: number[]) => {
  const url = new URL(window.location.href);
  const encodedSelectionString = btoa(String.fromCharCode(...tileSelections));
  url.searchParams.set(TILE_SELECTION_QUERY_PARAM, encodedSelectionString);
  window.history.pushState({}, "", url);
};

const getTileSelectionFromUrl = () => {
  const url = new URL(window.location.href);
  const encodedSelectionString = url.searchParams.get(
    TILE_SELECTION_QUERY_PARAM
  );
  if (encodedSelectionString) {
    return atob(encodedSelectionString)
      .split("")
      .map((char) => {
        return char.charCodeAt(0);
      });
  }
  return [];
};

const getTileOptionsFromStorage = () => {
  return (
    window.localStorage.getItem(TILE_OPTIONS_STORAGE_ITEM)?.split("\n") ?? []
  );
};

function App() {
  const [tileOptions, setTileOptions] = useState<string[]>(
    getTileOptionsFromStorage()
  );
  const [tileSelections, setTileSelections] = useState<number[]>(
    getTileSelectionFromUrl()
  );

  useEffect(() => {
    window.localStorage.setItem(
      TILE_OPTIONS_STORAGE_ITEM,
      tileOptions.join("\n")
    );
  }, [tileOptions]);

  useEffect(() => {
    const handler = () => {
      setTileSelections(getTileSelectionFromUrl());
    };
    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  useEffect(() => {
    if (tileSelections.length > 0) {
      return;
    }
    const unpickedOptions = Array.from(
      { length: tileOptions.length },
      (value, index) => {
        return index;
      }
    );

    const pickedOptions: number[] = [];

    for (let i = 0; i < 24; i++) {
      const pickedIndex = Math.floor(Math.random() * unpickedOptions.length);
      const pickedOption = unpickedOptions.splice(pickedIndex, 1)[0];
      pickedOptions.push(pickedOption);
    }

    setTileSelections(pickedOptions);
    setTileSelectionInUrl(pickedOptions);
  }, [tileSelections, tileOptions.join(",")]);

  const getTileText = (index: number) =>
    tileOptions[tileSelections[index]]?.split("\t") ?? [];

  const onClickTile = (text: string, becomesChecked: boolean) => {
    const optionIndex = tileOptions.findIndex(
      (option) => option.split("\t")[0] === text
    );
    const newTileOptions = [...tileOptions];
    newTileOptions[optionIndex] = `${text}\t${becomesChecked ? "✅" : ""}`;
    setTileOptions(newTileOptions);
  };

  const getTile = (index: number) => {
    const [optionText, isChecked] = getTileText(index);
    return (
      <Tile text={optionText} isChecked={!!isChecked} onClick={onClickTile} />
    );
  };

  const onUpdateOptions: React.ChangeEventHandler<HTMLTextAreaElement> = (
    ev
  ) => {
    const text = ev.target.value;
    setTileOptions(text.split("\n"));
  };

  const resetSelectedTiles = () => {
    setTileSelections([]);
  };

  return (
    <>
      <div className="board-wrapper">
        <table className="bingo-board">
          <tr className="row">
            <td className="tile">B</td>
            <td className="tile">I</td>
            <td className="tile">N</td>
            <td className="tile">G</td>
            <td className="tile">O</td>
          </tr>
          <tr className="row">
            {getTile(0)}
            {getTile(1)}
            {getTile(2)}
            {getTile(3)}
            {getTile(4)}
          </tr>
          <tr className="row">
            {getTile(5)}
            {getTile(6)}
            {getTile(7)}
            {getTile(8)}
            {getTile(9)}
          </tr>
          <tr className="row">
            {getTile(10)}
            {getTile(11)}
            <Tile
              text="Makes it to inauguration"
              isChecked={true}
              onClick={() => {}}
            />
            {getTile(12)}
            {getTile(13)}
          </tr>
          <tr className="row">
            {getTile(14)}
            {getTile(15)}
            {getTile(16)}
            {getTile(17)}
            {getTile(18)}
          </tr>
          <tr className="row">
            {getTile(19)}
            {getTile(20)}
            {getTile(21)}
            {getTile(22)}
            {getTile(23)}
          </tr>
        </table>
        <div className="input-wrapper">
          <textarea className="options-input" onChange={onUpdateOptions}>
            {tileOptions.join("\n")}
          </textarea>
          <button onClick={resetSelectedTiles}>Reset</button>
        </div>
      </div>
    </>
  );
}

export default App;
