import Image from 'next/image';

export function AuthBackground() {
  return (
    <Image
      src="/assets/login/login-background.webp"
      alt=""
      fill
      sizes="100vw"
      preload
      unoptimized
      className="-z-20 object-cover object-center"
    />
  );
}
