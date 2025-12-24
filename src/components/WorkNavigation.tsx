import Link from 'next/link';
import React from 'react';

interface Work {
    id: string;
}

interface WorkNavigationProps {
    allWorks: Work[];
    currentWorkId: string;
    year: string;
    basePath: 'post' | 'video';
    children: React.ReactNode;
}

const WorkNavigation = ({ allWorks, currentWorkId, year, basePath, children }: WorkNavigationProps) => {
    const currentIndex = allWorks.findIndex(work => work.id === currentWorkId);

    const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
    const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

    const arrowClass = "text-white text-4xl font-bold opacity-50 hover:opacity-100 transition-opacity";

    return (
        <section className="text-center text-gray-500 text-sm">
            <div className="border-t border-gray-700 max-w-4xl mx-auto my-10"></div>
            <div className="w-full max-w-5xl mx-auto flex justify-center items-center px-4 gap-4">
                {prevWork ? (
                    <Link href={`/works/${basePath}/${prevWork.id}?year=${year}`} className={arrowClass}>
                        &#10094;
                    </Link>
                ) : (
                    <div className="w-10 h-10"></div> // Placeholder
                )}

                <div className="grow">
                    {children}
                </div>

                {nextWork ? (
                    <Link href={`/works/${basePath}/${nextWork.id}?year=${year}`} className={arrowClass}>
                        &#10095;
                    </Link>
                ) : (
                    <div className="w-10 h-10"></div> // Placeholder
                )}
            </div>
            <div className="border-t border-gray-700 max-w-4xl mx-auto my-10"></div>
        </section>
    );
};

export default WorkNavigation;
