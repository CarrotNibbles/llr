import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Database } from '@/lib/database.types';
import { LikeButton } from './components/LikeButton';

type StrategyCardProps = Database['public']['Tables']['strategies']['Row'] & {
  jobs: Array<Database['public']['Enums']['job']>;
};

export function StrategyCard(props: StrategyCardProps) {
  return (
    <Card className="text-xs hover:drop-shadow-xl md:text-base">
      <CardHeader className="flex-col justify-between space-y-0 p-4 md:p-6">
        <CardTitle className="md:text-xl text-base">{props.name}</CardTitle>
        <CardDescription className="md:text-base text-xs">
          Composed By {props.author}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 pl-4 md:pb-6 md:pl-6">
        <div className="w-full items-center flex flex-row space-x-2">
          {props.jobs.map((job, index) => (
            <text key={index}>{job}</text>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-row justify-between pb-3 pl-4 pr-4 md:pb-6 md:pl-6 md:pr-6">
        <CardDescription className="md:text-sm text-xs">
          {props.created_at === props.modified_at
            ? `Created@${props.created_at}`
            : `Modified@${props.modified_at}`}
        </CardDescription>
        <LikeButton likes={props.likes} />
      </CardFooter>
    </Card>
  );
}
