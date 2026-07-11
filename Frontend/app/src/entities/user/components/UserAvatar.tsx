import Image from 'next/image';
import type { User } from '../model/types';

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={36}
          height={36}
          className="rounded-full border border-indigo-500/30"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-slate-200">{user.name}</span>
        <span className="text-xs text-slate-400">{user.email}</span>
      </div>
    </div>
  );
}
