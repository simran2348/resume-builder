import {
  EB_Garamond,
  Inter,
  Lato,
  Lora,
  Merriweather,
  Montserrat,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Roboto,
} from "next/font/google";

// App font (also a resume font option).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Other fonts offered in the resume theme panel.
// preload: false so a font file is only downloaded once a resume actually uses it.
const roboto = Roboto({ subsets: ["latin"], variable: "--font-resume-roboto", preload: false });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-resume-open-sans", preload: false });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-resume-lato", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-resume-montserrat", preload: false });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-resume-poppins",
  preload: false,
});
const merriweather = Merriweather({ subsets: ["latin"], variable: "--font-resume-merriweather", preload: false });
const lora = Lora({ subsets: ["latin"], variable: "--font-resume-lora", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-resume-playfair", preload: false });
const garamond = EB_Garamond({ subsets: ["latin"], variable: "--font-resume-garamond", preload: false });

// Class names that define the CSS variables above. Applied on <html>, and on the print frame's body.
export const resumeFontVariables = [
  inter,
  roboto,
  openSans,
  lato,
  montserrat,
  poppins,
  merriweather,
  lora,
  playfair,
  garamond,
]
  .map((font) => font.variable)
  .join(" ");
