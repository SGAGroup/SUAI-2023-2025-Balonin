import re

# Словарь замен
replacements = {
    "cube_": "kub",
    "cylinder_": "cyl",
    "circle_": "cir",
    "sphere_": "sph",
    "cone_": "con",
    "torus_": "tor",
    "plane_": "pln",
    "icosphere_": "ico",
    "Mirrored": "Mr"  
}

def replace_variable_names(input_file, output_file):
    try:
        # Читаем входной файл
        with open(input_file, 'r', encoding='utf-8') as file:
            content = file.read()

        # Сначала заменяем все префиксы кроме Group
        modified_content = content
        for old, new in replacements.items():
            pattern = r'\b' + re.escape(old) + r'(\d*|\b)'
            modified_content = re.sub(pattern, new + r'\1', modified_content)

        # Отдельная обработка для Group, исключая Three.Group
        pattern_group = r'(?<!THREE\.)Group\b'
        modified_content = re.sub(pattern_group, 'Gr', modified_content)

        # Записываем результат в выходной файл
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        
        print(f"Файл успешно обработан. Результат сохранен в {output_file}")
        
    except FileNotFoundError:
        print(f"Ошибка: Файл {input_file} не найден")
    except Exception as e:
        print(f"Произошла ошибка: {str(e)}")

# Пример использования
if __name__ == "__main__":
    input_file = "input.ts"    # Имя входного файла
    output_file = "output.ts"  # Имя выходного файла
    replace_variable_names(input_file, output_file)