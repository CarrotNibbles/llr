type GimmickLineProps = {
  time: number;
  primaryTime: number;
  isPrimary: boolean;
  zoom: number;
  textColor: string;
  borderColor: string;
  resizePanelSize: number;
  name: string;
};

export const GimmickLine = ({
  time,
  primaryTime,
  isPrimary,
  zoom,
  textColor,
  borderColor,
  resizePanelSize,
  name,
}: GimmickLineProps) => {
  return (
    time &&
    Math.abs(time - primaryTime) > 5 / zoom && (
      <>
        <div
          className={`absolute border-0 border-t ${borderColor}  right-0 border-dashed z-10`}
          style={{ top: `${zoom * time}px`, width: `${resizePanelSize}vw` }}
        />
        {Math.abs(time - primaryTime) > 10 / zoom && (
          <div
            className={`absolute ${textColor} text-xs z-10 right-0`}
            style={{
              top: `${zoom * time}px`,
            }}
          >
            <text className="text-xs font-thin right-0">{name}</text>
          </div>
        )}
      </>
    )
  );
};
