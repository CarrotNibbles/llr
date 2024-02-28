import { type Enums } from '@/lib/database.types';
import { columnWidth, columnWidthLarge, type JobTemp, type SkillTemp } from './coreAreaConstants';
import { type AbilityDataType } from '@/lib/queries';
import { type ArrayElement } from '@/lib/utils';
import Image from 'next/image';

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
    className={`flex flex-shrink-0 w-${columnWidth} lg:w-${columnWidthLarge} overflow-hidden flex justify-center items-center`}
  >
    {iconURL && <Image src={iconURL} alt={name} width={100} height={100} />}
  </div>
);

export const HeadColumn = ({
  job,
  abilities,
}: {
  job: Enums<'job'>;
  abilities: AbilityDataType;
}) => (
  <div className="p-1 border-r-[1px] flex flex-col-reverse">
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
