
import { loadModules } from "esri-loader";
import { createLayer } from "./layers/markerLayer"; 

Promise.all([
  loadModules<any>(["esri/Map", "esri/views/MapView", "esri/geometry"]),
  createLayer()
])
.then(async ([[Map, MapView, { Point }], layer]) => {
  const view: __esri.MapView = new MapView({
    container: "viewDiv",
    map: new Map({
      basemap: "topo-vector",
      layers: [layer],
      center: [-100, 40],
      zoom: 4
    })
  });

  await view.when();


  layer.markers = Array.from({ length: 400 }).map(() => {
    let node = document.createElement("div");
    node.className = "marker";

    return {
      point: new Point({
        longitude: Math.random() * 360 - 180,
        latitude: Math.random() * 180 - 90,
        spatialReference: view.spatialReference
      }),
      node
    }
  });

  (window as any).view = view;
})
