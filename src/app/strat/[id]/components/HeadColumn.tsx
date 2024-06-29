import { type Enums } from '@/lib/database.types';
import { type ActionDataType } from '@/lib/queries/server';
import Image from 'next/legacy/image';
import { columnWidth, columnWidthLarge } from './coreAreaConstants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line
const iconFilenameToURL = (job: Enums<'job'>, iconFilename: string | null) => {
  if (!iconFilename) return null;
  return `https://jbgcbfblivbtdnhbkfab.supabase.co/storage/v1/object/public/icons/${job}/${iconFilename}.png`;
};

const HeadSubColumn = ({
  job,
  name,
  iconFilename,
}: {
  job: Enums<'job'>;
  name: string;
  iconFilename: string | null; // eslint-disable-line
}) => {
  const src = iconFilenameToURL(job, iconFilename);

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} ${columnWidthLarge} overflow-hidden justify-center items-end relative`}
    >
      <Tooltip>
        <div className="aspect-square relative w-full">
          <TooltipTrigger asChild>
            <Button variant="ghost" className="w-auto h-auto cursor-default">
              {src && <Image src={src} alt={name} layout="fill" objectFit="contain" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="pointer-events-none">{name}</TooltipContent>
        </div>
      </Tooltip>
    </div>
  );
};

export const HeadColumn = ({ job, actions }: { job: Enums<'job'>; actions: ActionDataType }) => (
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
    <div className="flex space-x-1">
      {actions.map((action) => (
        <HeadSubColumn
          key={`subcolumn-header-${action.id}`}
          job={job}
          name={action.name}
          iconFilename={action.icon_filename}
        />
      ))}
    </div>
  </div>
);
