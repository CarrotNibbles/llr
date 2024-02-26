import { Icons } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/myselect';

export function SelectDemo() {
  return (
    <Select defaultValue="P8S-2">
      <SelectTrigger className="text-xl font-bold text-black border-0 shadow-none">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>마의 전당 판데모니움: 천옥편(영웅)</SelectLabel>
          <SelectItem value="P9S">코퀴토스</SelectItem>
          <SelectItem value="P10S">판데모니움</SelectItem>
          <SelectItem value="P11S">테미스</SelectItem>
          <SelectItem value="P12S-1">P12S-1 아테나I</SelectItem>
          <SelectItem value="P12S-2">P12S-2 아테나II</SelectItem>
          <SelectLabel>마의 전당 판데모니움: 연옥편(영웅)</SelectLabel>
          <SelectItem value="P5S">학자 에테르 세개</SelectItem>
          <SelectItem value="P6S">넌 뭐냐</SelectItem>
          <SelectItem value="P7S">나무</SelectItem>
          <SelectItem value="P8S-1">P8S-1 헤파이스토스I</SelectItem>
          <SelectItem value="P8S-2">P8S-2 헤파이스토스II</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const MobileHeader = () => {
  return (
    <div className="md:hidden">
      <div className="flex-row flex items-center justify-between h-full mr-6 ml-4 mt-6 mb-4">
        <SelectDemo />
        <Icons.hambergerMenu className="h-6 w-6" />
      </div>
    </div>
  );
};
