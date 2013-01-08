Spine = require('spine')

class Map extends Spine.Controller
  constructor: ->
    super
    console.log('creating map')
    @html require('views/map')()
    locations = [
      [53.912, 27.595],
      [53.902, 27.555],
      [53.915, 27.534]
    ]
    setTimeout =>
      $('#map').width($(document).width())
      $('#map').height($(document).height())
      map = L.map('map')
      osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      osmAttrib = 'Map data © OpenStreetMap contributors'
      osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 21, attribution: osmAttrib})
      map.setView(locations[0], 17)
      map.addLayer(osm);

      locations.forEach ->
        L.marker(@).addTo(map)

      @leaf = map

    , 0

  activate: ->
    super
    @leaf.invalidateSize() unless @leaf


  elements:
    '#map': 'map'


module.exports = Map