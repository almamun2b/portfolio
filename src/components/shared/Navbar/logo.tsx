import Image from "next/image";

export const Logo = () => (
  <Image
    width={96}
    height={32}
    className="w-auto"
    src="/logo.jpg"
    alt="Company Logo"
  ></Image>
);
