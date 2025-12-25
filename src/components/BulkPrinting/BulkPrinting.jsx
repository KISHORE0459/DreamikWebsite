import React, { useState } from "react";
import { LuDownload, LuChevronLeft, LuChevronRight } from "react-icons/lu";

const BulkPrinting = () => {
  const softwareImages = [
    "Bulk batch pdf print sw img1.jpg",
    "Bulk batch pdf print sw img2.jpg",
    "Bulk batch pdf print sw img3.jpg",
    "Bulk batch pdf print sw img4.jpg",
    "Bulk batch pdf print sw img5-configure.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = softwareImages.length;

  const handleDownload = (href, fileName) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="mx-auto flex flex-col gap-5! px-4! py-5!">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#12345a]">
          Bulk Printing Software
        </h1>
        <p className="mt-3 text-gray-600">
          Download the sample Excel file and Windows software to perform
          high-speed bulk PDF printing with advanced printer controls.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <button
          onClick={() =>
            handleDownload(
              "/BulkPrintingSoftware/bulkbatchprintinput-sample.xlsx",
              "bulkbatchprintinput-sample.xlsx"
            )
          }
          className="flex flex-col items-center gap-1 rounded-lg border border-[#3e9e63]! bg-white px-4! py-2! text-[#3e9e63]! shadow-md transition hover:bg-[#3e9e63]! hover:text-white! hover:cursor-pointer!"
        >
          <span className="flex items-center gap-1 text-lg font-semibold">
            <LuDownload /> Download Excel File
          </span>
          <span className="text-sm opacity-90">
            (bulkbatch printinput sample)
          </span>
        </button>

        <button
          onClick={() =>
            handleDownload(
              "/BulkPrintingSoftware/Dreamik Bulk Batch PDF Print for Windows 2025.msi",
              "Dreamik Bulk Batch PDF Print for Windows 2025.msi"
            )
          }
          className="flex flex-col items-center gap-1 rounded-lg bg-[#3e9e63]! px-4! py-2! text-white! shadow-md hover:cursor-pointer!"
        >
          <span className="flex items-center gap-1 text-lg font-semibold">
            <LuDownload /> Download Software
          </span>
          <span className="text-sm opacity-90">Windows Installer (.msi)</span>
        </button>
      </div>

      <div className="w-full flex flex-col gap-2! items-center! justify-center! mt-2.5!">
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#12345a]">
          Software Preview
        </h2>

        <div className="relative mx-auto w-[300px]! md:w-[600px]! lg:w-[800px]!">
          <div className="overflow-hidden rounded-xl border bg-white shadow-lg p-3!">
            <img
              src={`/BulkPrintingSoftware/${softwareImages[currentIndex]}`}
              alt={`Software preview ${currentIndex + 1}`}
              className="h-[400px] w-full object-contain transition-all duration-300"
              loading="lazy"
            />
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3! shadow-md transition hover:bg-[#3e9e63]! hover:text-white! hover:cursor-pointer!"
          >
            <LuChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3! shadow-md transition hover:bg-[#3e9e63]! hover:text-white! hover:cursor-pointer!"
          >
            <LuChevronRight size={24} />
          </button>

          <div className="mt-4! flex justify-center gap-2">
            {softwareImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full transition ${
                  idx === currentIndex ? "bg-[#3e9e63]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPrinting;
