Spine = require('spine')

class Map extends Spine.Controller
  constructor: ->
    super
    console.log('creating map')
    @html require('views/map')()
    @locations = [
      [53.912, 27.595],
      [53.902, 27.555],
      [53.915, 27.534]
    ]
    setTimeout =>
      $('#map').width($(document).width())
      $('#map').height($(document).height())
      @leaf = L.map('map')

    , 0

  render: ->
    map = @leaf
    osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    osmAttrib = 'Map data © OpenStreetMap contributors'
    osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 21, attribution: osmAttrib})
    map.setView(@locations[0], 17)
    map.addLayer(osm);
    map.invalidateSize()

    @locations.forEach (location) ->
      L.marker(location).addTo(map)

  activate: ->
    super
    setTimeout =>
      @render()
    , 10


  elements:
    '#map': 'map'


module.exports = Map