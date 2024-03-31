import Wallpaper2 from "../../assets/images/empty-modern-room-with-furniture (1).jpg";

function LandingWallpaper() {
  return (
    <div className="w-[100%] h-[100%] absolute top-0 z-[0]">
      <div className="bg-[#0000009d] absolute w-[100%] h-[100%] z-[1]"></div>
      <img
        src={Wallpaper2}
        className="object-cover absolute  w-[100%] h-[100%] sm:object-left object-bottom "
      ></img>
    </div>
  );
}

export default LandingWallpaper;
