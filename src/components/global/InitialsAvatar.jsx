import { getInitials } from '../../utils/theme';

export default function InitialsAvatar({
  name,
  src,
  size = 36,
  className = '',
  bgClass = 'bg-[#0d5c52]',
  textClass = 'text-white',
}) {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-extrabold flex-shrink-0 shadow-sm ${bgClass} ${textClass} ${className}`}
      style={{ width: size, height: size, fontSize: size < 32 ? 10 : 12 }}
      aria-hidden={!name}
    >
      {initials}
    </div>
  );
}

