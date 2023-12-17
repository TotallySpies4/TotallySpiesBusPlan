export const Legend = () => {
  return (
    <div className="legend-board">
      <strong className="text-center">Congestion level</strong>
      <div className="status normal">
        <div className="line bg-[#88c36c]" />
        <div className="title">Normal</div>
      </div>
      <div className="status low">
        <div className="line bg-[#f5b873]" />
        <div className="title">Low</div>
      </div>
      <div className="status high">
        <div className="line bg-[#ff7070]" />
        <div className="title">High</div>
      </div>
    </div>
  );
};
