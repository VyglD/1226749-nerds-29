'use strict';

(() => {
  const mapImgWrapper = document.querySelector(`#placement__img-map-wrapper-js`);

  const initMap = () => {
    // eslint-disable-next-line no-undef
    const map = new google.maps.Map(document.getElementById(`map`), {
      zoom: 17,
      center: {
        lat: 59.938990,
        lng: 30.321450,
      },
    });

    // eslint-disable-next-line no-undef, no-unused-vars
    const marker = new google.maps.Marker({
      position: {
        lat: 59.938628,
        lng: 30.323800,
      },
      map,
      icon: `img/map-marker.png`,
    });
  };

  if (mapImgWrapper) {
    const mapContainer = document.createElement(`div`);
    mapContainer.setAttribute(`id`, `map`);
    mapContainer.setAttribute(`class`, `placement__map`);
    mapImgWrapper.parentElement.replaceChild(mapContainer, mapImgWrapper);

    const script = document.createElement(`script`);
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDdxiZ8JD-Awc3VOchAbkcA54-XHZJYkGY&callback=initMap`;
    script.defer = true;

    window.initMap = initMap;

    document.head.appendChild(script);
  }
})();
