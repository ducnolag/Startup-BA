'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  src: string;
  alt: string;
  emoji: string;
  brand: string;
  gradient: [string, string];
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Product image với fallback 3 tầng:
 * 1. Image load OK → hiển thị bình thường với zoom hover
 * 2. Image fail → gradient + emoji + brand text
 * 3. Loading state → skeleton subtle
 */
export default function ProductImage({
  src,
  alt,
  emoji,
  brand,
  gradient,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const fallbackStyle = {
    background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
  };

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden',
        className
      )}
      style={fallbackStyle}
    >
      {/* Skeleton + fallback (gradient + emoji) luôn hiển thị dưới */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-5xl md:text-6xl opacity-90 select-none"
          aria-hidden
        >
          {emoji}
        </span>
      </div>

      {/* Real image overlay */}
      {status !== 'error' && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'object-cover transition-all duration-700 ease-out',
            status === 'loaded'
              ? 'opacity-100 scale-100 group-hover:scale-105'
              : 'opacity-0 scale-105'
          )}
        />
      )}

      {/* Brand overlay (chỉ khi không có ảnh) */}
      {status === 'error' && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md text-[10px] font-semibold text-ink tracking-wide uppercase">
          {brand}
        </div>
      )}
    </div>
  );
}