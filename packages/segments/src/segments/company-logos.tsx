import { FC } from "react";
import "./company-logos.css";

const logoArr1: { src: string; alt: string }[] = [
    { src: "https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg", alt: "Google Logo" },
    { src: "https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg", alt: "LinkedIn Logo" },
    { src: "https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg", alt: "Amazon Logo" },
    { src: "https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg", alt: "LinkedIn Logo" },
    { src: "https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg", alt: "Google Logo" },
    { src: "https://tailwindui.com/img/logos/158x48/laravel-logo-gray-900.svg", alt: "LinkedIn Logo" },
];
const logoArr2: { src: string; alt: string }[] = [
    { src: "https://logos-world.net/wp-content/uploads/2020/07/Airbnb-Logo.png", alt: "Google Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2020/11/Apple-Music-Logo.png", alt: "LinkedIn Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2024/01/Axios-Logo.png", alt: "Amazon Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2022/04/Cloudflare-Logo.png", alt: "LinkedIn Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2021/02/Docker-Logo.png", alt: "Google Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2020/11/eBay-Logo.png", alt: "LinkedIn Logo" },
];
const logoArr3: { src: string; alt: string }[] = [
    { src: "https://logos-world.net/wp-content/uploads/2022/04/Epic-Logo.png", alt: "Google Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2021/03/Glitch-Logo.png", alt: "LinkedIn Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2023/03/Gogoplay1-Logo.png", alt: "Amazon Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2022/05/Daraz-Logo.png", alt: "LinkedIn Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2023/09/Dribbble-Logo.png", alt: "Google Logo" },
    { src: "https://logos-world.net/wp-content/uploads/2020/10/Dropbox-Logo.png", alt: "LinkedIn Logo" },
];

export const CompanyLogos: FC = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold leading-8 text-gray-900 mb-8">
          Trusted by industry leaders worldwide
        </h2>
        <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {logoArr1.map(({ src, alt }, index) => (
            <img
              key={index}
              className="col-span-1 max-h-12 w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              src={src}
              alt={alt}
              width={158}
              height={48}
            />
          ))}
        </div>
      </div>

        <h2 className="text-base font-semibold leading-7 text-primary text-center">Our Customers:</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-3xl mt-6 md:mx-auto sm:mx-8">
            {logoArr1.map(({src, alt}) => (
                <div className="h-12">
                    <img className="h-full" src={src} alt={alt} />
                </div>
            ))}
        </div>

        <h2 className="text-xl text-primary text-center">Our Customers:</h2>
        <div className="flex overflow-hidden">
            <div className="flex flex-nowrap flex-shrink-0 gap-x-4 marquee-scroll md:grid md:grid-rows-2 md:grid-cols-3 md:gap-y-4 md:w-full">
                {Array(6).fill(0).map((_, index) => [
                    logoArr1[index],
                    logoArr2[index],
                    logoArr3[index],
                ]).map(logoArr => (
                    <div className="flex flex-nowrap flex-shrink-0 gap-x-4 relative h-12 md:block">
                        {logoArr.map(({src, alt}, index) => (
                            <div className={`h-full flex-shrink-0 md:w-full md:absolute md:top-0 md:left-0 layer-${index}`}>
                                <img className="h-full mx-auto" src={src} alt={alt} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};