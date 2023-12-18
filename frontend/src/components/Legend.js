export const Legend = () => {
  return (
    <div className="legend-board absolute right-[5px] bottom-[10px] w-[160px] h-[126px]">
      <strong className="text-center">Congestion level</strong>
      <div className="legend-status normal">
        <div className="legend-line bg-[#88c36c]" />
        <div className="legend-title">Normal</div>
      </div>
      <div className="legend-status low">
        <div className="legend-line bg-[#f5b873]" />
        <div className="legend-title">Low</div>
      </div>
      <div className="legend-status high">
        <div className="legend-line bg-[#ff7070]" />
        <div className="legend-title">High</div>
      </div>
    </div>
  );
};
