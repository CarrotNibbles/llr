import { columnWidth, columnWidthLarge, type JobTemp, type SkillTemp } from './coreAreaConstants';

const HeadSubColumn = ({ job, skill }: { job: JobTemp; skill: SkillTemp }) => (
  <div
    className={`flex flex-shrink-0 w-${columnWidth} lg:w-${columnWidthLarge} overflow-hidden flex justify-center items-center`}
  >
    새
  </div>
);

export const HeadColumn = ({ job, skills }: { job: JobTemp; skills: SkillTemp[] }) => (
  <div className="px-1 border-r-[1px] grid grid-rows-2">
    <div className="text-center flex justify-center items-center">닌?자</div>
    <div className="flex">
      {skills.map((skill) => (
        <HeadSubColumn key={skill.id} job={job} skill={skill} />
      ))}
    </div>
  </div>
);
