'use client';

interface PulseLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function PulseLogo({ size = 40, showText = true, className = '' }: PulseLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* ECG Waveform Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="flex-shrink-0"
        aria-label="PULSE Logo"
      >
        {/* ECG Waveform - QRS Complex (更接近圖片中的設計) */}
        <path
          d="M 15 50 
             L 25 50 
             L 28 48 
             L 32 25 
             L 38 75 
             L 42 50 
             L 85 50"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      
      {/* PULSE Text */}
      {showText && (
        <span className="font-bold tracking-tight" style={{ fontSize: `${size * 0.45}px`, letterSpacing: '-0.5px' }}>
          PULSE
        </span>
      )}
    </div>
  );
}

