import { type Enums } from '@/lib/database.types';
import { type AbilityDataType } from '@/lib/queries/server';
import Image from 'next/legacy/image';
import { columnWidth, columnWidthLarge } from './coreAreaConstants';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const HeadSubColumn = ({
  job,
  name,
  iconURL,
}: {
  job: Enums<'job'>;
  name: string;
  iconURL: string | null; // eslint-disable-line
}) => (
  <div
    className={`flex flex-shrink-0 ${columnWidth} ${columnWidthLarge} overflow-hidden justify-center items-end relative`}
  >
    <div className="aspect-square relative w-full">
      {iconURL && <Image src={iconURL} alt={name} layout="fill" objectFit="contain" />}
    </div>
  </div>
);

export const HeadColumn = ({
  job,
  abilities,
}: {
  job: Enums<'job'>;
  abilities: AbilityDataType;
}) => (
  <div className="flex flex-col p-1 border-r-[1px] justify-center items-center space-y-1">
    <div className="flex flex-grow relative">
      <div className={`aspect-square relative ${columnWidth} ${columnWidthLarge} saturate-0`}>
        <Image
          src={`/icons/${job}.png`}
          alt={`Job Icon of ${job}`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
    <div className="flex">
      {abilities.map((ability) => (
        <HeadSubColumn
          key={`subcolumn-header-${ability.id}`}
          job={job}
          name={ability.name}
          iconURL={ability.icon_url}
        />
      ))}
    </div>
  </div>
);
