# Repo for Balonin Metro Station

## Code convention

1) When summoning new geometry - name it **geo** (always)
```js
var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_328 = new THREE.Mesh(geo, Blue_PictureMaterial);
```
And try to reuse it as much as possible. Makes less lines and better code readability

