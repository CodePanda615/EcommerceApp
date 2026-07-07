export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-purple-300">About Us</a></li>
              <li><a href="#" className="hover:text-purple-300">Careers</a></li>
              <li><a href="#" className="hover:text-purple-300">Blog</a></li>
              <li><a href="#" className="hover:text-purple-300">Press</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-purple-300">Customer Support</a></li>
              <li><a href="#" className="hover:text-purple-300">Contact Us</a></li>
              <li><a href="#" className="hover:text-purple-300">FAQ</a></li>
              <li><a href="#" className="hover:text-purple-300">Shipping Info</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-purple-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-300">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-purple-300">Returns</a></li>
              <li><a href="#" className="hover:text-purple-300">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-purple-300">Facebook</a></li>
              <li><a href="#" className="hover:text-purple-300">Twitter</a></li>
              <li><a href="#" className="hover:text-purple-300">Instagram</a></li>
              <li><a href="#" className="hover:text-purple-300">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8">
          <p className="text-center text-sm text-slate-400">
            &copy; 2024 ShopNova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
