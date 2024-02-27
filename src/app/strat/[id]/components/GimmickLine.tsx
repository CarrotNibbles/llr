type GimmkLineProps = {
  castAt: number;
  prepareAt: number;
  zoom: number;
  textColor: string;
  borderColor: string;
  resizePanelSize: number;
  name: string;
};

export const GimmickLine = ({
  castAt,
  prepareAt,
  zoom,
  textColor,
  borderColor,
  resizePanelSize,
  name,
}: GimmkLineProps) => {
  return (
    castAt &&
    Math.abs(castAt - prepareAt) > 5 / zoom && (
      <>
        <div
          className={`absolute border-0 border-t ${borderColor}  right-0 border-dashed z-10`}
          style={{ top: `${zoom * castAt}px`, width: `${resizePanelSize}vw` }}
        />
        {Math.abs(castAt - prepareAt) > 10 / zoom && (
          <div
            className={`absolute ${textColor} text-xs z-10 right-0`}
            style={{
              top: `${zoom * castAt}px`,
            }}
          >
            <text className="text-xs font-thin right-0">{name}</text>
          </div>
        )}
      </>
    )
  );
};
