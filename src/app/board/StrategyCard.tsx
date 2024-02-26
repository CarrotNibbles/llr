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
    <Card className="hover:drop-shadow-xl">
      <CardHeader className="flex-row justify-between space-y-0">
        <div className="flex-col">
          <CardTitle className="text-xl">{props.name}</CardTitle>
          <CardDescription>Composed By {props.author}</CardDescription>
        </div>
        <div className="mt-0">
          {/* <Button variant="link" className="p-0 items-start justify-start">
            <Icons.emptyLike className="mr-3 h-5 w-5" />
            {props.likes}
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex flex-row space-x-2">
                {props.jobs.map((job, index) => (
                  <text key={index}>{job}</text>
                ))}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-row justify-between">
        <CardDescription>
          {props.created_at === props.modified_at
            ? `Created@${props.created_at}`
            : `Modified@${props.modified_at}`}
        </CardDescription>
        <LikeButton likes={props.likes} />
      </CardFooter>
    </Card>
  );
}
