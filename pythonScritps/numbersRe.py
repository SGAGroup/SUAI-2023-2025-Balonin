import re

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f_in:
        content = f_in.read()
    
    def format_number(num):
        abs_num = abs(num)
        
        if abs_num < 0.0005:
            return '0'
        # elif abs_num < 0.009:
        #     return "{0:.4f}".format(round(num, 4))
        elif abs_num >= 10:
            # Округляем до 1 знака, убираем незначащие нули
            formatted = "{0:.1f}".format(round(num, 1))
            if formatted.endswith(".0"):
                return formatted[:-2]
            return formatted
        else:
            # Округляем до 2 знаков, убираем незначащие нули
            formatted = "{0:.2f}".format(round(num, 2))
            if formatted.endswith(".00"):
                return formatted[:-3]
            elif formatted.endswith("0"):
                return formatted[:-1]
            return formatted
    
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