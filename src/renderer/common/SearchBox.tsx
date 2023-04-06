import "../styles/SearchBox.css";

type Props = {
  onSearch: (query: string) => void;
};

export const SearchBox = (props: Props) => {
  const { onSearch } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="searchBox">
      <input type="text" onChange={handleChange} placeholder="Search..." />
    </div>
  );
};
