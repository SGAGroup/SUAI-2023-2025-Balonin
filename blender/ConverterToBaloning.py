bl_info = {
    "name": "Converter to Baloning",
    "blender": (2, 80, 0),
    "category": "Object",
}

import bpy
import random
from math import pi
from mathutils import Color
import numpy as np
from bpy.props import FloatVectorProperty



class OBJECT_OT_run_script(bpy.types.Operator):
    bl_idname = "object.run_script"
    bl_label = "Convert to Baloning"
    bl_options = {'REGISTER', 'UNDO'}
    
    def get_parameters(self, obj):
        command = ""
        texture_addition_parameters = ""
        delta_x = 0
        name = obj.name.replace(".", "_").lower()
        
        if "cube" in name: 
            command, delta_x = "BoxGeometry(2, 2, 2)", 0
        elif "cylinder" in name: 
            command, delta_x = "CylinderGeometry(1, 1, 2, 32)", 0
        elif "circle" in name: 
            command, delta_x, texture_addition_parameters = "CircleGeometry()", pi/2, ", side: THREE.DoubleSide"
        elif "sphere" in name: 
            command, delta_x = "SphereGeometry(1, 32, 16)", 0
        elif "cone" in name: 
            command, delta_x = "ConeGeometry(1, 2, 32)", 0
        elif "torus" in name: 
            command, delta_x = "TorusGeometry(1, 0.25, 12, 48)", pi/2
        elif "plane" in name: 
            command, delta_x, texture_addition_parameters = "PlaneGeometry(2, 2)", pi/2, ", side: THREE.DoubleSide"
        elif "icosphere" in name: 
            command, delta_x = "IcosahedronGeometry(1, 1)", 0
        
        return command, texture_addition_parameters, delta_x, name
    
    def get_psr(self, ob, name, delta_x):
        message = ''
        if any(ob.location):  
            message += f"{name}.position.set({round(ob.location.x, 4)}, {round(ob.location.z, 4)}, {round(-ob.location.y, 4)});\n"
        if ob.scale.x != 1 or ob.scale.y != 1 or ob.scale.z != 1: 
            message += f"{name}.scale.set({round(ob.scale.x, 4)}, {round(ob.scale.z, 4)}, {round(ob.scale.y, 4)});\n" if not delta_x else f"{name}.scale.set({round(ob.scale.x, 4)}, {round(ob.scale.y, 4)}, {round(ob.scale.z, 4)});\n" 
        if any(ob.rotation_euler) or delta_x:
            message += f"{name}.setRotation({round(ob.rotation_euler.x + delta_x, 4)}, {round(ob.rotation_euler.z, 4)}, {round(-ob.rotation_euler.y, 4)});\n"
        return message
    
    def get_material_prop(self, obj, label):
        material = obj.material_slots[0].material
        nodes = material.node_tree.nodes
        principled = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
        inp = principled.inputs[label] 
        return inp.default_value
            
    def get_color(self, obj):
        try:
            value = self.get_material_prop(obj, 'Base Color')
            color = Color(value[:3])
            return f"{round(color.r, 4)}, {round(color.g, 4)}, {round(color.b, 4)}"
        except:
            return f"{round(random.random(), 4)}, {round(random.random(), 4)}, {round(random.random(), 4)}"
        
    def get_transparency(self, obj):
        try:
            value = self.get_material_prop(obj, 'Alpha')
            return f", transparent: true, opacity: {round(value, 4)}" if value < 1 else ''
        except:
            return ''
    
    def get_metallic(self, obj):
        try:
            value = self.get_material_prop(obj, 'Metallic')
            return f", metalness: {round(value, 4)}" if value > 0 else ''
        except:
            return ''
    
    def get_roughness(self, obj):
        try:
            value = self.get_material_prop(obj, 'Roughness')
            return f", roughness: {round(value, 4)}" if value < 1 else ''
        except:
            return ''
    
    def get_emission(self, obj):
        try:
            value = self.get_material_prop(obj, 'Emission')
            color = Color(value[:3])
            
            return f", emissive: new THREE.Color({round(color.r, 4)}, {round(color.g, 4)}, {round(color.b, 4)})" if any(color) else ''
        except:
            return ''
    
    def add_material(self, obj, name, texture_addition_parameters, materials, materials_string):
        try:
            name = obj.material_slots[0].material.name + "Material" if "material" not in obj.material_slots[0].material.name.lower() else obj.material_slots[0].material.name
            name = name.replace(".", "_")
            name += "DS" if texture_addition_parameters else ""
            
            if name in materials: 
                return name, materials, materials_string
            
            materials_string += f"var {name} = new THREE.MeshStandardMaterial({{ color: new THREE.Color({self.get_color(obj)}){texture_addition_parameters}{self.get_transparency(obj)}{self.get_metallic(obj)}{self.get_roughness(obj)}{self.get_emission(obj)} }});\n"
            materials.append(name)
            
            return name, materials, materials_string
        except:
            name = name + 'Material'
            name += "DS" if texture_addition_parameters else ""
            materials_string += f"var {name} = new THREE.MeshStandardMaterial({{ color: new THREE.Color({self.get_color(obj)}){texture_addition_parameters} }});\n"
            materials.append(name)
            return name, materials, materials_string

    def get_light(self, obj, lights, lights_string):
        name = obj.name.replace(".", "_").lower()
        color = "0xffffff"
        power = 1
        try:
            cl =  Color(obj.data.color[:3])
            color = f"new THREE.Color({round(cl.r, 4)}, {round(cl.g, 4)}, {round(cl.b, 4)})"
            power = obj.data.energy / 10
        except:...
            
        if "sun" in name:
            lights_string += f"var {name} = new THREE.DirectionalLight( {color}, {power} );\n"
        elif "point" in name:
            lights_string += f"var {name} = new THREE.PointLight({color}, {power});\n"
        elif "spot" in name:
            lights_string += f"var {name} = new THREE.SpotLight({color}, {power});\n"
        elif "area" in name:
            lights_string += f"var {name} = new THREE.RectAreaLight({color}, {power});\n" 
        if any(obj.location):  
            lights_string += f"{name}.position.set({round(obj.location.x, 4)}, {round(obj.location.z, 4)}, {round(-obj.location.y, 4)});\n"
        if any(obj.rotation_euler):
            lights_string += f"{name}.setRotation({round(obj.rotation_euler.x, 4)}, {round(obj.rotation_euler.z, 4)}, {round(-obj.rotation_euler.y, 4)});\n"
        lights.append(name)    
        return lights, lights_string

    def get_for_cycle(self, s, obj, name, key, x, y, z, psr, ob, delta_x):
        cons, rel = obj.constant_offset_displace, obj.relative_offset_displace
        cons[0],cons[1],cons[2]= cons[0] * ob.scale.x, cons[1] * ob.scale.y, cons[2] * ob.scale.z
        self.report({'INFO'}, str([obj.use_relative_offset, obj.use_constant_offset]))
        if not obj.use_relative_offset: rel = [0,0,0]
        if not obj.use_constant_offset: cons = [0,0,0]
        result = f"var {name}Group = new THREE.Group();\n"
        result += f"for(var {key} = 0; {key}<{obj.count}; {key}++)"+ "{\n"
        result += s
        if not psr: 
            if ob.scale.x != 1 or ob.scale.y != 1 or ob.scale.z != 1: 
                result += f"{name}.scale.set({round(ob.scale.x, 4)}, {round(ob.scale.z, 4)}, {round(ob.scale.y, 4)});\n" if not delta_x else f"{name}.scale.set({round(ob.scale.x, 4)}, {round(ob.scale.y, 4)}, {round(ob.scale.z, 4)});\n"
        offsetX = f"{round(cons[0]+rel[0]*x, 4)} * {key}" if cons[0] or rel[0] else "0"
        offsetY = f"{round(cons[2]+rel[2]*z, 4)} * {key}" if cons[2] or rel[2] else "0"
        offsetZ = f"{-round(cons[1]+rel[1]*y, 4)} * {key}" if cons[1] or rel[1] else "0"
        result += f"{name}.position.set({offsetX}, {offsetY}, {offsetZ});\n"
        result += f"{name}Group.add({name});\n"+"}\n"

        x = x*obj.count+(cons[0] - x +abs(rel[0])*x)*(obj.count-1) if cons[0] or rel[0] else x
        y = y*obj.count+(cons[1] - y +abs(rel[1])*y)*(obj.count-1) if cons[1] or rel[1] else y
        z = z*obj.count+(cons[2] - z +abs(rel[2])*z)*(obj.count-1) if cons[2] or rel[2] else z

        psr = True

        return f"{name}Group", result, x, y, z, psr
        
    def get_mirrored_object(self, s, mod, obj, name, x, y, z, delta_x, psr):
        self.report({'INFO'}, str(mod.mirror_object))
        bx, by, bz = mod.use_axis
        lx, ly, lz = obj.location.x, obj.location.y, obj.location.z
        ex, ey, ez = obj.rotation_euler.x, obj.rotation_euler.y, obj.rotation_euler.z
        blx, bly, blz = False, False, False
        bex, bey, bez = False, False, False
        dx = -round(mod.mirror_object.location.x*2 - lx, 4)
        dy = -round(mod.mirror_object.location.y*2 - ly, 4)
        dz = -round(mod.mirror_object.location.z*2 - lz, 4)
        rx = round(-ex + delta_x, 4)
        ry = round(ey, 4)
        rz = round(-ez, 4)
        result=s;
        if not psr:
            result += f"{name}.scale.set({round(obj.scale.x, 4)}, {round(obj.scale.z, 4)}, {round(obj.scale.y, 4)});\n" if not delta_x else f"{name}.scale.set({round(obj.scale.x, 4)}, {round(obj.scale.y, 4)}, {round(obj.scale.z, 4)});\n"
        
        if bx:
            bex = True
            blx = True
            c_name = name + "MX"
            result += f'{name}.setRotation({round(ex + delta_x, 4)}, {round(ez, 4)}, {round(-ey, 4)});\n'
            result += f'var {c_name}= {name}.clone();\n'
            result += f"{name}.position.set({round(lx, 4)}, 0, 0);\n"
            result += f"{c_name}.position.set({round(dx, 4)}, 0, 0);\n"
            result += f'{c_name}.applyMatrix({c_name}.matrixWorld.makeScale(-1, 1, 1));\n'
            result += f'var {name}MirroredX = new THREE.Group();\n'
            result += f'{name}MirroredX.add({name}, {c_name});\n'
            name += "MirroredX"
        if by:
            bly = True
            bex = True
            c_name = name + "MZ"
            if not blx:
                result += f'{name}.setRotation({round(ex + delta_x, 4)}, {round(ez, 4)}, {round(-ey, 4)});\n'
            result += f'var {c_name}= {name}.clone();\n'
            result += f"{name}.position.set(0, 0, {-round(ly, 4)});\n"
            result += f'{c_name}.position.set(0, 0, {-dy});\n'
            result += f'{c_name}.applyMatrix({c_name}.matrixWorld.makeScale(1, 1, -1));\n'
            result += f'var {name}MirroredZ = new THREE.Group();\n'
            result += f'{name}MirroredZ.add({name}, {c_name});\n'
            name += "MirroredZ"
        if bz:
            blz = True
            bex = True
            c_name = name + "MY"
            if not bly and not blx:
                result += f'{name}.setRotation({round(ex + delta_x, 4)}, {round(ez, 4)}, {round(-ey, 4)});\n'
            result += f'var {c_name}= {name}.clone();\n'
            result += f"{name}.position.set(0, {round(lz, 4)}, 0);\n"
            result += f'{c_name}.position.set(0, {dz}, 0);\n'
            result += f'{c_name}.applyMatrix({c_name}.matrixWorld.makeScale(1, -1, 1);\n'
            result += f'var {name}MirroredY = new THREE.Group();\n'
            result += f'{name}MirroredY.add({name}, {c_name});\n'
            name += "MirroredY"
            
        if any((not bly, not blz, not blx)):
            result += f"{name}.position.set({0 if blx else round(lx, 4)},{0 if blz else round(lz, 4)},{0 if bly else round(-ly, 4)});\n"

        return name, result, x, y, z

    def get_mesh_with_modifiers(self, obj, name, material_name, isFunction):
        psr = False
        mir = False
        _, _, delta_x, _ = "", "", 0, "" if isFunction else self.get_parameters(obj)
        x,y,z = obj.mesh_dimensions
        bykvs = ["i","j","k","f","u","w","h"]
        try:
            k = -1;
            if isFunction:
                result = f"var {name} = {name.split('Entity')[0]}();\n"
            else:
                result = f"var {name} = new THREE.Mesh({name}Geometry, {material_name});\n"
            for i in obj.modifiers:
                if i.type == "ARRAY":
                    k+=1;
                    self.report({'INFO'}, str([x,y,z]))
                    name, result, x, y, z, psr = self.get_for_cycle(result, i, name, bykvs[k], x, y, z, psr, obj, delta_x)
                        
                if i.type == "MIRROR":
                    name, result, x, y, z = self.get_mirrored_object(result, i, obj, name, x, y, z, delta_x, psr)
                    mir = True;
                    psr = True
            if not psr:
                result += f"{self.get_psr(obj, name, delta_x)}\n"
                psr = True
            if k >= 0 and not mir:
                if any(obj.rotation_euler) or delta_x:
                    result += f"{name}.setRotation({round(obj.rotation_euler.x + delta_x, 4)}, {round(obj.rotation_euler.z, 4)}, {round(-obj.rotation_euler.y, 4)});\n"
                if any(obj.location):  
                    result += f"{name}.position.set({round(obj.location.x, 4)}, {round(obj.location.z, 4)}, {round(-obj.location.y, 4)});\n"
            return name, result
        except:
            return name,f"var {name} = {name.split('Entity')[0]}();\n" if isFunction else f"var {name} = new THREE.Mesh({name}Geometry, {material_name});\n"

    
    def get_function(self, obj, message): 

        light_types = ["area", "sun", "spot", "point"]

        message += f"function {obj.name}() {'{'}"
        functions= ""
        names = []
        materials_string = ""
        materials = []
        lights_string = ""
        lights = []
        
        for obj in context.selected_objects:
            if any(light_type in obj.name.lower() for light_type in light_types):
                lights, lights_string = self.get_light(obj, lights, lights_string)
            elif "function" in obj.name.lower() and "entity" in obj.name.lower():
                name, text = self.get_mesh_with_modifiers(obj, obj.name, "", True)
                message += text;
                names.append(name)
            elif "function" in obj.name.lower():
                functions = self.get_function(obj, functions)
            else:
                command, texture_addition_parameters, delta_x, name = self.get_parameters(obj)
                material_name, materials, materials_string = self.add_material(obj, name, texture_addition_parameters, materials, materials_string)
                
                message += f"var {name}Geometry = new THREE.{command};\n"
                name, text = self.get_mesh_with_modifiers(obj, name, material_name, False)
                message +=text
                names.append(name)

        message = f"{functions}\n{lights_string}\n{materials_string}\n{message}"
        message += f"var out = new THREE.Group();\n"
        message += f"out.add({', '.join(names)})\n"
        message += f"out.add({', '.join(lights)})\n" if lights else ""
        message += f"return out \n{'}'}"
        return message

    def execute(self, context):
        scene = context.scene
        cursor = scene.cursor.location
        light_types = ["area", "sun", "spot", "point"]

        message = ""
        functions= ""
        names = []
        materials_string = ""
        materials = []
        lights_string = ""
        lights = []
        
        for obj in context.selected_objects:
            if any(light_type in obj.name.lower() for light_type in light_types):
                lights, lights_string = self.get_light(obj, lights, lights_string)
            elif "function" in obj.name.lower() and "entity" in obj.name.lower():
                name, text = self.get_mesh_with_modifiers(obj, obj.name, "", True)
                message += text;
                names.append(name)
            elif "function" in obj.name.lower():
                functions = self.get_function(obj, functions)
            else:
                command, texture_addition_parameters, delta_x, name = self.get_parameters(obj)
                material_name, materials, materials_string = self.add_material(obj, name, texture_addition_parameters, materials, materials_string)
                
                message += f"var {name}Geometry = new THREE.{command};\n"
                name, text = self.get_mesh_with_modifiers(obj, name, material_name, False)
                message +=text
                names.append(name)

        message = f"{functions}\n{lights_string}\n{materials_string}\n{message}"
        message += f"var out = new THREE.Group();\n"
        message += f"out.add({', '.join(names)})\n"
        message += f"out.add({', '.join(lights)})\n" if lights else ""
        bpy.context.window_manager.clipboard = message
        self.report({'INFO'}, message)
        self.report({'INFO'}, "Script copied to clipboard!")

        return {'FINISHED'}

def get_mesh_dims(self):
    if self.type != 'MESH':
        return None
    me = self.data
    coords = np.empty(3 * len(me.vertices))
    
    me.vertices.foreach_get("co", coords)
    x,y,z =[],[],[]
    for i in coords.reshape(-1, 3):
        x.append(i[0])
        y.append(i[1])
        z.append(i[2])

    return (
            (max(x) - min(x))*self.scale.x,
            (max(y) - min(y))*self.scale.y,
            (max(z) - min(z))*self.scale.z
            )

bpy.types.Object.mesh_dimensions = FloatVectorProperty(
        name="Mesh Dimensions",
        get=get_mesh_dims,
        subtype='XYZ',
        unit='LENGTH',
        )

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

