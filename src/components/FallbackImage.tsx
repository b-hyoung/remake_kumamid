"use client";
import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

const FallbackImage = (props: { src: string, alt: string, className?: string } & Omit<ImageProps, 'src' | 'alt'>) => {
    const { src, alt, className, ...rest } = props;
    const [isError, setIsError] = useState(!src);
    useEffect(() => { setIsError(!src); }, [src]);

    if (isError) {
        const placeholderClass = props.fill ? 'absolute inset-0' : '';
        return (
            <div className={`bg-[#1e1e1e] flex items-center justify-center animate-shimmer ${className} ${placeholderClass}`}>
                <span className="text-sm font-medium text-gray-500">준비중...</span>
            </div>
        );
    }
    return <Image src={src || ""} alt={alt} className={className} onError={() => setIsError(true)} unoptimized {...rest} />;
};

export default FallbackImage;
