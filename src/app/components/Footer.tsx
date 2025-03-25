import Link from "next/link";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

export function Footer() {
  return (
    <div className="flex flex-row gap-4 mt-30 justify-center">
      <div className="flex gap-4 align-middle items-center text-sm text-neutral-500">
        <Link
          className="hover:text-neutral-700 dark:hover:text-neutral-300"
          href="https://x.com/jasonlaster11"
          aria-label="Twitter"
        >
          <FaXTwitter />
        </Link>
        <Link
          className="hover:text-neutral-700 dark:hover:text-neutral-300"
          href="https://github.com/jasonlaster"
          aria-label="GitHub"
        >
          <FaGithub />
        </Link>

        <Link
          className="hover:text-neutral-700 dark:hover:text-neutral-300"
          href="https://www.linkedin.com/in/jason-laster-6657167/"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </Link>
      </div>
    </div>
  );
}
