# Repo for Balonin Metro Station

## Code convention

1) When summoning new geometry - name it **geo** (always)
```js
var geo = new THREE.BoxGeometry(2, 2, 2);
var cube = new THREE.Mesh(geo, Blue_PictureMaterial);
```
And try to reuse it as much as possible. Makes less lines and better code readability

2) Same with local materials - name it **mat** (not always)
```js
var mat = new THREE.MeshStandardMaterial({color:0x000000});
var cube = new THREE.Mesh(geo, mat);
```
Also try to reuse it.

3) If material will be used elsewhere - put it globally in *SetColorStuff()*
It should end with **mat**, for ex: col**mat**.
***ALWAYS*** set *roughness* to 1 (but sometimes you actually need to change it back to 0)
```js
colmat = new THREE.MeshStandardMaterial({color:0x000000,roughness:1});
```