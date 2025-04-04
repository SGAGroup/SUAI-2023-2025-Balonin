import re

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f_in:
        content = f_in.read()
    
    # Функция для обработки каждого найденного числа
    def replace_float(match):
        num_str = match.group()
        try:
            num = float(num_str)
            # Округляем до двух знаков
            rounded = round(num, 2)
            # Проверяем условие замены на 0
            if abs(rounded) < 0.03:
                return '0'
            else:
                # Возвращаем строку с двумя знаками после запятой (например, 1.0 -> 1.00)
                return "{0:.2f}".format(rounded)
        except ValueError:
            return num_str  # если не получилось преобразовать, вернем как было
    
    # Регулярное выражение для поиска всех дробных чисел (включая отрицательные)
    pattern = re.compile(r'-?\d+\.\d+')
    processed_content = pattern.sub(replace_float, content)
    
    with open(output_file, 'w', encoding='utf-8') as f_out:
        f_out.write(processed_content)

# Пример использования
input_filename = 'input.txt'  # имя входного файла
output_filename = 'output.txt'  # имя выходного файла
process_file(input_filename, output_filename)