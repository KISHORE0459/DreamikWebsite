import { PuffLoader } from "react-spinners";

const AppLoader = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-[300px] md:min-h-[500px]">
      <PuffLoader color="#12345A" />
    </div>
  );
};

export default AppLoader;
