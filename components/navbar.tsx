import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex flex-row gap-2.5 justify-items-center-safe z-10 pt-2.5 px-2.5 bg-black/50 backdrop-blur-md">
      <ul className="flex flex-row gap-2.5">
        {/* Logo */}
        <li className="text-1xl">
          <Link href="">Logo</Link>
        </li>
        {/* ข้อมูลต่างๆ */}
        <li className="text-1xl">
          <Link href="">หน้าแรก</Link>
        </li>
        <li className="text-1xl">
          <Link href="">หนังใหม่</Link>
        </li>
      </ul>

    </nav>
  );
}
