# On The Fly Battle Maps

URL: `http://otfbm.com`

**URL structure**
```
http://otfbm.com/[<grid size>]/[<token 1>/<token 2>/<etc>]
```

_**Examples:**_
```
http://otfbm.com/D3/A1/G4
```
```
http://otfbm.com/5x5/D3/A1/G4
```
```
http://otfbm.com/7x4/D3L/A1-Hero/G4y
```

**Battle map size**
Battlemap size is specified with `widthxheight` like so `6x6`
The size is optional and if you leave it out, it defaults to `10x10`

_**Example**_
```
http://otfbm.com/3x4
```

**Defining tokens**
Tokens are optional and you can define as many as you need separating each with the `/` character. Tokens are defined with a letter and a number. The letter represents the X axis and the number, the Y axis so `C7` in X,Y would be `3,7` ie. 3 grid squares in from the left, 7 down from the top.

**Token colors**
You can color tokens a limited number of colors using a letter indicator. Use any of the following letters with the token definition to change its color.

`g` for `forestgreen`
`r` for `firebrick`
`b` for `cornflowerblue`
`y` for `gold`
`p` for `darkviolet`
`c` for `deepskyblue`
`d` for `darkgoldenrod`

So to make a token at `F3` gold colored, just add `y` eg. `F3y`

_**Example**_
```
http://otfbm.com/D3p/A1r/G4y
```

**Token sizes**
You can change the token sizes to any of D&Ds monster sizes by adding a letter indicator. Use any of the following letters to indicate size:

`T` for `tiny`
`S` for `small`
`M` for `medium`
`L` for `large`
`H` for `huge`
`G` for `gargantuan`

So to make a token at `G5` large sized, just add `L` eg. `G5L`

_**Example**_
```
http://otfbm.com/D3L/A1M/G4S
```

**Token Labels**
You can add text labels to tokens. When doing so be careful not to use too much text or it will run outside the edge of the token. Labels are added using a `-` character and then the label. Eg. `-Goblin`

_**Example**_
```
http://otfbm.com/D3-Goblin/A1-Goblin/G4-Fighter
```

## Background Images

You can add images to your battle map by providing a link to an external image, or by using one of the default images provided by On The Fly Battle Maps.

**Default Backgrounds**
The default background images can be accessed by providing a `=#` paramater within your request, where `#` corresponds to the index of the background you would like to use.

On The Fly Battle Maps provides the following default backgrounds:

1. Grass Texture

_**Example - Default Background**_
```
http://otfbm.com/D3-Goblin/A1-Goblin/=1
```

**Custom Backgrounds**
Callers can add custom backgrounds to their maps by providing the image's url in the map request.

Maps provided by callers are expected to meet the following requirements:

* Maps are expected to have a grid scale of 40 px
* Maps are expected to be fitted to the grid size requested in the url. So if a map is 23x12, then the caller is expected to provide a size of 23x12 when making a map request. 

_**Example - Default Background**_
```
http://otfbm.com/E7p-Zombie/I3p-Zombie?bg=https://i.imgur.com/k99s0ch.jpg
```

## Drawing walls and doors

You can draw walls and doors directly onto a battlemap using coordinates. To draw a wall, use the `_` character followed by coordinates.

### Basics

**Example**

```
https://otfbm.com/_B3J3
```

This will draw a line from B3 to J3

### Multiple lines

You can finish a line and start a new one with the `_` character

*Example*

```
https://otfbm.com/_B3J3_B6J6
```

### Single and double doors

You can add single doors with the `]` character and double doors with the `[` character

Here is a complex example:

**Example**

```
https://otfbm.com/_B1K1K11E11[E6B6A5[A2B1_E1]E4]E6_E4]G4[K4_E6]K6_G1G4
```

### Additional Options
You can specify additional drawing options by providing the following parameters after a `@`.

**Dark Mode** You can use a darker coordinate border by providing the `d` option.

**Grid Transparency** You can draw a grid at half transparency by providing the `h` option, or you can have an invisible grid by providing `n`;

**Zoom** You can zoom in on the battle map by providing a number `1-3`.

*Example* - A map drawn with a darker background and no gridlines, with a zoom value of 2, with a token in the top left corner.

```
https://otfbm.com/@2dn/A1
```
