
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

  let node = document.createElement("div");
  node.style.width = "20px";
  node.style.height = "20px";
  node.style.background = "red";

  layer.markers = [{
    point: new Point({ longitude: -100, latitude: 40, spatialReference: view.spatialReference }),
    node
  }];

  (window as any).view = view;
})
