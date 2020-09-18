import { loadModules } from "esri-loader";
type Constructor<T = object> = new (...args: any[]) => T;

let layerClassPromise: null | Promise<Constructor<MarkerLayer>> = null;

interface MarkerLayer {
  markers: { point: __esri.Point, node: HTMLElement }[];
}

const pt: number[] = [];

async function _createLayerClass(): Promise<Constructor<MarkerLayer>> {
  const [Layer, BaseLayerView2D] = await loadModules([
    "esri/layers/Layer",
    "esri/views/2d/layers/BaseLayerView2D"
  ]);

  const MarkerLayerView = BaseLayerView2D.createSubclass({
    attach() {
      this.el = document.createElement("div");
      this.el.style.width = "100%";
      this.el.style.height = "100%";
      this.el.style.pointerEvents = "none";
      this.view.ui.add(this.el, "manual");
      this.layer.watch("markers", () => this.requestRender());
    },
    detach() {
      this.view.ui.remove(this.el);
      this.el = null;
    },
    render({ state }: { state:__esri.ViewState }) {
      for (const marker of this.layer.markers) {
        let [x, y] = state.toScreen(pt, marker.point.x, marker.point.y);
        x = Math.round(x);
        y = Math.round(y);

        marker.node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (!marker.node.parentElement) {
          this.el.appendChild(marker.node);
        }
      }

      // TODO remove marker nodes not in layer's markers.
    }
  });

  const MarkerLayerConstructor: Constructor<MarkerLayer> = Layer.createSubclass({
    createLayerView(view: any) {
      return new MarkerLayerView({ view, layer: this });
    }
  })

  return MarkerLayerConstructor;
}

export async function createLayer(): Promise<MarkerLayer> {
  if (!layerClassPromise) {
    layerClassPromise = _createLayerClass();
  }
  
  const MarkerLayer = await layerClassPromise;

  return new MarkerLayer();
}