import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-16 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/stackpilot_logo.svg"
              alt="StackPilot"
              width={150}
              height={45}
              className="h-32 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="text-sm text-gray-600 font-medium">
            © 2024 StackPilot. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm">
            <Link
              href="#"
              className="text-gray-600 hover:text-orange-600 cursor-pointer font-medium transition-colors duration-300 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-orange-600 cursor-pointer font-medium transition-colors duration-300 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-orange-600 cursor-pointer font-medium transition-colors duration-300 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
