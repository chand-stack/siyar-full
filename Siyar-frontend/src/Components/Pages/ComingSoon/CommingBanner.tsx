import img from "../../../assets/siyar-banner-logo.png"
import logo from "../../../assets/logo.png"
import logo2 from "../../../assets/arabic-logo.png"
import bg from "../../../assets/banner-bg.png"
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion
import axios from "axios";
import Swal from "sweetalert2";

const CommingBanner = () => {
  const [englishTab, setEnglishTab] = useState(true);
  const [arabTab, setArabTab] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email);
    try {
      const res = await axios.post("https://siyar-backend.vercel.app/api/v1/contact/create-contact",{email})
      console.log(res.data.success);
     if (res.data.success) {
  Swal.fire({
    title: "Jazakallah Khayran!",
    text: "Thank you for subscribing.",
    icon: "success",
    timer: 3000, // Auto close after 3 seconds
    showConfirmButton: false, // Remove OK button
    timerProgressBar: true, // Optional: show progress bar
  });
  setEmail("")
}
      
    } catch (error) {
      console.log(error);
      
    }
  };

  const arabTabHandler = () => {
    setEnglishTab(false);
    setArabTab(true);
  };

  const engTabHandler = () => {
    setEnglishTab(true);
    setArabTab(false);
  };

  const tabVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4 }
  };

  return (
    <div
      className="w-full min-h-screen bg-[#03045E]"
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100% 50%",
        width: "100%"
      }}
    >
      <div className="container mx-auto pt-10 px-5">
        <section className="flex flex-col md:flex-row justify-between items-center text-white font-medium">
          <h1>{englishTab ? "COMING SOON" : "قريبا"}</h1>
          <hr className="my-4 border-t-2 border-[#545592] w-full max-w-3xl mx-auto" />
          <ul className="flex items-center gap-5 text-[#0054FF]">
            <li
              onClick={() => arabTabHandler()}
              className={`${arabTab && "text-white"} cursor-pointer`}
            >
              ARABIC
            </li>
            <li
              onClick={() => engTabHandler()}
              className={`${englishTab && "text-white"} cursor-pointer`}
            >
              ENGLISH
            </li>
            <li>BAHASA</li>
            <li>TURKISH</li>
          </ul>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={arabTab ? "arabic" : "english"}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.5 }}
            className={`flex flex-col ${
              arabTab ? "md:flex-row-reverse" : "md:flex-row"
            } items-center justify-between pt-10`}
          >
            <div>
              <div
                className={`flex ${
                  arabTab && "justify-end"
                }`}
              >
                
               
                
                {
                  arabTab ? <img className="h-20 md:h-28 lg:h-36" src={logo2} alt="" /> :
 <img className="h-12 md:h-20 lg:h-28" src={logo} alt="" />
                }
               
              </div>
              {/* {arabTab && (
                <div className="text-[#0054FF] text-5xl text-end mt-2 ">
                  <h1>العربية</h1>
                </div>
              )} */}

              <form onSubmit={handleSubmit} className="mt-20">
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className={`input border-white font-roboto-italic text-lg rounded min-w-[270px] ${
                    arabTab && "text-end"
                  }`}
                />
                <div className={`${arabTab && "text-end"}`}>
                  <button
                    type="submit"
                    className={`btn bg-[#FFCE00] rounded-xl btn-sm border-none h-10 w-28 text-lg mt-5 ${
                      englishTab ? "font-roboto-regular font-light" :"Cairo-Light"
                    } shadow-none`}
                  >
                    {arabTab ? "إشترك" : "SIGN UP"}
                  </button>
                </div>
              </form>

              <div
                className={`flex gap-5 items-center mt-10 ${
                  arabTab && "flex-row-reverse"
                }`}
              >
                <h1
                  className={`${
                    englishTab ? "font-roboto-regular":"Cairo-Medium"
                  } text-white ${arabTab && "text-2xl"}`}
                >
                  {arabTab ? "تابعنا" : "FOLLOW US ON"}
                </h1>
                <div className="flex items-center gap-3">
                  <Link target="_blank" to="https://x.com/Siyarinstitute">
                    <FaXTwitter className="text-white text-2xl" />
                  </Link>
                  <Link target="_blank" to="https://www.instagram.com/siyarinstitute">
                    <FaInstagram className="text-white text-2xl" />
                  </Link>
                  <Link target="_blank" to="https://www.tiktok.com/@siyarinstitute">
                    <FaTiktok className="text-white text-2xl" />
                  </Link>
                  <Link target="_blank" to="http://www.youtube.com/@siyarinstitute">
                    <FaYoutube className="text-white text-3xl" />
                  </Link>
                  <Link target="_blank" to="https://www.facebook.com/profile.php?id=61579279420778">
                    <FaFacebook className="text-white text-3xl" />
                  </Link>
                </div>
              </div>

              <div
                className={`text-5xl text-[#0054FF] ${
                  englishTab && "font-roboto-regular"
                } mt-20 ${arabTab && "text-end"}`}
              >
                <h1
                  className={`${englishTab ? "font-extralight" : "Cairo-Light"}`}
                >
                  {arabTab ? "إحياء" : "REVIVING"} <br />
                  {arabTab ? "العلم" : "KNOWLEDGE."} <br />
                  <span
                    className={`${
                      englishTab ? "font-roboto-bold" : "Cairo-Medium"
                    }`}
                  >
                    {arabTab ? "تصور جديد" : "REIMAGINING"}
                  </span>
                  <br />
                  <span
                    className={`${
                      englishTab ? "font-roboto-bold" : "Cairo-Medium"
                    }`}
                  >
                    {arabTab ? "للقوة" : "POWER."}
                  </span>
                </h1>
              </div>
            </div>
            <div>
              <img src={img} alt="" />
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommingBanner;
