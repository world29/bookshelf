import "../../styles/Progress.css";

interface ProgressProp {
  active: boolean;
  value: number;
}

export default function Progress(props: ProgressProp) {
  const { active, value } = props;

  return (
    <div
      className={`my-progress-container ${active ? "my-progress-active" : ""}`}
    >
      <div className="my-progress-bar">
        <div
          className="my-progress-bar-fill"
          style={{ width: `${value * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
