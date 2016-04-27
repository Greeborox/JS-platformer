var levels = [
  {
    "world": {
      "width": 4000,
      "height": 3000,
    },
    "platforms": [
      {
        "x": 270,
        "y": 2608,
        "width": 228,
        "height": 12,
      },
      {
        "x": 430,
        "y": 2738,
        "width": 128,
        "height": 12,
      },
      {
        "x": 40,
        "y": 2788,
        "width": 128,
        "height": 12,
      },
      {
        "x": 0,
        "y": 2976,
        "width": 200,
        "height": 12,
      },
      {
        "x": 1650,
        "y": 2976,
        "width": 300,
        "height": 12,
      },
      {
        "x": 2350,
        "y": 2976,
        "width": 1400,
        "height": 12,
      },
      {
        "x": 570,
        "y": 2508,
        "width": 268,
        "height": 12,
      },
      {
        "x": 1270,
        "y": 2508,
        "width": 68,
        "height": 12,
      },
      {
        "x": 1290,
        "y": 2808,
        "width": 264,
        "height": 12,
      },
      {
        "x": 1670,
        "y": 2738,
        "width": 164,
        "height": 12,
      },
    ],
    "ledges": [
      {
        "x": 100,
        "y": 2588,
        "width": 100,
        "height": 12,
        "color": "red",
      },
      {
        "x": 100,
        "y": 2488,
        "width": 100,
        "height": 12,
        "color": "red",
      },
    ],
    "expPlatforms": [
      {
        "x": 2000,
        "y": 2938,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
      {
        "x": 2200,
        "y": 2938,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
    ],
    "vanPlatforms": [
      {
        "x": 270,
        "y": 2838,
        "width": 88,
        "height": 12,
        "color": "magenta",
      },
      {
        "x": 990,
        "y": 2552,
        "width": 168,
        "height": 12,
        "color": "magenta",
      },
    ],
    "movPlatforms": [
      {
        "x": 400,
        "y": 3000-36,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000-12,
        "maxY": 3000-160,
        "speed": 0.5,
      },
      {
        "x": 570,
        "y": 3000-80,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000-12,
        "maxY": 3000-160,
        "speed": 1
      },
      {
        "x": 740,
        "y": 3000-12,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000-12,
        "maxY": 3000-160,
        "speed": 1.5
      },
      {
        "x": 910,
        "y": 3000-100,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000-12,
        "maxY": 3000-160,
        "speed": 0.5,
      },
      {
        "x": 1080,
        "y": 3000-40,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000-12,
        "maxY": 3000-160,
        "speed": 0.2
      },
      {
        "x": 1250,
        "y": 3000-20,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 0,
        "maxY": 0,
        "speed": 0.7
      },
    ],
    "lavas": [
      {
        "x": 0,
        "y": 3000-12,
        "width": 4000,
        "height": 12,
        "color": "darkOrange",
      },
    ],
    "monstersPatrolers": [
      {
        "platformIndex": 5
      },
      {
        "platformIndex": 2
      },
      {
        "platformIndex": 4
      },
      {
        "platformIndex": 1
      },
      {
        "platformIndex": 0
      },
    ],
    "ladders": [
      {
        "x": 45,
        "y": 2772,
        "height": 204
      },
      {
        "x": 450,
        "y": 2596,
        "height": 140
      },
      {
        "x": 1300,
        "y": 2496,
        "height": 312
      },
      {
        "x": 1700,
        "y": 2724,
        "height": 252
      },
    ],
    "player": {
      "x": 30,
      "y": 3000 - 74,
    },
  },
]

module.exports = {
  getLevelData: function(index){
    return levels[index-1];
  },
}
