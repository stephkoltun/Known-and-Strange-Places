
# TO GET THE LINES
# dissolve - processing.alghelp("grass:v.dissolve")
# check if multipart
# if yes, multipart to single part - processing.alghelp("qgis:multiparttosingleparts")
# became mapbox only takes polygon, line and point (not MultiPolygon)
# save layer as GEOJSON, set CRS to WSG84

# TO GET THE MASK
# Difference - extent as input, boundary as output
# this will dissolve all the boundaries
# and creates a single polygon

import processing
from qgis import core, gui
i = qgis.utils.iface
legend = i.legendInterface()
layers = legend.layers()
# set differencing extent to be a particular layer
bound = QgsMapLayerRegistry.instance().mapLayersByName('Extent')[0]

# loop through all visible layers (make sure the clipping extent is turned off!)
for layer in layers:
    layername = layer.name()
    vis = legend.isLayerVisible(layer)
    layerType = layer.type()
    if layerType == QgsMapLayer.VectorLayer:
        if (vis):
            print "layer " + layername

            # reproject to New York / Long Island and save as separate files
            print "- reproject"
            inputLayer = layername
            targetCRS = 'EPSG:2263'
            projFile = '/Users/pburke/Dropbox (Method)/Projects/2018-01 The Atlas Project/Daily/002-Archipelago-Areas/SHP/Reproject/' + layername + "_proj2263" + '.shp'
            processing.runalg("qgis:reprojectlayer", inputLayer, targetCRS, projFile)
            iface.addVectorLayer(projFile, "", 'ogr') #add and display file

            # clip new projection to frame extent
            print "- clip"
            inputClip = projFile
            clipFile = '/Users/pburke/Dropbox (Method)/Projects/2018-01 The Atlas Project/Daily/002-Archipelago-Areas/SHP/Clip/' + layername + '_clip.shp'
            processing.runalg("qgis:clip", inputClip, bound, clipFile)
            # INPUT <ParameterVector>, OVERLAY <ParameterVector>, OUTPUT <OutputVector>
            iface.addVectorLayer(clipFile, "", 'ogr')
            
            # difference the boundary area with extent to create a perimeter outline
            # and to be used for masking the underlying aerial in mapbox
            # need to add some checks which confirm closed objects and exclude lines
            print "- difference"
            inputDifference = clipFile
            diffFile = '/Users/pburke/Dropbox (Method)/Projects/2018-01 The Atlas Project/Daily/002-Archipelago-Areas/SHP/Difference/' + layername + '_difference.shp'
            processing.runalg("qgis:difference", bound, inputDifference, False, diffFile)
            # INPUT <ParameterVector>, OVERLAY <ParameterVector>, IGNORE_INVALID <ParameterBoolean>, OUTPUT <OutputVector>
            iface.addVectorLayer(diffFile, "", 'ogr')
            
            # save as geojson with WSG84 projection
            print "- geoJSON mask"
            inputMask = diffFile
            webCRS = 'EPSG:4326'
            geojsonMask = '/Users/pburke/Dropbox (Method)/Projects/2018-01 The Atlas Project/Daily/002-Archipelago-Areas/GEOJSON/Mask/' + layername + "_mask" + '.geojson'
            processing.runalg("qgis:reprojectlayer", inputMask, webCRS, geojsonMask)
            iface.addVectorLayer(geojsonMask, "", 'ogr')

            # originally, the perimeter boundaries were also saved by dissolving the inner subdivisions
            # but this was overly time consuming and often produced the same result as the differencing
            # print "- dissolve "
            # inputDissolve = clipFile
            # dissolveFile = '/Users/pburke/Dropbox (Method)/Projects/2018-01 The Atlas Project/Daily/002-Archipelago-Areas/SHP/Dissolve/' + layername + '_dissolve.shp'
            # processing.runalg("qgis:dissolve", inputDissolve, True,None,dissolveFile)
            # # INPUT <ParameterVector>, DISSOLVE_ALL <ParameterBoolean>, FIELD <parameters from INPUT>, OUTPUT <OutputVector>
            # iface.addVectorLayer(dissolveFile, "", 'ogr')
            # # save as geojson with WSG84 projection
            # print "- geoJSON bound"
            # inputBound = dissolveFile
            # webCRS = 'EPSG:4326'
            # geojsonBound = '/Users/pburke/Dropbox (Method)/Projects/2018-01 The Atlas Project/Daily/002-Archipelago-Areas/GEOJSON/Boundary/' + layername + "_boundary" + '.geojson'
            # processing.runalg("qgis:reprojectlayer", inputBound, webCRS, geojsonBound)

