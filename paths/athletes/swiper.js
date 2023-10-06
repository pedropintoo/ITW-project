$().ready(function () {
  let mySwiper = new Swiper(".swiper-container", {
    loop: true,
    freemode: true,
    slidesPerView: 4,
    autoplay: {
      delay: 5000,
    },
    speed: 5000,
  });
  mySwiper.on("touchEnd", function () {
    setTimeout(function () {
      mySwiper.autoplay.start();
    }, 10000);
  });
});
