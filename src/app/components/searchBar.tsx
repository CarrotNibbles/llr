import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import React from 'react';

export const SearchBar = () => (
	<div className='flex w-1/2 align-middle items-center space-x-2'>
		<Input type='search' placeholder='보스 및 패턴을 입력하세요' />
		<Button type='submit'>Search</Button>
	</div>
);
