/*
    This file was from a udacity HTML5 game dev course( it kind of sucked so I don't recommend it)

*/

// anchor around where the bg is, when we leave it we re render, otherwise we just slide stuff around
ANCHOR = undefined
PADDING = 4 // # of tiles of padding that are rendered in each direction

// guh margins are a pain
MARGINS = 1

var TILEDMapClass = Class.extend({
    // This is where we store the full parsed
    // JSON of the map.json file.
  currMapData: null,

    // This is where we store the width and
    // height of the map in tiles. This is
    // in the 'width' and 'height' fields
    // of map.json, respectively.
    // The values 100 here are just set
    // so these fields are initialized to
    // something, rather than null.
  numXTiles: 100,
  numYTiles: 100,

    // tilesets stores each individual tileset
    // from the map.json's 'tilesets' Array.
    // The structure of each entry of this
    // Array is explained below in the
    // parseAtlasDefinition method.
  tilesets: [],

    // The size of each individual map
    // tile, in pixels. This is in the
    // 'tilewidth' and 'tileheight' fields
    // of map.json, respectively.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
  tileSize: {
    'x': 64,
    'y': 64
  },

    // Counter to keep track of how many tile
    // images we have successfully loaded.
  imgLoadCount: 0,

    // The size of the entire map,
    // in pixels. This is calculated
    // based on the 'numXTiles', 'numYTiles',
    // and 'tileSize' parameters.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
  pixelSize: {
    'x': 64,
    'y': 64
  },

    // Boolean flag we set once our map atlas
    // has finished loading.
  fullyLoaded: false,

    // -----------------------------------------
    // Load the json file at the url 'map' into
    // memory. This is similar to the requests
    // we've done in the past using
    // XMLHttpRequests.
  load: function (map) {
        // this should proably not be shoved in here but unclear where else to put it
    window.RENDER_CANVAS = document.createElement('canvas')
    RENDER_CANVAS.height = VIEWPORT_HEIGHT + 2 * RESOLUTION * PADDING
    RENDER_CANVAS.width = VIEWPORT_WIDTH + 2 * RESOLUTION * PADDING

        // Perform an XMLHttpRequest to grab the
        // JSON file at url 'map'.
    xhrGet(map, function (data) {
            // Once the XMLHttpRequest loads, call the
            // parseMapJSON method.
      gMap.parseMapJSON(data.responseText)
    })
  },

    // ---------------------------
  parseMapJSON: function (mapJSON) {
        // Call JSON.parse on 'mapJSON' and store
        // the resulting map data
    var gMap = this
    gMap.currMapData = JSON.parse(mapJSON)

        // Set the above properties of our TILEDMap based
        // on the various properties in 'currMapData'.
        // Look at the comments describing each field
        // to see what properties of 'currMapData' to pull
        // this information from.
        //
        // Once you're done, set fullyLoaded to true.
        //
        // YOUR CODE HERE
    var map = this.currMapData
    this.numXTiles = map.width
    this.numYTiles = map.height
    MAP_WIDTH=this.numXTiles
    MAP_HEIGHT=this.numYTiles
    this.tileSize.x = map.tilewidth
    this.tileSize.y = map.tileheight

    this.pixelSize.x = this.numXTiles * this.tileSize.x
    this.pixelSize.y = this.numYTiles * this.tileSize.y

        // load tilesets

    for (var i = 0; i < map.tilesets.length; i++) {
      var img = new Image()
      img.onload = function () {
        gMap.imgLoadCount++
        if (gMap.imgLoadCount === map.tilesets.length) {
          gMap.fullyLoaded = true
        }
      }
      img.src = '/assets/' + map.tilesets[i].image.replace(/^.*[\\\/]/, '')

      var ts = {
        'firstgid': map.tilesets[i].firstgid,
        'image': img,
        'imageheight': map.tilesets[i].imageheight,
        'imagewidth': map.tilesets[i].imagewidth,
        'name': map.tilesets[i].name,
        'numXTiles': Math.floor((map.tilesets[i].imagewidth + MARGINS) / (this.tileSize.x + MARGINS)),
        'numYTiles': Math.floor((map.tilesets[i].imageheight + MARGINS) / (this.tileSize.y + MARGINS))
      }

      this.tilesets.push(ts)
    }

    this.fullyLoaded = true
  },

    // -----------------------------------------
    // Grabs a tile from our 'layer' data and returns
    // the 'pkt' object for the layer we want to draw.
    // It takes as a parameter 'tileIndex', which is
    // the id of the tile we'd like to draw in our
    // layer data.
  getTilePacket: function (tileIndex) {
        // We define a 'pkt' object that will contain
        //
        // 1) The Image object of the given tile.
        // 2) The (x,y) values that we want to draw
        //    the tile to in map coordinates.
    var pkt = {
      'img': null,
      'px': 0,
      'py': 0
    }

        // The first thing we need to do is find the
        // appropriate tileset that we want to draw
        // from.
        //
        // Remember, if the tileset's 'firstgid'
        // parameter is less than the 'tileIndex'
        // of the tile we want to draw, then we know
        // that tile is not in the given tileset and
        // we can skip to the next one.
        //
        // YOUR CODE HERE

    var tile_set_index = 0
    for (tile_set_index = this.tilesets.length - 1; tile_set_index >= 0; tile_set_index--) {
      if (this.tilesets[tile_set_index].firstgid <= tileIndex) break
    }
        // Next, we need to set the 'img' parameter
        // in our 'pkt' object to the Image object
        // of the appropriate 'tileset' that we found
        // above.
        //
        // YOUR CODE HERE
    pkt.img = this.tilesets[tile_set_index].image

        // Finally, we need to calculate the position to
        // draw to based on:
        //
        // 1) The local id of the tile, calculated from the
        //    'tileIndex' of the tile we want to draw and
        //    the 'firstgid' of the tileset we found earlier.
        //
        // YOUR CODE HERE

    var localIdx = tileIndex - this.tilesets[tile_set_index].firstgid

        // 2) The (x,y) position of the tile in terms of the
        //    number of tiles in our tileset. This is based on
        //    the 'numXTiles' of the given tileset. Note that
        //    'numYTiles' isn't actually needed here. Think about
        //    how the tiles are arranged if you don't see this,
        //    It's a little tricky. You might want to use the
        //    modulo and division operators here.
        //
        // YOUR CODE HERE

    var lTileX = Math.floor(localIdx % this.tilesets[tile_set_index].numXTiles)
    var lTileY = Math.floor(localIdx / this.tilesets[tile_set_index].numXTiles)

        // 3) the (x,y) pixel position in our tileset image of the
        //    tile we want to draw. This is based on the tile
        //    position we just calculated and the (x,y) size of
        //    each tile in pixels.
        //
        // YOUR CODE HERE

    pkt.px = (lTileX * (this.tileSize.x + MARGINS))
    pkt.py = (lTileY * (this.tileSize.y + MARGINS))

    return pkt
  },

  draw: function (ctx) {
        // only draw if the map needs new tiles rendered, otherwise just translate the map!
        // hopefully much more efficient
    if (ANCHOR === undefined || Math.abs(ANCHOR[0] - PLAYER_CAMERA.x) > (PADDING - 2) || Math.abs(ANCHOR[1] - PLAYER_CAMERA.y) > (PADDING - 2)) {
      gMap.draw_from_scratch(ctx)
    } else {
      gMap.lazy_draw(ctx)
    }
  },

  lazy_draw: function (ctx) {
        // just center the map

    ctx.save()
    ctx.translate((ANCHOR[0] - PLAYER_CAMERA.x) * RESOLUTION, (ANCHOR[1] - PLAYER_CAMERA.y) * RESOLUTION)
    ctx.drawImage(RENDER_CANVAS, -RESOLUTION * PADDING, -RESOLUTION * PADDING)
    ctx.restore()
  },

     // -----------------------------------------
    // Draws all of the map data to the passed-in
    // canvas context, 'ctx'.
  draw_from_scratch: function (ctx) {
        // First, we need to check if the map data has
        // already finished loading.
    if (!gMap.fullyLoaded) return

        // Now, for every single layer in the 'layers' Array
        // of 'currMapData', we need to:
        //
        // 1) Check if the 'type' of the layer is "tilelayer".
        //    If it isn't, we don't care about drawing it.
        //
        // 2) If it is a "tilelayer", we grab the 'data' Array
        //    of the given layer.
        //
        // 3) For each tile id in the 'data' Array, we need
        //    to:
        //
        //    a) Check if the tile id is 0. An id of 0 means that
        //       we don't need to worry about drawing it, so we
        //       don't need to do anything further with it.
        //
        //    b) If the tile id is not 0, then we need to grab
        //       the packet data using 'getTilePacket' called
        //       on that tile id.
        //
        // YOUR CODE HERE

        // http://stackoverflow.com/questions/9942209/unwanted-lines-apearing-in-html5-canvas-using-tiles
        // this is super important! that why we need to round!

    offset_x = Math.floor(-window.PLAYER_CAMERA.x * RESOLUTION + RESOLUTION * PADDING)
    offset_y = Math.floor(-window.PLAYER_CAMERA.y * RESOLUTION + RESOLUTION * PADDING)

    render_ctx = RENDER_CANVAS.getContext('2d')

    for (var layerIdx = 0; layerIdx < this.currMapData.layers.length; layerIdx++) {
      if (this.currMapData.layers[layerIdx].type != 'tilelayer') continue

      var dat = this.currMapData.layers[layerIdx].data
            // find the tile index offset for this layer
      for (var tileIdx = 0; tileIdx < dat.length; tileIdx++) {
        var tID = dat[tileIdx]
        if (tID === 0) continue

        var tPKT = this.getTilePacket(tID)

                // test if tile is with bounds
        var worldX = offset_x + Math.floor(tileIdx % this.numXTiles) * this.tileSize.x
        var worldY = offset_y + Math.floor(tileIdx / this.numXTiles) * this.tileSize.y

        if ((worldX < -RESOLUTION * (PADDING + 2)) || (worldY < -RESOLUTION * (PADDING + 2)) || (worldX > bgCanvas.width + RESOLUTION * (PADDING + 2)) || (worldY > bgCanvas.height + RESOLUTION * (PADDING + 2))) continue // skip that tile if it's off screen

        render_ctx.drawImage(tPKT.img, tPKT.px, tPKT.py,
                            this.tileSize.x, this.tileSize.y,
                            worldX, worldY,
                            this.tileSize.x, this.tileSize.y)
      }
    }

    ANCHOR = [PLAYER_CAMERA.x, PLAYER_CAMERA.y]
    gMap.lazy_draw(ctx)
  }

})

// var gMap = new TILEDMapClass();

