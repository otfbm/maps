# Tokens

**Defining tokens**
Tokens are optional and you can define as many as you need separating each with the `/` character. Tokens are defined with a letter and a number. The letter represents the X axis and the number, the Y axis so `C7` in X,Y would be `3,7` ie. 3 grid squares in from the left, 7 down from the top.

**Token colors**
You can color tokens a limited number of colors using a letter indicator. Use any of the following letters with the token definition to change its color.

`w` for `white`  
`bk` or `k` for `black`  
`gy` or `e` or `a` for `grey`  
`r` for `red`  
`g` for `green`  
`b` for `blue`  
`y` for `yellow`  
`p` for `purple`  
`c` for `cyan`  
`bn` or `n` for `brown`  
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
