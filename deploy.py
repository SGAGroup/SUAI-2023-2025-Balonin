#! /usr/bin/env python3

"""
README

# To execute script pass path to project main.ts as first argument.

> example:
> ./deploy.ps1 src/main.ts

# Syntax

`// balon setup begin`
starts `юст` block

`// balon setup end`
ends `юст` block

`// balon setup`
paste `юст` block

`// balon block begin`
starts balon block

`// balon block end`
ends balon block

`// balon ignore`
ignores next line

`// balon ignore begin`
starts ignore block

`// balon ignore end`
ends ignore block
"""


from pathlib import Path
import sys
import shutil
import subprocess

TSC_OUT = './out'
NPX = 'npx'
RESULT_PATH = './generated.balon.js'
FOOTER = """
{{html
<!DOCTYPE html>
<head>
 <script SRC="http://livelab.spb.ru/x3d/three.min.js"></script>
 <script SRC="http://livelab.spb.ru/x3d/OrbitControls.js"></script>
 <style>html, body {overflow: hidden;}</style>
</head>
html}}
"""
 
def get_ident_part(string):
    result = 0
    for char in string:
        if (char == ' '):
            result += 1
        else:
            break
    return ' ' * result

def get_tsc_result(expected_file_name):
    for path in Path(TSC_OUT).rglob(expected_file_name):
        return path
    return None

def postprocess(input):
    result = ''
    setup = ''

    is_balon_segment = False
    is_setup_segment = False
    is_ignore_segment = False
    ignore_count = 0

    for line in input.split('\n'):
        ident_part = get_ident_part(line)

        for ignore_token in ('// balon', '@ts-'):
            if ignore_token in line:
                ignore_count += 1

        if '// balon block begin' in line:
            is_balon_segment = True
        elif '// balon block end' in line:
            is_balon_segment = False
        elif '// balon ignore' in line:
            ignore_count += 1
        elif '// balon setup begin' in line:
            is_setup_segment = True
        elif '// balon setup end' in line:
            is_setup_segment = False
        elif '// balon setup' in line:
            for setup_line in setup.split('\n'):
                result += ident_part + setup_line + '\n'
        elif '// balon ignore begin' in line:
            is_ignore_segment = True
        elif '// begin ignore end' in line:
            is_ignore_segment = False

        if ignore_count == 0 and not is_ignore_segment:
            if is_balon_segment:
                if 'CreateScene(WC, HC)' in line and 'function' not in line:
                    result += ident_part + "var scene, camera, renderer; CreateScene(WC, HC);\n"
                else:
                    result += line + '\n'
                
            if is_setup_segment:
                setup += line.replace('var ', '').replace('const ', '').replace('let ', '') + '\n'

        if ignore_count != 0:
            ignore_count -= 1
    
    result = result.replace('let ', 'var ')
    result = result.replace('const ', 'var ')

    return result
    
if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise('usage: deploy.py [file_to_process]')

    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[1]).stem + '.js'

    print('run tsc...')
    
    if Path(TSC_OUT).exists():
        shutil.rmtree(TSC_OUT)

    if subprocess.run([NPX, '--version'], stdout=subprocess.DEVNULL).returncode:
        raise Exception('npx executable not found')

    result = subprocess.run([NPX, 'tsc', '--target', 'esnext', '--outDir', TSC_OUT, input_file], stdout=subprocess.DEVNULL)

    output_file_path = get_tsc_result(output_file)
    if output_file_path is None:
        print('tsc failed produce file:')
        print(result.stdout)
        print('stderr:')
        print(result.stderr)
        raise Exception('tsc failed to produce file')
       
    print('start postprocess...')

    with open(output_file_path, 'r', encoding="utf-8") as file:
        output_file_contents = file.read()

    postprocessed = postprocess(output_file_contents)

    with open(RESULT_PATH, 'w', encoding="utf-8") as file:
        file.write(postprocessed)

    # XXX messes up arrays
    # print('run formatter')
    #
    # subprocess.run([NPX, 'prettier', '--write', RESULT_PATH])
        
    print('apend footer')

    with open(RESULT_PATH, "a") as file:
        file.write(FOOTER)

    print('done')
