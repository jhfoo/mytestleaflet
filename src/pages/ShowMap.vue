<template>
  <v-container fluid>
    <v-row>
      <v-col md="8">
        <l-map :zoom="map.zoom" :center="map.center" @update:center="onUpdateMapCenter" @update:zoom="onUpdateMapZoom" id="mymap">
          <l-tile-layer :url="MapUrl" :attribution="MapAttr"/>
          <l-marker :lat-lng.sync="marker.latlong" v-for="(marker, index) in pins" :draggable="marker.draggable" :icon="marker.icon" v-bind:key="index + '' + marker.text">
            <l-popup>{{ marker.text }}</l-popup>
          </l-marker>
        </l-map>
      </v-col>
      <v-col md="4">
        <v-card>
          <v-tabs v-model="ActiveTab" @change="onTabChange" grow>
            <v-tab v-for="tab in tabs" v-bind:key="tab.name">{{ tab.name }}</v-tab>
          </v-tabs>
            <v-tabs-items v-model="ActiveTab">
              <v-tab-item>
                <v-card-text>
                  Map<br/>
                  Lat: {{ map.center.lat }}<br/>
                  Long: {{ map.center.lng}}<br/>
                  <br/>Zoom: {{ map.zoom}}<br/>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text v-if="pins.length > 0">
                  <v-text-field v-model="pins[0].latlong.lat" label="Latitude"></v-text-field>
                  <v-text-field v-model="pins[0].latlong.lng" label="Longitude"></v-text-field>
                  <v-text-field v-model="NewPin.name" label="Title"></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="onAddPin" text>Add Pin</v-btn>
                </v-card-actions>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  Select a named pin below, then drag the pin to the new location or update the fields below.
                </v-card-text>
                <!-- list mode -->
                <v-list v-if="isListPins" two-line subheader>
                  <v-list-item v-for="pin in pins" :key="pin.id" @click="onEditPin(pin)">
                    <v-list-item-avatar>
                      <v-icon>mdi-pin</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-text="pin.text"></v-list-item-title>
                      <v-list-item-subtitle v-text="pin.text"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn icon>
                        <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                <!-- edit mode -->
                <div v-if="isEditPin">
                  <v-card-text>
                    <v-text-field v-model="pins[0].id" label="Id" disabled=""></v-text-field>
                    <v-text-field v-model="pins[0].text" label="Title"></v-text-field>
                    <v-text-field v-model="pins[0].latlong.lat" label="Latitude"></v-text-field>
                    <v-text-field v-model="pins[0].latlong.lng" label="Longitude"></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="onCancelEditPin" text>Cancel</v-btn>
                    <v-btn @click="onUpdatePin" text>Update</v-btn>
                    <v-btn @click="onDeletePin" color="error" text>Delete</v-btn>
                  </v-card-actions>
                </div>
              </v-tab-item>
            </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
#mymap {
  height: 500px;
}
</style>

<script>
import { latLng, icon } from 'leaflet'
import { LMap, 
  LTileLayer, 
  LMarker, LPopup
} from 'vue2-leaflet'
const GlobalFirebase = require('../lib/GlobalFirebase.js')

const INITMAP = {
  zoom: 12,
  center: latLng(1.3340316734680562, 103.809814453125)
}

const MPIN_LIST = 'list-pins',
  MPIN_EDIT = 'edit-pin'

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
      pins: [],
      // pins: [
      //   {
      //     latlong: latLng(1.3340316734680562, 103.809814453125),
      //     text: 'This is a marker text. New line'
      //   }, {
      //     latlong: latLng(1.3309426042407257, 103.86886596679689),
      //     text: 'This is another marker.'
      //   },
      // ],
      MapAttr: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      map: {
        center: INITMAP.center,
        zoom: INITMAP.zoom
      },
      tabs: [
        {
          name: 'Info'
        }, {
          name: 'New Pin'
        }, {
          name: 'Manage Pins'
        }
      ],
      NewPin: {
        name: 'New Pin'
      },
      ManagePinState: MPIN_LIST,
      AllPins: [],
      ActiveTab: null
    }),
    mounted() {
      // L.map('mymap').setView([51.505, -0.09], 13)
      console.log('Auth user: %s', GlobalFirebase.auth.currentUser)
      console.log(GlobalFirebase.auth.currentUser)

      console.log('Retrieving roles')
      GlobalFirebase.db.collection('pins').get().then((records) => {
        console.log('Records: %d', records.size)
        let NewPins = []
        records.forEach((record) => {
          let data = record.data()
          NewPins.push({
            id: record.id,
            text: data.name,
            latlong: latLng(data.position.latitude, data.position.longitude),
            icon: icon({
              iconUrl: "/images/pin-red.png",
              iconSize: [64, 64],
              iconAnchor: [32, 64]
            }),
            draggable: false
          })
        })
        this.AllPins = NewPins
        this.pins = this.AllPins
      })
    },
    computed: {
      isEditPin() {
        return this.ManagePinState === MPIN_EDIT
      },
      isListPins() {
        return this.ManagePinState === MPIN_LIST
      }
    },
    methods: {
      onDeletePin() {
        GlobalFirebase.db.collection('pins').doc(this.pins[0].id).delete()
        .then(() => {
          this.AllPins = this.AllPins.filter((pin) => {
            return pin.id !== this.pins[0].id
          })
          console.log('Delete successful')
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          this.onCancelEditPin()
        })
      },
      onUpdatePin() {
        GlobalFirebase.db.collection('pins').doc(this.pins[0].id).update({
          name: this.pins[0].text,
          position: {
            latitude: this.pins[0].latlong.lat,
            longitude: this.pins[0].latlong.lng
          }
        }).then(() => {
          console.log('Update successful')
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          this.onCancelEditPin()
        })
      },
      onCancelEditPin() {
        this.pins = this.AllPins
        this.ManagePinState = MPIN_LIST
      },
      onEditPin(SelectedPin) {
        this.ManagePinState = MPIN_EDIT
        SelectedPin.draggable = true
        this.pins = [SelectedPin]
        this.map.center = SelectedPin.latlong
      },
      onAddPin() {
        GlobalFirebase.db.collection('pins').add({
          name: this.NewPin.name,
          position: {
            latitude: this.pins[0].latlong.lat,
            longitude: this.pins[0].latlong.lng
          }
        }).then((PinId) => {
          console.log('Pin added')
          this.AllPins.push({
            id: PinId,
            text: this.NewPin.name,
            latlong: this.pins[0].latlong,
            icon: icon({
              iconUrl: "/images/pin-red.png",
              iconSize: [64, 64],
              iconAnchor: [32, 64]
            }),
            draggable: false
          })
          this.ActiveTab = 0
          this.onTabChange(0)
        }).catch((err) => {
          console.error(err)
        })
      },
      onTabChange(NewTab) {
        console.log('onTabChange: %s', NewTab)
        switch (NewTab) {
          case 0:
            this.pins = this.AllPins
            break
          case 1:
            this.pins = [{
              text: '',
              latlong: this.map.center,
              icon: icon({
                iconUrl: "/images/pin-blue.png",
                iconSize: [64, 64],
                iconAnchor: [32, 64]
              }),
              draggable: true
            }]
            break
          case 2:
            this.pins = this.AllPins
            this.ManagePinState = MPIN_LIST
            break
        }
      },
      onUpdateMapCenter(NewCenter) {
        this.map.center = NewCenter
      },
      onUpdateMapZoom(NewZoom) {
        this.map.zoom = NewZoom
      }
    }
  }
</script>
