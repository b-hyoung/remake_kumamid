import React from 'react';
import Image from 'next/image';
import designersData from '../../../constants/designers.json';

type Designer = {
  id: string;
  name: string;
  imageUrl: string;
};

type DesignersData = Record<string, Designer[]>;

const designers: DesignersData = designersData;

export default function DesignerDetailPage({ params, searchParams }: { params: { id: string }, searchParams: { year: string } }) {
  const { id } = params;
  const { year } = searchParams;

  const designer = designers[year]?.find((d) => d.id === id);

  if (!designer) {
    return (
      <div className="container mx-auto pt-[120px] text-center">
        <h1 className="text-2xl">디자이너를 찾을 수 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-[120px]">
      <div className="flex flex-col items-center p-8">
        <div className="relative w-full max-w-sm h-auto mb-8">
          <Image
            src={designer.imageUrl}
            alt={`${designer.name}_프로필`}
            width={500}
            height={750}
            className="object-cover rounded-xl"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">{designer.name}</h1>
        <p className="text-lg text-gray-500">{year}</p>
      </div>
    </div>
  );
}
