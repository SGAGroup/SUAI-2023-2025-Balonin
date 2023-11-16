bl_info = {
    "name": "Converter to Baloning",
    "blender": (2, 80, 0),
    "category": "Object",
}

import bpy
import random
from math import pi
from mathutils import Color


class OBJECT_OT_run_script(bpy.types.Operator):
    bl_idname = "object.run_script"
    bl_label = "Convert to Baloning"
    bl_options = {'REGISTER', 'UNDO'}
    
    def getParameters(self, obj):
        command = ""
        textureAdditionParameters = ""
        deltaX = 0
        name = obj.name.replace(".","_")
        if "cube" in name.lower(): command = "BoxGeometry(2, 2, 2)"
        if "cylinder" in name.lower(): command = "CylinderGeometry(1, 1, 2)"
        if "circle" in name.lower(): 
            command = "CircleGeometry()"
            deltaX = pi/2
            textureAdditionParameters = ", side: THREE.DoubleSide"
        if "sphere" in name.lower(): command = "SphereGeometry()"
        if "cone" in name.lower(): command = "ConeGeometry(1, 2)"
        if "torus" in name.lower(): 
            command = "TorusGeometry(1, 0.25)"
            deltaX = pi/2
        if "plane" in name.lower(): 
            command = "PlaneGeometry(2, 2)"
            deltaX = pi/2
            textureAdditionParameters = ", side: THREE.DoubleSide"
        if "icosphere" in name.lower(): command = "IcosahedronGeometry(1, 1)"
        return (command, textureAdditionParameters, deltaX, name)
    
    def getPSR(self, ob, name, deltaX):
        message = ''
        if ob.location.x or ob.location.z or ob.location.y:  message += name + '.position.set(' + str(round(ob.location.x, 4)) +', '+ str(round(ob.location.z, 4)) + ', '+ str(round(-ob.location.y, 4)) +');\n'
        if ob.scale.x !=1 or ob.scale.z != 1 or ob.scale.y !=1: message += name + '.scale.set(' + str(round(ob.scale.x, 4)) +', '+ str(round(ob.scale.z, 4)) + ', '+ str(round(ob.scale.y, 4)) +');\n'
        if ob.rotation_euler.x + deltaX or ob.rotation_euler.z or ob.rotation_euler.y: message += name + '.rotation.set(' + str(round(ob.rotation_euler.x + deltaX, 4)) +', '+ str(round(ob.rotation_euler.z, 4)) + ', '+ str(round(-ob.rotation_euler.y, 4)) +');\n'
        return message;
    
    def getMaterialProp(self, obj, label):
        material = obj.material_slots[0].material
        nodes = material.node_tree.nodes
        principled = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
        inp = principled.inputs[label] 
        value = inp.default_value
        return value;

    def getColor(self, obj):
        try:
            value = self.getMaterialProp(obj, 'Base Color')
            color = Color( (value[0], value[1], value[2]) )
            return str(round(color.r, 4)) + ' ,' + str(round(color.g, 4)) + ' ,' + str(round(color.b, 4))
        except:
            return str(round(random.random(), 4)) + ', ' + str(round(random.random(), 4)) + ', ' + str(round(random.random(), 4))
        
    def getTransperency(self, obj):
        try:
            value = self.getMaterialProp(obj, 'Alpha')
            if value < 1: return ', transparent: true, opacity: ' + str(round(value, 4))
            else: return ''
        except:
            return ''
    def getMetallic(self, obj):
        try:
            value = self.getMaterialProp(obj, 'Metallic')
            if value > 0: return ', metallness: ' + str(round(value, 4))
            else: return ''
        except:
            return ''
    
    def getRoughness(self, obj):
        try:
            value = self.getMaterialProp(obj, 'Roughness')
            if value < 1: return ', roughness: ' + str(round(value, 4))
            else: return ''
        except:
            return ''
    
    def getEmmission(self, obj):
        try:
            value = self.getMaterialProp(obj, 'Emission')
            color = Color( (value[0], value[1], value[2]) )
            if value[0] != 0 and value[1] != 0 and value[2] != 0: return ', emissive: ' + 'new THREE.Color('+ str(round(color.r, 4)) + ' ,' + str(round(color.g, 4)) + ' ,' + str(round(color.b, 4)) +')'
            else: return ''
        except:
            return ''
    
    def addMaterial(self, obj, name, textureAdditionParameters, materials, materialsString):
        try:
            name = obj.material_slots[0].material.name
            if "material" not in name.lower(): name += "Material"
            if textureAdditionParameters != "": name += "DS"
            if name in materials: return (name, materials, materialsString)
            materialsString += 'var ' + name + ' = new THREE.MeshStandardMaterial({ color: new THREE.Color('+ self.getColor(obj) +')'+ textureAdditionParameters + self.getTransperency(obj) + self.getMetallic(obj) + self.getRoughness(obj) + self.getEmmission(obj) + ' });\n'
            materials.append(name)
            return (name, materials, materialsString)
        except:
            name = name + 'Material'
            if textureAdditionParameters != "": name += "DS"
            materialsString += 'var ' + name + ' = new THREE.MeshStandardMaterial({ color: new THREE.Color('+ self.getColor(obj) +')'+ textureAdditionParameters +' });\n'
            materials.append(name)
            return (name, materials, materialsString)
            

    def execute(self, context):
        scene = context.scene
        cursor = scene.cursor.location

        message = ""
        names = []
        materialsString = ""
        materials = []
        
        for ob in context.selected_objects:
            command, textureAdditionParameters, deltaX, name = self.getParameters(ob)
            materialName, materials, materialsString = self.addMaterial(ob, name, textureAdditionParameters, materials, materialsString)
            message += 'var ' + name + 'Geometry' + ' = new THREE.'+command+';\n'
            message += 'var ' + name + ' = new THREE.Mesh( '+name + 'Geometry'+', '+ materialName +' );\n'
            message += self.getPSR(ob, name, deltaX)+'\n'
            names.append(name)
        message = materialsString +'\n' + message
        message +='var out = new THREE.Group();\n'
        message +='out.add('+', '.join(names)+')'
        bpy.context.window_manager.clipboard = message
        self.report({'INFO'}, message)
        self.report({'INFO'}, "Script copied to clipboard!")

        return {'FINISHED'}

def menu_func(self, context):
    self.layout.operator(OBJECT_OT_run_script.bl_idname)

def register():
    bpy.utils.register_class(OBJECT_OT_run_script)
    bpy.types.VIEW3D_MT_object.append(menu_func)

def unregister():
    bpy.utils.unregister_class(OBJECT_OT_run_script)
    bpy.types.VIEW3D_MT_object.remove(menu_func)

if __name__ == "__main__":
    register()