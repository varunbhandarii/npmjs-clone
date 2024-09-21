import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <div>
      <footer className="flex py-16 justify-around">
        <div>
          <h3 className="text-[17px] font-bold poppins pb-6">Support</h3>
          <ul className="flex-col flex gap-4">
            <a href="/" className="text-[#4c4c4c] poppins">
              Help
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Advisories
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Status
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Contact npm
            </a>
          </ul>
        </div>
        <div>
          <h3 className="text-[17px] font-bold poppins pb-6">Company</h3>
          <ul className="flex-col flex gap-4">
            <a href="/" className="text-[#4c4c4c] poppins">
              About
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Blog
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Press
            </a>
          </ul>
        </div>
        <div>
          <h3 className="text-[17px] font-bold poppins pb-6">
            Terms & Policies
          </h3>
          <ul className="flex-col flex gap-4">
            <a href="/" className="text-[#4c4c4c] poppins">
              Policies
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Terms of Use
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Code of Conduct
            </a>
            <a href="/" className="text-[#4c4c4c] poppins">
              Privacy
            </a>
          </ul>
        </div>
      </footer>
      <div className="gradient" />
    </div>
  );
};

export default Footer;
