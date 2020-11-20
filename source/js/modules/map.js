import {createElement} from "./utils";

const MAP_CONTAINER_TEMPLATE = (`
  <div class="placement__map" id="map"></div>
`);

const MapScript = document.createElement(`script`);
MapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDdxiZ8JD-Awc3VOchAbkcA54-XHZJYkGY&callback=initMap`;
MapScript.defer = true;

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
    icon: `img/map-marker@1x.webp`,
  });
};

const init = () => {
  const mapImgWrapper = document.querySelector(`#placement__img-map-wrapper-js`);

  if (mapImgWrapper) {
    const mapContainer = createElement(MAP_CONTAINER_TEMPLATE);

    mapImgWrapper.parentElement.replaceChild(mapContainer, mapImgWrapper);

    window.initMap = initMap;

    document.head.appendChild(MapScript);
  }
};

export default {init};
