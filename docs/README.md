# On The Fly Battle Maps

* URL: `http://otfbm.com`
* JOIN OUR DISCORD: https://discord.gg/PVCtMqN

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

`w` for `white`  
`bk` for `black` (or `k`)  
`gy` for `grey` (or `e`, `a`)  
`r` for `red`  
`g` for `green`  
`b` for `blue`  
`y` for `yellow`  
`p` for `purple`  
`c` for `cyan`  
`bn` for `brown` (or `n`)  
`o` for `orange`  

So to make a token at `F3` gold colored, just add `y` eg. `F3y`

Colour can also be specifed with `~` and a 3 or 6 digit hex code. E.g. `~f80` or `~f98010`.

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

### Walls

**Example**

```
https://otfbm.com/_B3J3
```

This will draw a line from B3 to J3

### Multiple Walls

You can finish a line and start a new one with the `_` character

*Example*

```
https://otfbm.com/_B3J3_B6J6
```

### Doors

You can add doors with following characters:  

`-` open door,  
`]` closed door,  
`[` double door,  
`$` secret door  

Here is a complex example:

**Example**

```
https://otfbm.com/_B2G2G4H4[H6G6G8$F9E10]C10B10B2_B6-G6
```

## Spell overlays

To draw a spell overlay, use the `*` character then the following shape codes: `c` circle, `l` line, `s` square, `t` cone. See below for parameters.

### Examples

```
http://otfbm.com/*c20rd5
```
`*c` circle `20` diameter `r` _colour_ `d5` center co-ordinate

```
http://otfbm.com/*t50ba5e5
```
`*t` cone `50` length `b` _colour_ `a5` start co-ordinate `e5` direction co-ordinate

```
http://otfbm.com/*l30,5ga1b2
```
`*l` line `30` length `,5` _width_ `g` _colour_ `a1` start co-ordinate `b2` direction co-ordinate

```
http://otfbm.com/*s30ca1b2
```
`*s` square `30` size `c` _colour_ `a1` start co-ordinate `b2` direction co-ordinate

## Additional Options
You can specify additional drawing options by providing the following parameters after a `@`.

**Dark Mode** You can use a darker coordinate border by providing the `d` option.

**Grid Transparency** You can draw a grid at half transparency by providing the `h` option, or you can have an invisible grid by providing `n`;

**Zoom** You can zoom in on the battle map by providing a number `1-3`.

*Example* - A map drawn with a darker background and no gridlines, with a zoom value of 2, with a token in the top left corner.

```
https://otfbm.com/@2dn/A1
```
