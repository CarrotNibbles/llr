type GimmickSubLineProps = {
  time: number;
  primaryTime: number;
  pixelPerFrame: number;
  textColor: string;
  borderColor: string;
  resizePanelSize: number;
  name: string;
  lineType: string;
};

export const GimmickSubLine = ({
  time,
  primaryTime,
  pixelPerFrame,
  textColor,
  borderColor,
  resizePanelSize,
  name,
  lineType,
}: GimmickSubLineProps) => {
  return (
    time &&
    Math.abs(time - primaryTime) * pixelPerFrame > 5 && (
      <>
        <div
          className={`absolute border-0 border-t ${borderColor}  right-0 ${lineType} z-10`}
          style={{ top: `${time * pixelPerFrame}px`, width: `${resizePanelSize}vw` }}
        />
        {Math.abs(time - primaryTime) * pixelPerFrame > 10 && (
          <div
            className={`absolute ${textColor} text-xs z-10 right-0`}
            style={{
              top: `${pixelPerFrame * time}px`,
            }}
          >
            <text className="text-xs font-thin right-0">{name}</text>
          </div>
        )}
      </>
    )
  );
};
