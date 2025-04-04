import re

# Словарь соответствий геометрий и их новых имен
geometry_map = {
    'BoxGeometry(2, 2, 2)': 'boxGeo',
    'CylinderGeometry(1, 1, 2, 32)': 'cylinderGeo',
    'SphereGeometry(1, 32, 16)': 'sphereGeo',
    'ConeGeometry(1, 2, 32)': 'coneGeo',
    'TorusGeometry(1, 0.25, 12, 48)': 'torusGeo',
    'PlaneGeometry(2, 2)': 'planeGeo',
    'IcosahedronGeometry(1, 1)': 'icosahedronGeo'
}

def process_file(input_file, output_file):
    # Читаем весь файл
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Словарь для хранения замен переменных
    variable_replacements = {}
    
    # Находим все объявления геометрий
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        # Проверяем, является ли строка объявлением геометрии
        geometry_found = False
        for geometry, replacement in geometry_map.items():
            pattern = rf'const (\w+) = new THREE\.{re.escape(geometry)};'
            match = re.match(pattern, line.strip())
            if match:
                variable_replacements[match.group(1)] = replacement
                geometry_found = True
                break
        
        # Если это не строка с объявлением геометрии, добавляем её
        if not geometry_found:
            new_lines.append(line)

    # Обновленный контент без строк объявления геометрий
    updated_content = '\n'.join(new_lines)

    # Заменяем все вхождения старых переменных на новые
    for old_var, new_var in variable_replacements.items():
        updated_content = re.sub(rf'\b{old_var}\b', new_var, updated_content)

    # Записываем результат в новый файл
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)

# Пример использования
input_file = 'input.ts'  # Замените на имя вашего входного файла
output_file = 'output.ts'  # Имя выходного файла
process_file(input_file, output_file)
print(f"Обработка завершена. Результат сохранен в {output_file}")