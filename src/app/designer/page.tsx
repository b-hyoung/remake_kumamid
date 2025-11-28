import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import designersData from '../../constants/designers.json';

type Designer = {
  id: string;
  name: string;
  imageUrl: string;
};

type DesignersData = Record<string, Designer[]>;

const designers: DesignersData = designersData;

function DesignerPage() {
  const sortedYears = Object.keys(designers).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="container mx-auto pt-[120px]">
      <h1 className='text-left mb-10 mt-15 text-[30px] font-semibold w-3/4 mx-auto pl-2'>디자이너 목록</h1>
      {sortedYears.map((year) => (
        <section key={year}>
          <div className="flex flex-wrap -mx-4 justify-start align-center w-3/4 mx-auto">
            {designers[year].map((designer) => (
              <div key={designer.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-4 mb-8">
                <Link href={`/designer/${designer.id}?year=${year}`} className="grid-item" data-id={designer.id}>
                  <div className="designer-img-wrap relative w-full h-0 pb-[128.64%] bg-gray-200 rounded-xl overflow-hidden">
                    <Image
                      src={designer.imageUrl}
                      alt={`${designer.name}_프로필`}
                      fill
                      className="img-responsive object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw 50vh"
                    />
                  </div>
                  <h2 className="head_title text-center text-xl mt-3">
                    <span>{designer.name}</span>
                  </h2>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default DesignerPage;