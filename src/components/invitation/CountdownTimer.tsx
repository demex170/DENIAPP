import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD
  targetTime?: string; // HH:mm
  customMessage?: string;
  theme?: 'dark' | 'light' | 'luxury';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  targetTime = '12:00',
  customMessage,
  theme = 'light',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${targetDate}T${targetTime}:00`);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  const themeClasses = {
    light: {
      box: 'bg-white/80 border border-stone-200 text-stone-900 shadow-xs',
      number: 'text-stone-900',
      label: 'text-stone-500',
    },
    dark: {
      box: 'bg-stone-900/80 border border-stone-800 text-stone-100 shadow-xs',
      number: 'text-stone-100',
      label: 'text-stone-400',
    },
    luxury: {
      box: 'bg-stone-900/60 backdrop-blur-md border border-amber-500/20 text-stone-50 shadow-md',
      number: 'text-amber-200',
      label: 'text-stone-400',
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  if (timeLeft.isPast) {
    return (
      <div className="py-6 text-center">
        <p className="text-xl sm:text-2xl font-serif-ka font-semibold tracking-wide text-amber-800">
          დღე დადგა! 🎉
        </p>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          ღონისძიება უკვე დაწყებულია ან დასრულდა.
        </p>
      </div>
    );
  }

  const units = [
    { label: 'დღე', value: timeLeft.days },
    { label: 'საათი', value: timeLeft.hours },
    { label: 'წუთი', value: timeLeft.minutes },
    { label: 'წამი', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {customMessage && (
        <p className="text-xs sm:text-sm text-stone-500 mb-4 font-medium tracking-wide uppercase">
          {customMessage}
        </p>
      )}

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md w-full">
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl ${currentTheme.box}`}
          >
            <span className={`text-2xl sm:text-3xl font-display font-semibold tabular-nums leading-none ${currentTheme.number}`}>
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className={`text-[10px] sm:text-xs mt-1.5 uppercase tracking-wider font-medium ${currentTheme.label}`}>
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
