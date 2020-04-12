<template>
  <div>
    Lat: {{ map.center.lat }}, Long: {{ map.center.lng}}<br/>
    Zoom: {{ map.zoom}}<br/>
    <l-map :zoom="map.zoom" :center="map.center" @update:center="onUpdateMapCenter" @update:zoom="onUpdateMapZoom" id="mymap">
      <l-tile-layer :url="MapUrl" :attribution="MapAttr"/>
      <l-marker :lat-lng="marker.latlong" v-for="(marker, index) in pins" v-bind:key="index + '' + marker.text">
        <l-popup>{{ marker.text }}
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped>
#mymap {
  height: 500px;
}
</style>

<script>
import { latLng } from 'leaflet'
import { LMap, 
  LTileLayer, 
  LMarker, LPopup
} from 'vue2-leaflet'

const INITMAP = {
  zoom: 12,
  center: latLng(1.3340316734680562, 103.809814453125)
}
  export default {
    name: 'HelloWorld',
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup
    },
    data: () => ({
      MapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      MapOptions: {
        zoomSnap: 0.5
      },
      pins: [
        {
          latlong: latLng(1.3340316734680562, 103.809814453125),
          text: 'This is a marker text.'
        }
      ],
      MapAttr: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      map: {
        center: INITMAP.center,
        zoom: INITMAP.zoom
      }
    }),
    mounted() {
      // L.map('mymap').setView([51.505, -0.09], 13)
    },
    methods: {
      onUpdateMapCenter(NewCenter) {
        this.map.center = NewCenter
        this.pins[0].latlong = NewCenter
      },
      onUpdateMapZoom(NewZoom) {
        this.map.zoom = NewZoom
      }
    }
  }
</script>
