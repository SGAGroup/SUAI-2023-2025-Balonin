import re

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f_in:
        content = f_in.read()
    
    def format_number(num):
        abs_num = abs(num)
        
        if abs_num < 0.001:
            return '0'
        elif abs_num >= 10:
            # Округляем до 1 знака, убираем незначащие нули
            return ('%.1f' % round(num, 1)).rstrip('0').rstrip('.') if round(num, 1) == int(round(num, 1)) else '%.1f' % round(num, 1)
        else:
            # Округляем до 2 знаков, убираем незначащие нули
            return ('%.2f' % round(num, 2)).rstrip('0').rstrip('.') if round(num, 2) == int(round(num, 2)) else '%.2f' % round(num, 2)
    
    def replace_float(match):
        num_str = match.group()
        try:
            num = float(num_str)
            return format_number(num)
        except ValueError:
            return num_str
    
    # Регулярное выражение для поиска всех чисел (включая отрицательные и научную нотацию)
    pattern = re.compile(r'-?\d*\.?\d+(?:[eE][-+]?\d+)?')
    processed_content = pattern.sub(replace_float, content)
    
    with open(output_file, 'w', encoding='utf-8') as f_out:
        f_out.write(processed_content)

# Пример использования
input_filename = 'input.ts'
output_filename = 'output.ts'
process_file(input_filename, output_filename)