const DemoVideos = ({
  handleVideoClick,
  handleCustomizeVideoClick,
  demoVideo,
  customizeVideo,
}) => {
  const videoItems = [
    {
      src: demoVideo,
      onClick: handleVideoClick,
      text: "Click Demo Video for Order",
    },
    {
      src: customizeVideo,
      onClick: handleCustomizeVideoClick,
      text: "Click to Demo Customize Video",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-[#F18701]! mx-auto! py-5 h-10 w-full flex justify-center items-center">
        <h4 className="text-white! text-[14px]! font-medium">
          Demo For Placing Order
        </h4>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 mt-6">
        {videoItems.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className="relative w-[300px] md:w-[400px] cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group"
          >
            <video
              className="w-full h-auto object-cover"
              preload="none"
              loading="lazy"
              poster="/videos/customize-thumbnail.png"
            >
              <source src={item.src} type="video/mp4" />
            </video>

            {/* Overlay */}
            <div
              className="
              absolute inset-0 bg-black/40 flex items-center justify-center 
              opacity-0 group-hover:opacity-100 transition
            "
            >
              <p className="text-white text-lg font-semibold p-2! rounded-lg bg-black/60">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoVideos;
