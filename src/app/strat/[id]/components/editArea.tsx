import { EditAreaColumn } from './editAreaColumn';

export const EditArea = ({ job }: { job: number }) => {
  const skills = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <ul className="h-[1600px] border-x-2 flex">
        {skills.map((skill, index) => (
          <EditAreaColumn key={index} job={job} />
        ))}
      </ul>
    </div>
  );
};
