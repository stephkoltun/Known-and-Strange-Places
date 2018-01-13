console.log("loaded layers file");

var neighborLayers = [
    {
        dataObj: catchBasinObj,
        dataName: 'catch-basin',
        layerId: 'catchBasins',
        color: '#0979f3',
        type: 'circle'
    },
    {
        dataObj: coolingTowerObj,
        dataName: 'cooling-tower',
        layerId: 'coolingTower',
        color: '#da3f0c',
        type: 'line'
    },
    // {
    //     dataObj: elevationPointsObj,
    //     dataName: 'elevation-points',
    //     layerId: 'elevationPoints',
    //     color: '#d2d2d2',
    //     type: 'circle'
    // },
    {
        dataObj: hydrantsObj,
        dataName: 'hyd-rants',
        layerId: 'hydrants',
        color: '#39a95c',
        type: 'circle'
    },
    {
        dataObj: parkingMetersObj,
        dataName: 'parking-meters',
        layerId: 'parkingMeters',
        color: '#f0a21c',
        type: 'circle'
    },
    {
        dataObj: privatePoolsObj,
        dataName: 'private-pools',
        layerId: 'privatePools',
        color: '#245b9e',
        type: 'line'
    },
    {
        dataObj: publicPoolsObj,
        dataName: 'public-pools',
        layerId: 'publicPools',
        color: '#6376b5',
        type: 'line'
    },
    {
        dataObj: railroadStructureObj,
        dataName: 'railroad-structure',
        layerId: 'railroadStructure',
        color: '#1eead9',
        type: 'line'
    },
    {
        dataObj: subwayEntranceObj,
        dataName: 'subway-entrance',
        layerId: 'subwayEntrance',
        color: '#c82093',
        type: 'circle'
    },
]