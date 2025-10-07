import logo from "@/assets/logo.jpg";
import Image from "next/image";

export const Logo = () => (
  <Image
    width={96}
    height={32}
    className="w-[96px] h-auto"
    src={logo}
    alt="Company Logo"
  ></Image>
);
