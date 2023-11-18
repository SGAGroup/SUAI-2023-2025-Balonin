param([String]$file)

<#
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
#>

function get-ident-part([String]$str) {
    $result = 0
    foreach ($char in $str.ToCharArray()) {
        if ($char -eq ' ') {
            $result += 1
        }
        else {
            break
        }
    }
    return ' ' * $result
}

npx tsc --outDir out $file > $null

$content = Get-Content -Path $("out/" + [System.IO.Path]::GetFileNameWithoutExtension($file) + ".js")

$result = ""
$setup = ""

$is_balon_segment = $false
$is_setup_segment = $false
$is_ignore_segment = $false
$ignore_count = 0
foreach ($line in $content -split "`r`n") {
    $ident_part = get-ident-part($line)

    <# ignore current comment #>
    foreach ($to_ignore in "// balon block begin", "// balon ignore", "// balon setup", "// balon ignore begin", "// @ts-") {
        if ($line.Contains($to_ignore)) {
            $ignore_count += 1
        }
    }

    <# process current comment #>
    if ($line.Contains("// balon block begin")) {
        $is_balon_segment = $true
    }
    elseif ($line.Contains("// balon block end")) {
        $is_balon_segment = $false
    }
    elseif ($line.Contains("// balon ignore")) {
        $ignore_count += 1
    }
    elseif ($line.Contains("// balon setup begin")) {
        $is_setup_segment = $true
    }
    elseif ($line.Contains("// balon setup end")) {
        $is_setup_segment = $false
    }
    elseif ($line.Contains("// balon setup")) {
        foreach ($setup_line in $setup.Split("`r`n")) {
            $result += $ident_part + $setup_line + "`r`n"
        }
    }
    elseif ($line.Contains("// balon ignore begin")) {
        $is_ignore_segment = $true
    }
    elseif ($line.Contains("// balon ignore end")) {
        $is_ignore_segment = $false
    }

    <# process current segment #>
    if ($ignore_count -eq 0 -and -not $is_ignore_segment) {
        if ($is_balon_segment) {
            if ($line.Contains("CreateScene(WC, HC)") -and -not $line.Contains("function")) {
                $result += $ident_part + "var scene, camera, renderer; CreateScene(WC, HC);`r`n"
            }
            else {
                $result += $line + "`r`n"
            }
        }

        if ($is_setup_segment) {
            $setup += $line.Replace("var ", "").Replace("const ", "").Replace("let ", "") + "`r`n"
        }
    }
    
    <# update counters #>
    if ($ignore_count -ne 0) {
        $ignore_count -= 1
    }
}

$result += '
    {{html
    <!DOCTYPE html>
    <head>
     <script SRC="http://livelab.spb.ru/x3d/three.min.js"></script>
     <script SRC="http://livelab.spb.ru/x3d/OrbitControls.js"></script>
     <style>html, body {overflow: hidden;}</style>
    </head>
    html}}
'

<# post process #>
$result = $result.Replace("let ", "var ").Replace("const ", "var ")

Write-Output $result | clip
