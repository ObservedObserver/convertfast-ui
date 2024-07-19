import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap">
          {/* Company Info */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Company</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a href="/about" className="hover:underline text-gray-600 hover:text-gray-800">
                  About Us
                </a>
              </li>
              <li className="mt-2">
                <a href="/contact" className="hover:underline text-gray-600 hover:text-gray-800">
                  Contact
                </a>
              </li>
              <li className="mt-2">
                <a href="/careers" className="hover:underline text-gray-600 hover:text-gray-800">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Products</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a href="/products" className="hover:underline text-gray-600 hover:text-gray-800">
                  All Products
                </a>
              </li>
              <li className="mt-2">
                <a href="/pricing" className="hover:underline text-gray-600 hover:text-gray-800">
                  Pricing
                </a>
              </li>
              <li className="mt-2">
                <a href="/docs" className="hover:underline text-gray-600 hover:text-gray-800">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Support</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a href="/help" className="hover:underline text-gray-600 hover:text-gray-800">
                  Help Center
                </a>
              </li>
              <li className="mt-2">
                <a href="/terms" className="hover:underline text-gray-600 hover:text-gray-800">
                  Terms of Service
                </a>
              </li>
              <li className="mt-2">
                <a href="/privacy" className="hover:underline text-gray-600 hover:text-gray-800">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">Stay connected</h5>
            <div className="flex flex-col">
              <Input type="email" placeholder="Enter your email" className="mb-2" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-base text-gray-400">© 2024 Convertfast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
