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
        if ob.scale != (1, 1, 1): 
            message += f"{name}.scale.set({round(ob.scale.x, 4)}, {round(ob.scale.z, 4)}, {round(ob.scale.y, 4)});\n"
        if any(ob.rotation_euler) or delta_x: 
            message += f"{name}.rotation.set({round(ob.rotation_euler.x + delta_x, 4)}, {round(ob.rotation_euler.z, 4)}, {round(-ob.rotation_euler.y, 4)});\n"
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
            name = obj.material_slots[0].material.name.lower() if "material" not in name else name
            name += "DS" if texture_addition_parameters else ""
            
            if name in materials: 
                return name, materials, materials_string
            
            materials_string += f"var {name} = new THREE.MeshStandardMaterial({{ color: new THREE.Color({self.get_color(obj)}){texture_addition_parameters}{self.get_transparency(obj)}{self.get_metallic(obj)}{self.get_roughness(obj)}{self.get_emission(obj)} }});\n"
            materials.append(name)
            
            return name, materials, materials_string
        except:
            name = name + 'material'
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
            lights_string += f"{name}.rotation.set({round(obj.rotation_euler.x, 4)}, {round(obj.rotation_euler.z, 4)}, {round(-obj.rotation_euler.y, 4)});\n"
        lights.append(name)    
        return lights, lights_string

    def execute(self, context):
        scene = context.scene
        cursor = scene.cursor.location

        message = ""
        names = []
        materials_string = ""
        materials = []
        lights_string = ""
        lights = []
        
        for obj in context.selected_objects:
            light_types = ["area", "sun", "spot", "point"]
            if any(light_type in obj.name.lower() for light_type in light_types):
                lights, lights_string = self.get_light(obj, lights, lights_string)
            else:
                command, texture_addition_parameters, delta_x, name = self.get_parameters(obj)
                material_name, materials, materials_string = self.add_material(obj, name, texture_addition_parameters, materials, materials_string)
                
                message += f"var {name}Geometry = new THREE.{command};\n"
                message += f"var {name} = new THREE.Mesh({name}Geometry, {material_name});\n"
                message += f"{self.get_psr(obj, name, delta_x)}\n"
                names.append(name)

        message = f"{lights_string}\n{materials_string}\n{message}"
        message += f"var out = new THREE.Group();\n"
        message += f"out.add({', '.join(names)})\n"
        message += f"out.add({', '.join(lights)})\n"
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