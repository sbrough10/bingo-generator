export type TileProps = {
  text: string;
  isChecked: boolean;
  onClick: (text: string, becomesChecked: boolean) => void;
};

export const Tile = ({ text, isChecked, onClick }: TileProps) => {
  return (
    <td className={`tile ${isChecked ? "checked" : ""}`}>
      <button onClick={onClick.bind(null, text, !isChecked)}>{text}</button>
    </td>
  );
};
