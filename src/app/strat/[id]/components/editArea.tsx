import { EditAreaColumn } from './editAreaColumn';

export const EditArea = ({ job }: { job: number }) => (
  <div>
    <ul className="h-[1600px] border-x-2 grid grid-rows-1 grid-cols-4">
      <EditAreaColumn key={0} job={job} />
      <EditAreaColumn key={1} job={job} />
      <EditAreaColumn key={2} job={job} />
      <EditAreaColumn key={3} job={job} />
    </ul>
  </div>
);
